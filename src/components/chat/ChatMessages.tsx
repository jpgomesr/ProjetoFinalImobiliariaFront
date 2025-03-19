import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import InputPadrao from "../InputPadrao";
import { Send } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface ChatMessagesProps {
   chat: number; // ID do chat
}

interface ChatMessage {
   conteudo: string;
   remetente: string;
   tipoMensagem: "MENSAGEM" | "ENTROU" | "SAIU";
}

// Para acessar o chat pelo outro lado:
// 1. Abra outra janela do navegador ou aba
// 2. Acesse a mesma URL: http://localhost:3000/chat?chat=X 
//    (onde X é o ID do chat que você quer acessar)
// 3. Um novo usuário será gerado automaticamente
// 4. As mensagens serão sincronizadas entre as duas janelas

const ChatMessages = ({ chat }: ChatMessagesProps) => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [stompClient, setStompClient] = useState<Client | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const [username, setUsername] = useState(() => {
      // Tenta recuperar o username do localStorage
      const savedUsername = localStorage.getItem(`chat_username_${chat}`);
      if (savedUsername) return savedUsername;

      // Se não existir, cria um novo e salva
      const newUsername = `Usuário${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem(`chat_username_${chat}`, newUsername);
      return newUsername;
   });

   useEffect(() => {
      // Configurando o SockJS para usar credenciais e headers CORS
      const socket = new SockJS("http://localhost:8082/ws", null, {
         transports: ["websocket"],
      });

      const client = new Client({
         webSocketFactory: () => socket,
         reconnectDelay: 5000,
         heartbeatIncoming: 4000,
         heartbeatOutgoing: 4000,
      });

      client.onConnect = (frame) => {
         console.log("Connected: " + frame);
         setIsConnected(true);

         // Recupera mensagens anteriores do localStorage
         const savedMessages = localStorage.getItem(`chat_messages_${chat}`);
         if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
         }

         // Envia mensagem que usuário entrou no chat
         client.publish({
            destination: `/app/chat.addUser.${chat}`,
            body: JSON.stringify({
               remetente: username,
               tipoMensagem: "ENTROU",
            }),
         });

         // Inscreve no tópico do chat
         client.subscribe(`/topic/chat.${chat}`, (message) => {
            const chatMessage: ChatMessage = JSON.parse(message.body);

            const newMessage: Message = {
               id: messages.length + 1,
               mensagem:
                  chatMessage.tipoMensagem === "MENSAGEM"
                     ? chatMessage.conteudo
                     : chatMessage.tipoMensagem === "ENTROU"
                     ? `${chatMessage.remetente} entrou no chat`
                     : `${chatMessage.remetente} saiu do chat`,
               isSender: chatMessage.remetente === username,
            };

            setMessages((prevMessages) => {
               const updatedMessages = [...prevMessages, newMessage];
               // Salva mensagens no localStorage
               localStorage.setItem(
                  `chat_messages_${chat}`,
                  JSON.stringify(updatedMessages)
               );
               return updatedMessages;
            });
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
         if (client.connected) {
            // Envia mensagem que usuário saiu
            client.publish({
               destination: `/app/chat.sendMessage.${chat}`,
               body: JSON.stringify({
                  remetente: username,
                  tipoMensagem: "SAIU",
               }),
            });
            client.deactivate();
         }
      };
   }, [chat, username]);

   const sendMessage = (message: string) => {
      if (stompClient && isConnected && message.trim()) {
         const chatMessage = {
            conteudo: message,
            remetente: username,
            tipoMensagem: "MENSAGEM" as const,
         };

         try {
            stompClient.publish({
               destination: `/app/chat.sendMessage.${chat}`,
               body: JSON.stringify(chatMessage),
            });
         } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
         }
      } else if (!isConnected) {
         console.error("Não há conexão com o WebSocket");
      }
   };

   return (
      <div className="flex flex-col gap-2 h-full">
         <div className="bg-havprincipal rounded-tr-lg">
            <p className="text-xl font-semibold text-white px-8 py-3 truncate">
               Chat ID: {chat} {!isConnected && "(Desconectado)"} - {username}
            </p>
         </div>
         <div className="flex flex-col gap-2 h-full py-2 px-5 justify-end">
            {messages &&
               messages.map((message, index) => (
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
                        } rounded-lg p-2 max-w-[40%] inline-block`}
                     >
                        <p>{message.mensagem}</p>
                     </div>
                     <div className="text-xs text-gray-500">
                        {message.isSender ? "Você" : `Usuário ${chat}`}
                     </div>
                  </div>
               ))}
         </div>
         <div className="p-4 flex flex-row items-center gap-4 w-full justify-between">
            <div className="w-full">
               <input
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
               />
            </div>
            <Send
               className={`cursor-pointer ${
                  isConnected ? "hover:text-havprincipal" : "text-gray-400"
               }`}
               onClick={() => {
                  if (isConnected) {
                     const input = document.querySelector(
                        "input"
                     ) as HTMLInputElement;
                     if (input) {
                        sendMessage(input.value);
                        input.value = "";
                     }
                  }
               }}
            />
         </div>
      </div>
   );
};

export default ChatMessages;
