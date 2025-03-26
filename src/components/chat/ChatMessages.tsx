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
}

interface DisplayMessage {
   id?: number;
   conteudo: string;
   remetente: string;
   idChat: number;
   timestamp: string;
   isSender: boolean;
}

const ChatMessages = ({ chat }: ChatMessagesProps) => {
   const [messages, setMessages] = useState<DisplayMessage[]>([]);
   const [stompClient, setStompClient] = useState<Client | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   // Função para obter o nome do usuário pelo ID
   const getUserName = (userId: string) => {
      return `${userId}`;
   };

   const id = localStorage.getItem("idUsuario");

   useEffect(() => {
      // Buscar mensagens anteriores
      const fetchMessages = async () => {
         try {
            const response = await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chat}/mensagens?idUsuario=${id}`
            );
            if (response.ok) {
               const data: ChatMessage[] = await response.json();
               const formattedMessages: DisplayMessage[] = data.map((msg) => ({
                  conteudo: msg.conteudo,
                  remetente: getUserName(msg.remetente),
                  idChat: chat,
                  timestamp: msg.timeStamp || new Date().toISOString(),
                  isSender: msg.remetente === id,
               }));
               setMessages(formattedMessages);
            }
         } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
         }
      };

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
            // Agora podemos buscar as mensagens
            await fetchMessages();
         } catch (error) {
            console.error("Erro ao criar/entrar no chat:", error);
         }
      };

      createOrJoinChat();

      const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);
      const client = new Client({
         webSocketFactory: () => socket,
         reconnectDelay: 5000,
         heartbeatIncoming: 4000,
         heartbeatOutgoing: 4000,
         connectHeaders: {
            userId: id,
         },
      });

      client.onConnect = (frame) => {
         console.log("Connected: " + frame);
         setIsConnected(true);

         client.subscribe(`/topic/chat/${chat}`, (message) => {
            const chatMessage: ChatMessage = JSON.parse(message.body);
            const newMessage: DisplayMessage = {
               conteudo: chatMessage.conteudo,
               remetente: getUserName(chatMessage.remetente),
               idChat: chat,
               timestamp: chatMessage.timeStamp || new Date().toISOString(),
               isSender: chatMessage.remetente === id,
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

      return () => {
         if (client && client.connected) {
            client.deactivate();
         }
      };
   }, [chat]);

   const sendMessage = (message: string) => {
      if (stompClient && isConnected && message.trim()) {
         const chatMessage = {
            conteudo: message,
            remetente: id,
            idChat: chat,
         };

         try {
            console.log("Enviando mensagem:", chatMessage);
            stompClient.publish({
               destination: `/app/sendMessage/${chat}`,
               body: JSON.stringify(chatMessage),
               headers: { "content-type": "application/json" },
            });
         } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
         }
      } else if (!isConnected) {
         console.error("Não há conexão com o WebSocket");
      } else if (!message.trim()) {
         console.error("Mensagem vazia");
      } else {
         console.error("Cliente STOMP não inicializado", stompClient);
      }
   };

   return (
      <div className="flex flex-col gap-2 h-full">
         <div className="bg-havprincipal rounded-tr-lg">
            <p className="text-xl font-semibold text-white px-8 py-3 truncate">
               Chat ID: {chat} {!isConnected && "(Desconectado)"} - {id}
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
