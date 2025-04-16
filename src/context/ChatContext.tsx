"use client";

import React, {
   createContext,
   useContext,
   useState,
   useEffect,
   useRef,
   useCallback,
} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { SessionProvider, useSession } from "next-auth/react";

interface Usuario {
   id: number;
   nome: string;
   foto: string | null;
}

interface Chat {
   id: number;
   idChat: number;
   usuario1: Usuario;
   usuario2: Usuario;
   ultimaMensagem?: {
      conteudo: string;
      timeStamp: string;
      remetente: string;
   };
   naoLido?: boolean;
}

interface ChatMessage {
   conteudo: string;
   remetente: string;
   idChat: number;
   timeStamp?: string;
   nomeRemetente?: string;
}

interface ChatContextType {
   chats: Chat[];
   setChats: (chats: Chat[]) => void;
   updateChat: (chatId: number, updates: Partial<Chat>) => void;
   selectedChat: number | null;
   setSelectedChat: (chatId: number | null) => void;
   stompClient: Client | null;
   isConnected: boolean;
   userId: string;
   userName: string;
   fetchChats: () => Promise<void>;
   addNewMessage: (chatId: number, message: ChatMessage) => void;
   forceUpdateChats: () => void;
   resetConnection: () => void;
   token: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
   children,
   session,
}: {
   children: React.ReactNode;
   session: any;
}) {
   const [chats, setChats] = useState<Chat[]>([]);
   const [selectedChat, setSelectedChat] = useState<number | null>(null);
   const [stompClient, setStompClient] = useState<Client | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const [forceUpdate, setForceUpdate] = useState(0);
   const userId = session?.user?.id;
   const userName = session?.user?.name;

   // Referências para controlar as inscrições e requisições
   const subscriptions = useRef<Record<string, any>>({});
   const isInitialFetch = useRef(true);
   const chatIdsRef = useRef<Set<number>>(new Set());
   const clientRef = useRef<Client | null>(null);
   const isFetchingChats = useRef(false);
   const connectionAttempts = useRef(0);
   const maxConnectionAttempts = 5;

   const token = session?.accessToken;

   // Função para forçar uma atualização dos chats
   const forceUpdateChats = useCallback(() => {
      console.log("Forçando atualização dos chats");
      setForceUpdate((prev) => prev + 1);
   }, []);

   const updateChat = useCallback((chatId: number, updates: Partial<Chat>) => {
      console.log(`Atualizando chat ${chatId} com`, updates);
      setChats((prevChats) => {
         // Encontrar o chat que será atualizado
         const chatIndex = prevChats.findIndex(
            (chat) => chat.idChat === chatId
         );

         // Se o chat não for encontrado, retornar a lista atual
         if (chatIndex === -1) {
            console.log(`Chat ${chatId} não encontrado na lista`);
            return prevChats;
         }

         // Criar uma cópia da lista de chats
         const updatedChats = [...prevChats];

         // Atualizar o chat específico
         updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            ...updates,
         };

         console.log("Chat atualizado:", updatedChats[chatIndex]);

         // Reordenar os chats: primeiro os não lidos, depois por data da última mensagem
         return updatedChats.sort((a, b) => {
            // Ordenar por leitura
            if (a.naoLido && !b.naoLido) return -1;
            if (!a.naoLido && b.naoLido) return 1;

            // Ordenar por data da última mensagem
            if (a.ultimaMensagem && b.ultimaMensagem) {
               return (
                  new Date(b.ultimaMensagem.timeStamp).getTime() -
                  new Date(a.ultimaMensagem.timeStamp).getTime()
               );
            }
            return 0;
         });
      });
   }, []);

   const fetchChats = useCallback(async () => {
      if (!userId) {
         return;
      }

      // Evitar chamadas simultâneas
      if (isFetchingChats.current) {
         return;
      }

      try {
         isFetchingChats.current = true;

         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/chat/list/${userId}`,
            {
               headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               method: "GET",
            }
         );

         if (!response.ok) {
            return;
         }

         const data = await response.json();
         const newChats = Array.isArray(data) ? data : [];

         // Verificar se algum chat é duplicado
         const chatIds = new Set<number>();
         const uniqueChats = newChats.filter((chat) => {
            if (chatIds.has(chat.idChat)) {
               return false;
            }
            chatIds.add(chat.idChat);
            return true;
         });

         // Atualizar a lista de chats
         setChats(uniqueChats);

         // Atualizar o conjunto de IDs de chat para referência
         chatIdsRef.current = chatIds;
      } catch (error) {
         console.error("Erro ao carregar chats:", error);
         setChats([]);
      } finally {
         isFetchingChats.current = false;
      }
   }, [userId, token]);

   const addNewMessage = useCallback(
      (chatId: number, message: ChatMessage) => {
         const isMessageFromUser = message.remetente === userId;
         const isSelectedChat = selectedChat === chatId;
         const shouldMarkAsUnread = !isMessageFromUser && !isSelectedChat;

         // Verifica se o chat já existe
         if (chatIdsRef.current.has(chatId)) {
            // Atualiza o chat existente com a nova mensagem
            updateChat(chatId, {
               ultimaMensagem: {
                  conteudo: message.conteudo,
                  timeStamp: message.timeStamp || new Date().toISOString(),
                  remetente: message.remetente,
               },
               naoLido: shouldMarkAsUnread,
            });
         } else {
            // Se o chat não existir, busca apenas o chat específico
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}`, {
               headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               method: "GET",
            })
               .then((response) => response.json())
               .then((newChat) => {
                  chatIdsRef.current.add(chatId);
                  setChats((prevChats) => {
                     // Verifica se o chat já não foi adicionado enquanto buscava
                     if (prevChats.some((chat) => chat.idChat === chatId)) {
                        return prevChats;
                     }
                     return [
                        ...prevChats,
                        {
                           ...newChat,
                           ultimaMensagem: {
                              conteudo: message.conteudo,
                              timeStamp:
                                 message.timeStamp || new Date().toISOString(),
                              remetente: message.remetente,
                           },
                           naoLido: shouldMarkAsUnread,
                        },
                     ];
                  });
               })
               .catch((error) => {
                  console.error("Erro ao buscar chat específico:", error);
               });
         }
      },
      [updateChat, userId, selectedChat, token]
   );

   // Inicializar WebSocket uma vez
   useEffect(() => {
      if (!userId || !userName || !token) {
         console.log("Usuário não autenticado ou token não disponível");
         return;
      }

      // Função para criar e configurar o cliente STOMP
      const setupStompClient = () => {
         // Limpar cliente anterior se existir
         if (clientRef.current?.connected) {
            console.log("Desativando conexão STOMP existente");
            clientRef.current.deactivate();
            subscriptions.current = {};
         }

         console.log("Criando nova conexão STOMP");
         const socket = new SockJS(
            `${process.env.NEXT_PUBLIC_BASE_URL}/ws/chat`
         );

         const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 2000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
               userId: userId,
               userName: userName,
               Authorization: `Bearer ${token}`,
            },
            debug: function (str) {
               console.log("STOMP Debug:", str);
            },
         });

         client.onConnect = (frame) => {
            console.log("STOMP conectado:", frame);
            connectionAttempts.current = 0;
            setIsConnected(true);
            setStompClient(client);

            // Inscrever no tópico de notificações do usuário
            const userNotificationSub = client.subscribe(
               "/user/queue/messages",
               (message) => {
                  try {
                     const notification = JSON.parse(message.body);

                     if (notification.type === "NEW_MESSAGE") {
                        addNewMessage(
                           notification.chatId,
                           notification.message
                        );
                     } else if (notification.type === "CHAT_UPDATED") {
                        fetchChats();
                     }
                  } catch (error) {
                     console.error("Erro ao processar notificação:", error);
                  }
               }
            );

            // Salvar a inscrição
            subscriptions.current["userNotification"] = userNotificationSub;

            // Buscar chats quando conectar
            fetchChats();
         };

         client.onWebSocketClose = (event) => {
            console.log(`WebSocket fechado: ${event.code} - ${event.reason}`);
            if (event.code === 1006) {
               // Código 1006 indica fechamento anormal
               console.log("Tentando reconectar após fechamento anormal");
               setTimeout(() => {
                  if (clientRef.current) {
                     clientRef.current.activate();
                  }
               }, 3000);
            }
         };

         client.onDisconnect = () => {
            console.log("STOMP desconectado");
            setIsConnected(false);
         };

         client.onStompError = (frame) => {
            console.error("Erro STOMP:", frame.headers, frame.body);
            setIsConnected(false);

            // Tentar reconectar se não atingiu o número máximo de tentativas
            if (connectionAttempts.current < maxConnectionAttempts) {
               connectionAttempts.current++;

               // Aumentar o tempo de espera a cada tentativa
               const reconnectDelay = Math.min(
                  1000 * connectionAttempts.current,
                  5000
               );

               console.log(
                  `Tentativa ${connectionAttempts.current} de reconexão em ${reconnectDelay}ms`
               );

               setTimeout(() => {
                  if (clientRef.current) {
                     clientRef.current.activate();
                  }
               }, reconnectDelay);
            } else {
               console.error(
                  `Máximo de ${maxConnectionAttempts} tentativas de reconexão atingido`
               );
            }
         };

         console.log("Ativando conexão STOMP");
         client.activate();
         clientRef.current = client;

         return client;
      };

      // Configurar o cliente inicial
      const client = setupStompClient();

      // Verificar se a conexão foi estabelecida após um período
      const connectionCheckTimer = setTimeout(() => {
         if (!isConnected && clientRef.current) {
            console.log(
               "Conexão não estabelecida após timeout, tentando novamente"
            );
            clientRef.current.deactivate();
            setupStompClient();
         }
      }, 5000);

      return () => {
         clearTimeout(connectionCheckTimer);

         // Limpar todas as inscrições
         Object.values(subscriptions.current).forEach((sub: any) => {
            if (sub && typeof sub.unsubscribe === "function") {
               try {
                  sub.unsubscribe();
               } catch (error) {
                  console.error("Erro ao cancelar inscrição:", error);
               }
            }
         });
         subscriptions.current = {};

         // Desativar cliente
         if (client && client.connected) {
            try {
               client.deactivate();
            } catch (error) {
               console.error("Erro ao desativar cliente STOMP:", error);
            }
         }
      };
   }, [userId, userName, token, addNewMessage, fetchChats]);

   // Inscrever em novos chats quando a lista é atualizada
   useEffect(() => {
      if (!stompClient || !stompClient.connected) {
         console.log("Cliente STOMP não conectado, não inscrevendo em chats");
         return;
      }

      console.log(
         "Atualizando inscrições para chats:",
         chats.map((c) => c.idChat)
      );

      // Limpar inscrições de chats antigos que não estão mais na lista
      Object.keys(subscriptions.current).forEach((key) => {
         if (key.startsWith("chat-")) {
            const chatId = parseInt(key.replace("chat-", ""), 10);
            const chatExiste = chats.some((chat) => chat.idChat === chatId);

            if (!chatExiste) {
               console.log(`Cancelando inscrição para chat ${chatId}`);
               subscriptions.current[key].unsubscribe();
               delete subscriptions.current[key];
            }
         }
      });

      // Criar novas inscrições apenas para chats que ainda não estão inscritos
      chats.forEach((chat) => {
         const subKey = `chat-${chat.idChat}`;

         if (!subscriptions.current[subKey]) {
            console.log(`Criando nova inscrição para chat ${chat.idChat}`);

            const subscription = stompClient.subscribe(
               `/topic/chat/${chat.idChat}`,
               (message) => {
                  try {
                     const chatMessage: ChatMessage = JSON.parse(message.body);
                     console.log(
                        `Nova mensagem recebida no chat ${chat.idChat}:`,
                        chatMessage
                     );

                     // Verificar se é mensagem do usuário atual
                     const isMessageFromUser = chatMessage.remetente === userId;
                     const isSelectedChat = selectedChat === chat.idChat;

                     console.log("É mensagem do usuário:", isMessageFromUser);
                     console.log("É chat selecionado:", isSelectedChat);

                     // Adicionar a mensagem ao chat
                     addNewMessage(chat.idChat, chatMessage);

                     // Se a mensagem não for do usuário atual E não for o chat selecionado,
                     // forçar a atualização para marcar como não lido
                     if (!isMessageFromUser && !isSelectedChat) {
                        console.log(
                           `Marcando chat ${chat.idChat} como não lido`
                        );
                        updateChat(chat.idChat, { naoLido: true });
                     }
                  } catch (error) {
                     console.error(
                        `Erro ao processar mensagem do chat ${chat.idChat}:`,
                        error
                     );
                  }
               }
            );

            subscriptions.current[subKey] = subscription;
         }
      });
   }, [chats, stompClient, addNewMessage, selectedChat, userId, updateChat]);

   // Buscar chats iniciais apenas uma vez
   useEffect(() => {
      if (isInitialFetch.current && userId) {
         console.log("Realizando busca inicial de chats");
         fetchChats();
         isInitialFetch.current = false;
      }
   }, [fetchChats, userId]);

   // Atualizar chats periodicamente para garantir sincronização
   useEffect(() => {
      if (stompClient && stompClient.connected) {
         const globalSubscription = stompClient.subscribe(
            "/topic/chat/global",
            () => {
               console.log(
                  "Mensagem recebida em algum chat, atualizando lista de chats..."
               );
               fetchChats();
            }
         );

         return () => {
            if (
               globalSubscription &&
               typeof globalSubscription.unsubscribe === "function"
            ) {
               globalSubscription.unsubscribe();
            }
         };
      }
   }, [fetchChats, stompClient]);

   // Efeito para forçar atualização quando necessário
   useEffect(() => {
      if (forceUpdate > 0) {
         console.log(
            "Atualizando chats devido a força de atualização:",
            forceUpdate
         );
         fetchChats();
      }
   }, [forceUpdate, fetchChats]);

   const resetConnection = useCallback(() => {
      console.log("Resetando conexão STOMP...");
      setIsConnected(false);

      // Limpar todas as inscrições existentes
      Object.values(subscriptions.current).forEach((sub: any) => {
         if (sub && typeof sub.unsubscribe === "function") {
            try {
               sub.unsubscribe();
            } catch (error) {
               console.error("Erro ao cancelar inscrição:", error);
            }
         }
      });
      subscriptions.current = {};

      // Desativar cliente se estiver conectado
      if (clientRef.current) {
         try {
            if (clientRef.current.connected) {
               console.log("Desativando cliente WebSocket...");
               clientRef.current.deactivate();
            }
         } catch (error) {
            console.error("Erro ao desativar cliente:", error);
         }
      }

      connectionAttempts.current = 0;

      // Criar nova conexão
      setTimeout(() => {
         console.log("Criando nova conexão após reset...");

         // Verificar se temos as informações necessárias
         if (!userId || !userName || !token) {
            console.error("Dados de usuário não disponíveis para reconexão");
            return;
         }

         try {
            // Criar novo socket e cliente
            const socket = new SockJS(
               `${process.env.NEXT_PUBLIC_BASE_URL}/ws/chat`
            );

            const client = new Client({
               webSocketFactory: () => socket,
               reconnectDelay: 2000,
               heartbeatIncoming: 4000,
               heartbeatOutgoing: 4000,
               connectHeaders: {
                  userId: userId,
                  userName: userName,
                  Authorization: `Bearer ${token}`,
               },
            });

            client.onConnect = (frame) => {
               console.log("Reconnected successfully:", frame);
               connectionAttempts.current = 0;
               setIsConnected(true);
               setStompClient(client);
               fetchChats();
            };

            client.onDisconnect = () => {
               console.log("Disconnected after reset");
               setIsConnected(false);
            };

            client.onStompError = (frame) => {
               console.error("STOMP error after reset:", frame);
               setIsConnected(false);
            };

            // Ativar o novo cliente
            client.activate();
            clientRef.current = client;
         } catch (error) {
            console.error("Erro ao criar nova conexão:", error);
         }
      }, 1000);
   }, [userId, userName, token, fetchChats]);

   const contextValue = {
      chats,
      setChats,
      updateChat,
      selectedChat,
      setSelectedChat,
      stompClient,
      isConnected,
      userId,
      userName,
      fetchChats,
      addNewMessage,
      forceUpdateChats,
      resetConnection,
      token,
   };

   return (
      <ChatContext.Provider value={contextValue}>
         {children}
      </ChatContext.Provider>
   );
}

export function useChat() {
   const context = useContext(ChatContext);
   if (context === undefined) {
      throw new Error("useChat must be used within a ChatProvider");
   }
   return context;
}
