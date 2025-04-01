import React, {
   useEffect,
   useState,
   useRef,
   useCallback,
   useMemo,
} from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useChat } from "@/context/ChatContext";

interface ChatMessagesProps {
   chat: number;
   closeChat: () => void;
   isMobile: boolean;
}

interface ChatUser {
   id: string;
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

   // Usar o contexto global
   const {
      stompClient,
      isConnected,
      userId,
      userName,
      updateChat,
      addNewMessage,
   } = useChat();

   const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, []);

   useEffect(() => {
      scrollToBottom();
   }, [messages, scrollToBottom]);

   // Função para marcar mensagens como lidas
   const markMessagesAsRead = useCallback(async () => {
      try {
         await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chat}/marcarLidas?idUsuario=${userId}`,
            { method: "POST" }
         );
         // Atualizar o estado do chat para não lido = false
         updateChat(chat, { naoLido: false });
      } catch (error) {
         console.error("Erro ao marcar mensagens como lidas:", error);
      }
   }, [chat, userId, updateChat]);

   useEffect(() => {
      if (!userId) return;

      // Resetar estado ao trocar de chat
      setMessages([]);
      setChatPartner(null);
      messagesFetchedRef.current = false;

      const createOrJoinChat = async () => {
         try {
            const response = await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chat}?idUsuario=${userId}`,
               { method: "GET" }
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
                  setChatPartner({
                     id: parceiro.id.toString(),
                     nome: parceiro.nome || `Usuário ${parceiro.id}`,
                  });
               }

               if (data.mensagens?.length > 0) {
                  const formattedMessages: DisplayMessage[] =
                     data.mensagens.map((msg: any) => ({
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
                     }));

                  setMessages(formattedMessages);

                  // Marcar mensagens como lidas se houver mensagens não lidas
                  if (formattedMessages.some((msg) => !msg.isSender)) {
                     await markMessagesAsRead();
                  }
               }
            }
         } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
         }
      };

      createOrJoinChat();
   }, [chat, userId, userName, markMessagesAsRead]);

   // Lidar com mensagens recebidas para este chat específico
   const handleMessage = useCallback(
      (message: any) => {
         try {
            const chatMessage = JSON.parse(message.body);
            console.log("Mensagem recebida:", chatMessage);

            // Não filtrar por chatId aqui, pois já estamos inscritos no tópico específico deste chat

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
      // Limpar mensagens e referências ao trocar de chat
      setMessages([]);
      messagesFetchedRef.current = false;

      // Limpar inscrição anterior se existir
      if (chatSubscriptionRef.current) {
         chatSubscriptionRef.current.unsubscribe();
         chatSubscriptionRef.current = null;
      }
   }, [chat]);

   // Configurar inscrição no WebSocket
   useEffect(() => {
      if (!stompClient || !isConnected) return;

      console.log(`Inscrevendo-se no chat ${chat}`);

      // Limpar inscrição anterior se existir
      if (chatSubscriptionRef.current) {
         chatSubscriptionRef.current.unsubscribe();
         chatSubscriptionRef.current = null;
      }

      // Criar nova inscrição
      chatSubscriptionRef.current = stompClient.subscribe(
         `/topic/chat/${chat}`,
         handleMessage
      );

      console.log(`Inscrição criada para chat ${chat}`);

      // Marcar mensagens como lidas quando entrar no chat
      markMessagesAsRead();

      return () => {
         if (chatSubscriptionRef.current) {
            console.log(`Cancelando inscrição do chat ${chat}`);
            chatSubscriptionRef.current.unsubscribe();
            chatSubscriptionRef.current = null;
         }
      };
   }, [stompClient, isConnected, chat, handleMessage, markMessagesAsRead]);

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

            // Enviar a mensagem por último para garantir que a interface seja atualizada primeiro
            stompClient.publish({
               destination: `/app/sendMessage/${chat}`,
               body: JSON.stringify(chatMessage),
               headers: { "content-type": "application/json" },
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
            {messages.reduce<React.ReactNode[]>(
               (messageGroups, message, index, array) => {
                  const messageDate = new Date(
                     message.timestamp
                  ).toLocaleDateString("pt-BR");

                  // Verificar se precisamos adicionar um novo cabeçalho de data
                  if (
                     index === 0 ||
                     messageDate !==
                        new Date(array[index - 1].timestamp).toLocaleDateString(
                           "pt-BR"
                        )
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
                                    message.conteudo.length > 30 ? "w-full" : ""
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
