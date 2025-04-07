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
         console.log("Não há usuário logado");
         return;
      }

      try {
         console.log("Buscando lista de chats para o usuário:", userId);
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
            console.error(
               "Erro ao buscar chats:",
               response.status,
               response.statusText
            );
            return;
         }

         const data = await response.json();
         const newChats = Array.isArray(data) ? data : [];
         console.log("Chats recebidos:", newChats.length);

         // Atualizar a lista de chats
         setChats(newChats);

         // Atualizar o conjunto de IDs de chat para referência
         chatIdsRef.current = new Set(newChats.map((chat) => chat.idChat));
      } catch (error) {
         console.error("Erro ao carregar chats:", error);
         setChats([]);
      }
   }, [userId]);

   const addNewMessage = useCallback(
      (chatId: number, message: ChatMessage) => {
         console.log(`Adicionando nova mensagem ao chat ${chatId}:`, message);

         // Verificar se é mensagem do próprio usuário
         const isMessageFromUser = message.remetente === userId;
         const isSelectedChat = selectedChat === chatId;

         console.log("É mensagem do usuário:", isMessageFromUser);
         console.log("É chat selecionado:", isSelectedChat);

         // Determinar se o chat deve ser marcado como não lido
         // Só marca como não lido se:
         // 1. A mensagem NÃO for do usuário atual
         // 2. E o chat NÃO estiver selecionado atualmente
         const shouldMarkAsUnread = !isMessageFromUser && !isSelectedChat;
         console.log("Deve marcar como não lido:", shouldMarkAsUnread);

         // Verifica se o chat já existe
         if (chatIdsRef.current.has(chatId)) {
            console.log(`Chat ${chatId} encontrado, atualizando...`);

            // Atualiza o chat existente com a nova mensagem
            updateChat(chatId, {
               ultimaMensagem: {
                  conteudo: message.conteudo,
                  timeStamp: message.timeStamp || new Date().toISOString(),
                  remetente: message.remetente,
               },
               // Define naoLido com base em quem enviou a mensagem e se o chat está selecionado
               naoLido: shouldMarkAsUnread,
            });

            // Log para debug
            if (shouldMarkAsUnread) {
               console.log(`Chat ${chatId} marcado como não lido`);
            }

            // Se a mensagem não for do usuário atual e o chat não estiver selecionado,
            // forçar uma atualização adicional para garantir que o chat seja marcado como não lido
            if (shouldMarkAsUnread) {
               setTimeout(() => {
                  console.log(
                     `Forçando atualização do chat ${chatId} como não lido`
                  );
                  forceUpdateChats();
               }, 300);
            }
         } else {
            // Se o chat não existir, busca todos os chats novamente
            console.log(
               `Chat ${chatId} não encontrado, buscando todos novamente`
            );
            fetchChats();
         }
      },
      [fetchChats, updateChat, userId, selectedChat, forceUpdateChats]
   );

   // Inicializar WebSocket uma vez
   useEffect(() => {
      if (!userId || !userName) {
         console.log("Usuário não autenticado, não inicializando WebSocket");
         return;
      }

      console.log("Inicializando WebSocket para usuário:", userId);

      const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws/chat`);
      const client = new Client({
         webSocketFactory: () => socket,
         reconnectDelay: 5000,
         heartbeatIncoming: 4000,
         heartbeatOutgoing: 4000,
         connectHeaders: {
            userId: userId,
            userName: userName,
         },
      });

      client.onConnect = (frame) => {
         console.log("Global WebSocket Connected:", frame);
         setIsConnected(true);

         // Inscrever no tópico de notificações do usuário
         const userNotificationSub = client.subscribe(
            "/user/queue/messages",
            (message) => {
               const notification = JSON.parse(message.body);
               console.log("Nova notificação recebida:", notification);

               if (notification.type === "NEW_MESSAGE") {
                  addNewMessage(notification.chatId, notification.message);
               } else if (notification.type === "CHAT_UPDATED") {
                  fetchChats();
               }
            }
         );

         // Salvar a inscrição
         subscriptions.current["userNotification"] = userNotificationSub;
      };

      client.onDisconnect = () => {
         console.log("Global WebSocket Desconectado");
         setIsConnected(false);
      };

      client.onStompError = (frame) => {
         console.error("Broker reported error:", frame.headers["message"]);
         console.error("Additional details:", frame.body);
         setIsConnected(false);
      };

      client.activate();
      setStompClient(client);
      clientRef.current = client;

      return () => {
         // Limpar todas as inscrições
         Object.values(subscriptions.current).forEach((sub: any) => {
            if (sub && typeof sub.unsubscribe === "function") {
               sub.unsubscribe();
            }
         });

         // Desativar cliente
         if (client.connected) {
            client.deactivate();
         }
      };
   }, [userId, userName, addNewMessage, fetchChats]);

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
      console.log("Resetando conexão WebSocket");

      // Limpar todas as inscrições existentes
      Object.values(subscriptions.current).forEach((sub: any) => {
         if (sub && typeof sub.unsubscribe === "function") {
            sub.unsubscribe();
         }
      });
      subscriptions.current = {};

      // Desativar cliente se estiver conectado
      if (clientRef.current?.connected) {
         console.log("Desativando cliente WebSocket");
         clientRef.current.deactivate();
      }

      // Reativar a conexão após um delay maior
      setTimeout(() => {
         if (clientRef.current && !clientRef.current.connected) {
            console.log("Reativando cliente WebSocket");
            clientRef.current.activate();
         }
      }, 1000); // Aumentado o delay para 1000ms
   }, []);

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
