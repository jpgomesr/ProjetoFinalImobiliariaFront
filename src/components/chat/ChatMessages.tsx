import React, {
   useEffect,
   useState,
   useRef,
   useCallback,
   useMemo,
} from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { enviarNotificacao } from "@/Functions/notificacao/enviarNotificacao";

interface ChatMessagesProps {
   chat: number;
   closeChat: () => void;
   isMobile: boolean;
}

interface ChatUser {
   id: number | string;
   nome?: string;
}

interface DisplayMessage {
   id?: number;
   conteudo: string;
   remetente: string;
   idChat: number;
   timestamp: string;
   isSender: boolean;
   nomeRemetente?: string;
}

const ChatMessages = ({ chat, closeChat, isMobile }: ChatMessagesProps) => {
   const [messages, setMessages] = useState<DisplayMessage[]>([]);
   const [chatPartner, setChatPartner] = useState<ChatUser | null>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const messagesFetchedRef = useRef(false);
   const chatSubscriptionRef = useRef<any>(null);
   const idDestinatarioRef = useRef<string | number>("");
   const initialLoadDoneRef = useRef(false);
   const connectionRetryRef = useRef<NodeJS.Timeout | null>(null);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Usar o contexto global
   const {
      stompClient,
      isConnected,
      userId,
      userName,
      updateChat,
      addNewMessage,
      chats,
      token,
      resetConnection,
   } = useChat();

   const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, []);

   useEffect(() => {
      scrollToBottom();
   }, [messages, scrollToBottom]);

   // Função para marcar mensagens como lidas
   const markMessagesAsRead = useCallback(async () => {
      if (!token || !userId) {
         console.error("Token ou userId não disponível");
         return;
      }

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chat}/marcarLidas?idUsuario=${userId}`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (!response.ok) {
            if (response.status === 403) {
               console.error(
                  "Acesso negado (403) ao marcar mensagens como lidas. Token inválido ou expirado."
               );
               return;
            }
            throw new Error(
               `Erro ${response.status} ao marcar mensagens como lidas`
            );
         }

         // Atualizar o estado do chat para não lido = false
         updateChat(chat, { naoLido: false });
      } catch (error) {
         console.error("Erro ao marcar mensagens como lidas:", error);
      }
   }, [chat, userId, updateChat, token]);

   // Função para carregar informações iniciais do chat
   const loadInitialChatInfo = useCallback(async () => {
      if (!userId) return;

      console.log(`Carregando informações do chat ${chat}`);

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/chat/join/${chat}?idUsuario=${userId}`,
            {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (!response.ok && response.status !== 409) {
            console.error("Erro ao carregar chat");
            return;
         }

         const data = await response.json();

         if (data) {
            const parceiro =
               data.usuario1?.id.toString() === userId
                  ? data.usuario2
                  : data.usuario1;

            if (parceiro) {
               idDestinatarioRef.current = parceiro.id.toString();

               setChatPartner({
                  id: parceiro.id.toString(),
                  nome: parceiro.nome || `Usuário ${parceiro.id}`,
               });
            }

            if (data.mensagens?.length > 0) {
               const formattedMessages: DisplayMessage[] = data.mensagens.map(
                  (msg: any) => ({
                     id: msg.id,
                     conteudo: msg.conteudo,
                     remetente: msg.remetente,
                     idChat: chat,
                     timestamp: msg.timeStamp || new Date().toISOString(),
                     isSender: msg.remetente === userId,
                     nomeRemetente:
                        msg.remetente === userId
                           ? userName
                           : parceiro?.nome || `Usuário ${msg.remetente}`,
                  })
               );

               setMessages(formattedMessages);

               // Marcar mensagens como lidas se houver mensagens não lidas
               if (formattedMessages.some((msg) => !msg.isSender)) {
                  await markMessagesAsRead();
               }
            }

            initialLoadDoneRef.current = true;
         }
      } catch (error) {
         console.error("Erro ao carregar informações do chat:", error);
      }
   }, [chat, userId, userName, markMessagesAsRead, token]);

   // Lidar com mensagens recebidas para este chat específico
   const handleMessage = useCallback(
      (message: any) => {
         try {
            const chatMessage = JSON.parse(message.body);
            console.log("Mensagem recebida:", chatMessage);

            const newMessage: DisplayMessage = {
               conteudo: chatMessage.conteudo,
               remetente: chatMessage.remetente,
               idChat: chat,
               timestamp: chatMessage.timeStamp || new Date().toISOString(),
               isSender: chatMessage.remetente === userId,
               nomeRemetente:
                  chatMessage.nomeRemetente ||
                  (chatMessage.remetente === userId
                     ? userName
                     : chatPartner?.nome || `Usuário ${chatMessage.remetente}`),
            };

            // Adicionar a mensagem à lista apenas se não for do usuário atual
            if (!newMessage.isSender) {
               setMessages((prevMessages) => [...prevMessages, newMessage]);
               markMessagesAsRead();
            }
         } catch (error) {
            console.error("Erro ao processar mensagem recebida:", error);
         }
      },
      [chat, userId, userName, chatPartner, markMessagesAsRead]
   );

   // Resetar o estado quando o chat mudar
   useEffect(() => {
      console.log(`Chat mudou para: ${chat}`);

      // Limpar mensagens e referências ao trocar de chat
      setMessages([]);
      setChatPartner(null);
      messagesFetchedRef.current = false;
      initialLoadDoneRef.current = false;

      // Limpar inscrição anterior se existir
      if (chatSubscriptionRef.current) {
         chatSubscriptionRef.current.unsubscribe();
         chatSubscriptionRef.current = null;
      }

      // Carregar informações do novo chat
      loadInitialChatInfo();
   }, [chat, loadInitialChatInfo]);

   // Configurar inscrição no WebSocket
   useEffect(() => {
      if (!stompClient || !isConnected) {
         setIsLoading(true);
         // Se não estiver conectado após 3 segundos, tente resetar a conexão
         if (!connectionRetryRef.current) {
            connectionRetryRef.current = setTimeout(() => {
               console.log("Tentando reconectar WebSocket...");
               resetConnection();
               connectionRetryRef.current = null;
            }, 3000);
         }
         return;
      }

      // Limpar timeout se conectado com sucesso
      if (connectionRetryRef.current) {
         clearTimeout(connectionRetryRef.current);
         connectionRetryRef.current = null;
      }

      setErrorMessage(null);

      // Limpar inscrição anterior se existir
      if (chatSubscriptionRef.current) {
         chatSubscriptionRef.current.unsubscribe();
         chatSubscriptionRef.current = null;
      }

      try {
         console.log(`Verificando status de conexão: ${stompClient.connected}`);

         // Verificar explicitamente se o cliente está realmente conectado
         if (!stompClient.connected) {
            throw new Error("Cliente STOMP não está realmente conectado");
         }

         // Criar nova inscrição
         chatSubscriptionRef.current = stompClient.subscribe(
            `/topic/chat/${chat}`,
            handleMessage
         );

         console.log(`Inscrito com sucesso no chat ${chat}`);

         // Marcar mensagens como lidas quando entrar no chat
         markMessagesAsRead();
         setIsLoading(false);
      } catch (error) {
         console.error(`Erro ao se inscrever no chat ${chat}:`, error);
         setErrorMessage("Erro ao se conectar ao chat. Tentando reconectar...");
         setIsLoading(true);

         // Se houver erro na inscrição, tente resetar a conexão
         setTimeout(() => {
            resetConnection();
         }, 2000);
      }

      return () => {
         if (chatSubscriptionRef.current) {
            try {
               chatSubscriptionRef.current.unsubscribe();
            } catch (e) {
               console.error("Erro ao cancelar inscrição:", e);
            }
            chatSubscriptionRef.current = null;
         }

         if (connectionRetryRef.current) {
            clearTimeout(connectionRetryRef.current);
            connectionRetryRef.current = null;
         }
      };
   }, [
      stompClient,
      isConnected,
      chat,
      handleMessage,
      markMessagesAsRead,
      resetConnection,
   ]);

   const sendMessage = useCallback(
      (message: string) => {
         if (!message.trim()) {
            console.error("Mensagem vazia");
            return;
         }

         if (!stompClient || !isConnected) {
            console.error("Cliente STOMP não está conectado");
            return;
         }

         try {
            const chatMessage = {
               conteudo: message,
               remetente: userId,
               idChat: chat,
               nomeRemetente: userName,
               timeStamp: new Date().toISOString(),
            };

            console.log("Enviando mensagem:", chatMessage);

            // Adicionar mensagem enviada localmente para exibição imediata
            const newMessage: DisplayMessage = {
               conteudo: message,
               remetente: userId,
               idChat: chat,
               timestamp: new Date().toISOString(),
               isSender: true,
               nomeRemetente: userName,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Atualizar o estado do chat no contexto
            addNewMessage(chat, chatMessage);

            // Verificar se temos um ID de destinatário válido antes de enviar a notificação
            if (idDestinatarioRef.current) {
               console.log(
                  "Enviando notificação para:",
                  idDestinatarioRef.current
               );
               enviarNotificacao(
                  {
                     titulo: "Chat",
                     descricao: "Você tem uma nova mensagem",
                  },
                  idDestinatarioRef.current
               );
            } else {
               console.error(
                  "ID do destinatário não disponível para enviar notificação"
               );
            }

            // Enviar a mensagem por último para garantir que a interface seja atualizada primeiro
            stompClient.publish({
               destination: `/app/sendMessage/${chat}`,
               body: JSON.stringify(chatMessage),
               headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            });
         } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
         }
      },
      [chat, stompClient, isConnected, userId, userName, addNewMessage]
   );

   const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (e.key === "Enter" && isConnected) {
            sendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
         }
      },
      [isConnected, sendMessage]
   );

   const handleSendClick = useCallback(() => {
      if (isConnected && inputRef.current) {
         sendMessage(inputRef.current.value);
         inputRef.current.value = "";
         inputRef.current.focus();
      }
   }, [isConnected, sendMessage]);

   return (
      <div className="flex flex-col gap-2 h-full">
         <div className="bg-havprincipal rounded-t-lg md:rounded-tl-none md:rounded-tr-lg flex flex-row gap-2 sm:gap-4 items-center">
            {isMobile && (
               <ArrowLeft
                  className="text-white cursor-pointer ml-2 sm:ml-4"
                  onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                     e.stopPropagation();
                     closeChat();
                  }}
               />
            )}
            <p className="text-xl font-semibold text-white px-8 py-3 truncate">
               {chatPartner && `${chatPartner.nome}`}
            </p>
         </div>
         <div className="flex flex-col gap-2 h-full py-2 px-5 overflow-y-auto hide-scrollbar">
            {isLoading ? (
               <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Conectando ao chat...</p>
               </div>
            ) : errorMessage ? (
               <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">{errorMessage}</p>
               </div>
            ) : messages.length === 0 ? (
               <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                     Nenhuma mensagem ainda. Comece a conversar!
                  </p>
               </div>
            ) : (
               messages.reduce<React.ReactNode[]>(
                  (messageGroups, message, index, array) => {
                     const messageDate = new Date(
                        message.timestamp
                     ).toLocaleDateString("pt-BR");

                     // Verificar se precisamos adicionar um novo cabeçalho de data
                     if (
                        index === 0 ||
                        messageDate !==
                           new Date(
                              array[index - 1].timestamp
                           ).toLocaleDateString("pt-BR")
                     ) {
                        messageGroups.push(
                           <div
                              key={`date-${messageDate}`}
                              className="flex justify-center my-2"
                           >
                              <div className="bg-havprincipal rounded-full px-3 py-1 text-xs text-white">
                                 {messageDate ===
                                 new Date().toLocaleDateString("pt-BR")
                                    ? "Hoje"
                                    : messageDate ===
                                      new Date(
                                         Date.now() - 86400000
                                      ).toLocaleDateString("pt-BR")
                                    ? "Ontem"
                                    : messageDate}
                              </div>
                           </div>
                        );
                     }

                     // Adicionar a mensagem
                     messageGroups.push(
                        <div
                           key={`msg-${index}`}
                           className={`flex flex-col gap-1 ${
                              message.isSender ? "items-end" : "items-start"
                           }`}
                        >
                           <div
                              className={`${
                                 message.isSender
                                    ? "bg-havprincipal text-white rounded-tr-none"
                                    : "bg-white rounded-tl-none"
                              } rounded-lg p-2 max-w-[50%] min-w-[90px] whitespace-normal break-words`}
                           >
                              <div className="flex flex-wrap justify-between items-end gap-2">
                                 <div
                                    className={`flex-grow break-words ${
                                       message.conteudo.length > 30
                                          ? "w-full"
                                          : ""
                                    }`}
                                 >
                                    {message.conteudo}
                                 </div>
                                 <span
                                    className={`text-xs ${
                                       message.isSender
                                          ? "text-gray-200"
                                          : "text-gray-500"
                                    } font-light italic flex-shrink-0 self-end ${
                                       message.conteudo.length > 30
                                          ? "ml-auto"
                                          : ""
                                    }`}
                                 >
                                    {new Date(
                                       message.timestamp
                                    ).toLocaleTimeString([], {
                                       hour: "2-digit",
                                       minute: "2-digit",
                                    })}
                                 </span>
                              </div>
                           </div>
                        </div>
                     );

                     return messageGroups;
                  },
                  []
               )
            )}
            <div ref={messagesEndRef} />
         </div>
         <div className="p-4 flex flex-row items-center gap-4 w-full justify-between">
            <div className="w-full">
               <div className="flex items-center gap-2 w-full">
                  <input
                     ref={inputRef}
                     type="text"
                     className="bg-white rounded-lg flex-1 w-full px-4 py-2 focus:outline-none"
                     placeholder={
                        isConnected
                           ? "Digite sua mensagem aqui..."
                           : "Conectando ao chat..."
                     }
                     disabled={!isConnected}
                     onKeyDown={handleInputKeyDown}
                     maxLength={200}
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="hover:text-havprincipal"
                     >
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                     </svg>
                  </label>
                  <input
                     id="fileUpload"
                     type="file"
                     className="hidden"
                     disabled={!isConnected}
                  />
               </div>
            </div>
            <Send
               className={`cursor-pointer ${
                  isConnected ? "hover:text-havprincipal" : "text-gray-400"
               }`}
               onClick={handleSendClick}
            />
         </div>
      </div>
   );
};

export default ChatMessages;
