"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InputPadrao from "../InputPadrao";
import Image from "next/image";
import { useChat } from "@/context/ChatContext";

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

export default function ChatList() {
   const router = useRouter();
   const [search, setSearch] = useState("");
   const [loading, setLoading] = useState(true);
   const [localChats, setLocalChats] = useState<Chat[]>([]);
   const { chats, selectedChat, setSelectedChat, fetchChats, userId } =
      useChat();

   // Atualizar o estado local quando os chats do contexto mudarem
   useEffect(() => {
      console.log("Atualizando lista local de chats:", chats.length);
      setLocalChats(chats);
   }, [chats]);

   const handleContactClick = useCallback(
      (chatId: number) => {
         setSelectedChat(chatId);

         // Marcar mensagens como lidas apenas quando o usuário clica no chat
         fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}/marcarLidas?idUsuario=${userId}`,
            {
               method: "POST",
            }
         ).then(() => {
            // Atualizar localmente o status de leitura
            setLocalChats((prevChats) =>
               prevChats.map((chat) =>
                  chat.idChat === chatId ? { ...chat, naoLido: false } : chat
               )
            );
         });

         router.push(`/chat/?chat=${chatId}`);
      },
      [router, setSelectedChat, userId]
   );

   const getChatPartnerName = useCallback(
      (chat: Chat) => {
         if (!chat.usuario1 || !chat.usuario2) return "Usuário desconhecido";

         const userIdNum = Number(userId);
         if (chat.usuario1.id === userIdNum) {
            return chat.usuario2.nome || `Usuário ${chat.usuario2.id}`;
         } else {
            return chat.usuario1.nome || `Usuário ${chat.usuario1.id}`;
         }
      },
      [userId]
   );

   const getChatPartnerFoto = useCallback(
      (chat: Chat) => {
         if (!chat.usuario1 || !chat.usuario2) return null;

         const userIdNum = Number(userId);
         if (chat.usuario1.id === userIdNum) {
            return chat.usuario2.foto;
         } else {
            return chat.usuario1.foto;
         }
      },
      [userId]
   );

   // Carregar chats e configurar atualização periódica
   useEffect(() => {
      const loadChats = async () => {
         try {
            await fetchChats();
         } finally {
            setLoading(false);
         }
      };

      loadChats();

      // Configurar intervalo para forçar a re-renderização da lista periodicamente
      const intervalId = setInterval(() => {
         console.log("Forçando atualização visual da lista de chats");
         setLocalChats((prevChats) => [...prevChats]); // Força re-renderização
      }, 5000);

      return () => clearInterval(intervalId);

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Filtrar e ordenar chats de forma otimizada
   const filteredChats = useMemo(() => {
      console.log("Filtrando lista de chats com", localChats.length, "itens");
      console.log(
         "Chats não lidos:",
         localChats.filter((c) => c.naoLido).length
      );

      return Array.isArray(localChats)
         ? localChats
              .filter((chat) => {
                 if (!chat) return false;
                 const partnerName = getChatPartnerName(chat).toLowerCase();
                 return (
                    partnerName.includes(search.toLowerCase()) ||
                    chat.idChat.toString().includes(search)
                 );
              })
              .sort((a, b) => {
                 // Ordenar por mensagens não lidas primeiro
                 if (a.naoLido && !b.naoLido) return -1;
                 if (!a.naoLido && b.naoLido) return 1;

                 // Depois ordenar por data da última mensagem
                 if (a.ultimaMensagem && b.ultimaMensagem) {
                    return (
                       new Date(b.ultimaMensagem.timeStamp).getTime() -
                       new Date(a.ultimaMensagem.timeStamp).getTime()
                    );
                 }
                 return 0;
              })
         : [];
   }, [localChats, search, getChatPartnerName]);

   if (loading) {
      return (
         <div className="flex flex-col h-full bg-[#E8E1D9] rounded-l-lg">
            <div className="py-3 bg-[#6D2639] text-white text-center rounded-tl-lg">
               <h2 className="font-bold text-xl">Chat</h2>
            </div>
            <div className="flex items-center justify-center h-full">
               <p>Carregando chats...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full bg-[#E8E1D9] rounded-l-lg">
         <div className="py-3 bg-[#6D2639] text-white text-center rounded-tl-lg">
            <h2 className="font-bold text-xl">Chat</h2>
         </div>
         <div className="p-2">
            <InputPadrao
               placeholder="Pesquisar por nome..."
               className="bg-white w-full rounded-lg"
               value={search}
               onChange={(e) => {
                  setSearch(e.target.value);
               }}
            />
         </div>
         <div className="h-full overflow-y-auto hide-scrollbar">
            {filteredChats.length > 0 ? (
               filteredChats.map((chat, index) => (
                  <div
                     key={chat.id}
                     className={`flex items-center gap-3 p-3 hover:bg-gray-100 hover:rounded-lg
                               cursor-pointer ${
                                  selectedChat === chat.idChat
                                     ? "bg-gray-100"
                                     : ""
                               } ${
                        index === filteredChats.length - 1
                           ? ""
                           : "border-b border-gray-400"
                     }`}
                     onClick={() => handleContactClick(chat.idChat)}
                  >
                     <div className="flex-1 flex items-center gap-2 max-w-full">
                        <div className="relative">
                           <Image
                              src={
                                 getChatPartnerFoto(chat) ||
                                 "/perfil-padrao.png"
                              }
                              alt={getChatPartnerName(chat)}
                              className="w-10 h-10 rounded-full border border-gray-400"
                              width={1920}
                              height={1080}
                           />
                           {chat.naoLido && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                           )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                           <div className="flex justify-between items-center">
                              <div className="font-medium truncate">
                                 {getChatPartnerName(chat)}
                              </div>
                              {chat.ultimaMensagem && (
                                 <div className="text-xs text-gray-500 flex-shrink-0 ml-1">
                                    {new Date(
                                       chat.ultimaMensagem.timeStamp
                                    ).toLocaleTimeString([], {
                                       hour: "2-digit",
                                       minute: "2-digit",
                                    })}
                                 </div>
                              )}
                           </div>
                           <div className="text-sm text-gray-500 truncate w-auto min-w-0">
                              {chat.ultimaMensagem?.conteudo ||
                                 "Clique para iniciar uma conversa"}
                           </div>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 font-inter">
                     Nenhum chat encontrado
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
