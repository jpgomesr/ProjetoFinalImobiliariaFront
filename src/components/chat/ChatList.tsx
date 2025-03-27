"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputPadrao from "../InputPadrao";
import Image from "next/image";

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
}

export default function ChatList() {
   const router = useRouter();
   const [search, setSearch] = useState("");
   const [chats, setChats] = useState<Chat[]>([]);
   const [loading, setLoading] = useState(true);

   const id = localStorage.getItem("idUsuario") || "1";
   if (!localStorage.getItem("idUsuario")) {
      localStorage.setItem("idUsuario", "1");
   }

   const handleContactClick = (id: number) => {
      router.push(`/chat/?chat=${id}`);
   };

   const getChatPartnerName = (chat: Chat) => {
      const userId = Number(id);
      if (chat.usuario1.id === userId) {
         return chat.usuario2.nome;
      } else {
         return chat.usuario1.nome;
      }
   };

   const getChatPartnerFoto = (chat: Chat) => {
      const userId = Number(id);
      if (chat.usuario1.id === userId) {
         return chat.usuario2.foto;
      } else {
         return chat.usuario1.foto;
      }
   };

   useEffect(() => {
      const fetchChats = async () => {
         try {
            const response = await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/chat/list/${id}`,
               {
                  headers: {
                     "Content-type": "application/json",
                  },
                  method: "GET",
               }
            );
            const data = await response.json();
            console.log(data);
            // Garantir que data é um array
            setChats(Array.isArray(data) ? data : []);
            setLoading(false);
         } catch (error) {
            console.error("Erro ao carregar chats:", error);
            setChats([]);
            setLoading(false);
         }
      };

      fetchChats();
   }, [id]);

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

   const filteredChats = Array.isArray(chats)
      ? chats.filter((chat) => {
           const partnerName = getChatPartnerName(chat).toLowerCase();
           return (
              partnerName.includes(search.toLowerCase()) ||
              chat.idChat.toString().includes(search)
           );
        })
      : [];

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
                                  index === filteredChats.length - 1
                                     ? ""
                                     : "border-b border-gray-400"
                               }`}
                     onClick={() => {
                        handleContactClick(chat.idChat);
                        router.refresh();
                     }}
                  >
                     <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                           <Image
                              src={getChatPartnerFoto(chat) || "/perfil-padrao.png"}
                              alt={getChatPartnerName(chat)}
                              className="w-10 h-10 rounded-full border border-gray-400"
                              width={1920}
                              height={1080}
                           />
                        </div>
                        <div className="flex flex-col">
                           <div className="font-medium">
                              {getChatPartnerName(chat)}
                           </div>
                           <div className="text-sm text-gray-500">
                              Clique para abrir o chat
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
