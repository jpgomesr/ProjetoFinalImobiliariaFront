"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/UseMobile";
import InputPadrao from "../InputPadrao";

interface Chat {
   id: number;
   idChat: number;
}

export default function ChatList() {
   const router = useRouter();
   const isMobile = useMobile();
   const [search, setSearch] = useState("");
   const [chats, setChats] = useState<Chat[]>([]);
   const [loading, setLoading] = useState(true);

   const handleContactClick = (id: number) => {
      if (isMobile) {
         router.push(`/chat/${id}`);
      } else {
         router.push(`/chat/?chat=${id}`);
      }
   };

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
               placeholder="Pesquisar por ID do chat..."
               className="bg-white w-full rounded-lg"
               value={search}
               onChange={(e) => {
                  // Permite apenas números
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setSearch(value);
               }}
            />
         </div>
         <div className="h-full overflow-y-auto hide-scrollbar">
            {chats
               .filter((chat) => chat.idChat.toString().includes(search))
               .map((chat, index) => (
                  <div
                     key={chat.id}
                     className={`flex items-center gap-3 p-3 hover:bg-gray-100 hover:rounded-lg
                               cursor-pointer ${
                                  index === chats.length - 1
                                     ? ""
                                     : "border-b border-gray-400"
                               }`}
                     onClick={() => {
                        handleContactClick(chat.idChat);
                        router.refresh();
                     }}
                  >
                     <div className="flex-1">
                        <div className="font-medium">Chat {chat.idChat}</div>
                        <div className="text-sm text-gray-500">
                           Clique para abrir o chat
                        </div>
                     </div>
                  </div>
               ))}
         </div>
      </div>
   );
}
