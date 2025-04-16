"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InputPadrao from "../InputPadrao";
import Image from "next/image";
import { useChat } from "@/context/ChatContext";
import { User } from "lucide-react";

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

interface ChatListServerProps {
   onOpenChat: () => void;
}

export default function ChatListServer(props: ChatListServerProps) {
   const router = useRouter();
   const [search, setSearch] = useState("");
   const [loading, setLoading] = useState(true);
   const [localChats, setLocalChats] = useState<Chat[]>([]);
   const [isLoadingChat, setIsLoadingChat] = useState(false);
   const {
      chats,
      selectedChat,
      setSelectedChat,
      fetchChats,
      userId,
      resetConnection,
      token,
   } = useChat();

   // Atualizar o estado local quando os chats do contexto mudarem
   useEffect(() => {
      setLocalChats(chats);
   }, [chats]);

   const handleContactClick = useCallback(
      async (chatId: number) => {
         if (isLoadingChat || chatId === selectedChat) {
            return;
         }

         try {
            setIsLoadingChat(true);
            resetConnection();
            setSelectedChat(chatId);

            await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}/marcarLidas?idUsuario=${userId}`,
               {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`,
                  },
               }
            );

            await fetchChats();
            props.onOpenChat();
            router.replace(`/chat/?chat=${chatId}`);
         } catch (error) {
            console.error("Erro ao carregar chat:", error);
            router.replace(`/chat/?chat=${chatId}`);
         } finally {
            setTimeout(() => {
               setIsLoadingChat(false);
            }, 300);
         }
      },
      [
         router,
         setSelectedChat,
         userId,
         selectedChat,
         resetConnection,
         fetchChats,
         token,
         props,
         isLoadingChat,
      ]
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
            // Não fazemos fetchChats aqui para evitar chamadas duplicadas
            // O fetchChats já é chamado no ChatContext
         } catch (error) {
            console.error("Erro ao carregar chats:", error);
         } finally {
            setLoading(false);
         }
      };

      loadChats();
   }, []);

   // Filtrar e ordenar chats de forma otimizada
   const filteredChats = useMemo(() => {
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
                 if (a.naoLido && !b.naoLido) return -1;
                 if (!a.naoLido && b.naoLido) return 1;

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
         <div className="flex flex-col h-full bg-begeClaroPadrao rounded-lg md:rounded-r-none md:rounded-l-lg">
            <div className="py-3 bg-havprincipal text-white text-center rounded-t-lg md:rounded-tr-none md:rounded-tl-lg">
               <h2 className="font-bold text-xl">Chat</h2>
            </div>
            <div className="flex items-center justify-center h-full">
               <p>Carregando...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full bg-begeClaroPadrao rounded-lg md:rounded-l-lg">
         <div className="py-3 bg-havprincipal text-white text-center rounded-t-lg md:rounded-tr-none md:rounded-tl-lg">
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
            {isLoadingChat && (
               <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                     <p className="text-gray-700">Carregando chat...</p>
                  </div>
               </div>
            )}
            {filteredChats.length > 0 ? (
               filteredChats.map((chat, index) => (
                  <div
                     key={`chat-${chat.idChat}`}
                     className={`flex items-center gap-3 p-3 hover:bg-gray-100 hover:rounded-lg
                               cursor-pointer ${
                                  selectedChat === chat.idChat
                                     ? "bg-gray-100"
                                     : ""
                               } ${
                        index === filteredChats.length - 1
                           ? ""
                           : "border-b border-gray-400"
                     } ${
                        isLoadingChat ? "opacity-70 pointer-events-none" : ""
                     }`}
                     onClick={() => handleContactClick(chat.idChat)}
                  >
                     <div className="flex-1 flex items-center gap-2 max-w-full">
                        <div className="relative">
                           {getChatPartnerFoto(chat) ? (
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
                           ) : (
                              <div
                                 className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center border
                                          border-gray-500"
                              >
                                 <User className="w-6 h-6 text-gray-800" />
                              </div>
                           )}
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
