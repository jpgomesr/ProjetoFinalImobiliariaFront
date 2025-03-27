import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface ChatMessagesProps {
   chat: number;
}

interface ChatMessage {
   conteudo: string;
   remetente: string; // Agora será o ID do usuário
   timeStamp: string;
   nomeRemetente?: string;
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

interface ChatUser {
   id: string;
   nome?: string;
}

const ChatMessages = ({ chat }: ChatMessagesProps) => {
   const [messages, setMessages] = useState<DisplayMessage[]>([]);
   const [stompClient, setStompClient] = useState<Client | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const [chatPartner, setChatPartner] = useState<ChatUser | null>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const id = localStorage.getItem("idUsuario") || "1";
   const nomeUsuario = localStorage.getItem("nomeUsuario") || `Usuário ${id}`;
   if (!localStorage.getItem("idUsuario")) {
      localStorage.setItem("idUsuario", "1");
   }

   useEffect(() => {
      if (!id) {
         console.error("ID do usuário não encontrado");
         return;
      }

      const createOrJoinChat = async () => {
         try {
            const response = await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chat}?idUsuario=${id}`,
               { method: "GET" }
            );
            if (!response.ok && response.status !== 409) {
               console.error("Erro ao criar chat");
               return;
            }

            const data = await response.json();

            if (data) {
               const parceiro =
                  data.usuario1?.id.toString() === id
                     ? data.usuario2
                     : data.usuario1;
               if (parceiro) {
                  setChatPartner({
                     id: parceiro.id.toString(),
                     nome: parceiro.nome || `Usuário ${parceiro.id}`,
                  });
               }
               if (data.messages && data.messages.length > 0) {
                  const formattedMessages: DisplayMessage[] = data.messages.map(
                     (msg: any) => ({
                        id: msg.id,
                        conteudo: msg.conteudo,
                        remetente: msg.remetente,
                        idChat: chat,
                        timestamp: msg.timeStamp || new Date().toISOString(),
                        isSender: msg.remetente === id,
                        nomeRemetente:
                           msg.remetente === id
                              ? nomeUsuario
                              : parceiro?.nome || `Usuário ${msg.remetente}`,
                     })
                  );
                  setMessages(formattedMessages);
               }
            }
         } catch (error) {
            console.error("Erro ao criar/entrar no chat:", error);
         }
      };

      createOrJoinChat();

      let client: Client;

      try {
         const socket = new SockJS(
            `${process.env.NEXT_PUBLIC_BASE_URL}/ws/chat`
         );
         client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
               userId: id,
               userName: nomeUsuario,
            },
         });

         client.onConnect = (frame) => {
            console.log("Connected: " + frame);
            setIsConnected(true);

            client.subscribe(`/topic/chat/${chat}`, (message) => {
               const chatMessage: ChatMessage = JSON.parse(message.body);
               const newMessage: DisplayMessage = {
                  conteudo: chatMessage.conteudo,
                  remetente: chatMessage.remetente,
                  idChat: chat,
                  timestamp: chatMessage.timeStamp || new Date().toISOString(),
                  isSender: chatMessage.remetente === id,
                  nomeRemetente:
                     chatMessage.nomeRemetente ||
                     `Usuário ${chatMessage.remetente}`,
               };

               setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
         };

         client.onDisconnect = () => {
            console.log("Desconectado do WebSocket");
            setIsConnected(false);
         };

         client.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
            setIsConnected(false);
         };

         client.activate();
         setStompClient(client);
      } catch (error) {
         console.error("Erro ao inicializar conexão STOMP:", error);
         setIsConnected(false);
      }

      return () => {
         if (client && client.connected) {
            try {
               client.deactivate();
            } catch (error) {
               console.error("Erro ao desativar cliente STOMP:", error);
            }
         }
      };
   }, [chat, id, nomeUsuario]);

   const sendMessage = (message: string) => {
      if (!message.trim()) {
         console.error("Mensagem vazia");
         return;
      }

      if (!isConnected) {
         console.error("Não há conexão com o WebSocket");
         return;
      }

      if (!stompClient) {
         console.error("Cliente STOMP não inicializado");
         return;
      }

      try {
         if (!stompClient.connected) {
            console.error("Cliente STOMP não está conectado");
            setIsConnected(false);
            return;
         }

         const chatMessage = {
            conteudo: message,
            remetente: id,
            idChat: chat,
            nomeRemetente: nomeUsuario,
         };

         console.log("Enviando mensagem:", chatMessage);
         stompClient.publish({
            destination: `/app/sendMessage/${chat}`,
            body: JSON.stringify(chatMessage),
            headers: { "content-type": "application/json" },
         });
      } catch (error) {
         console.error("Erro ao enviar mensagem:", error);
         setIsConnected(false);
      }
   };

   return (
      <div className="flex flex-col gap-2 h-full">
         <div className="bg-havprincipal rounded-tr-lg">
            <p className="text-xl font-semibold text-white px-8 py-3 truncate">
               {chatPartner && `${chatPartner.nome}`}
            </p>
         </div>
         <div className="flex flex-col gap-2 h-full py-2 px-5 overflow-y-auto hide-scrollbar">
            {messages.map((message, index) => (
               <div
                  key={index}
                  className={`flex flex-col gap-1 ${
                     message.isSender ? "items-end" : "items-start"
                  }`}
               >
                  <div
                     className={`${
                        message.isSender
                           ? "bg-havprincipal text-white"
                           : "bg-white"
                     } rounded-lg p-2 max-w-[50%] whitespace-normal break-words`}
                  >
                     <p>{message.conteudo}</p>
                  </div>
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>
         <div className="p-4 flex flex-row items-center gap-4 w-full justify-between">
            <div className="w-full">
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
                  onKeyDown={(e) => {
                     if (e.key === "Enter" && isConnected) {
                        sendMessage(e.currentTarget.value);
                        e.currentTarget.value = "";
                     }
                  }}
                  maxLength={200}
               />
            </div>
            <Send
               className={`cursor-pointer ${
                  isConnected ? "hover:text-havprincipal" : "text-gray-400"
               }`}
               onClick={() => {
                  if (isConnected && inputRef.current) {
                     sendMessage(inputRef.current.value);
                     inputRef.current.value = "";
                     inputRef.current.focus();
                  }
               }}
            />
         </div>
      </div>
   );
};

export default ChatMessages;
