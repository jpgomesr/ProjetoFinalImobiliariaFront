"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/UseMobile";
import InputPadrao from "../InputPadrao";

const contacts = [
   { id: "1", name: "Nome 1", message: "Última mensagem", unread: true },
   { id: "2", name: "Nome 2", message: "Última mensagem", unread: false },
   { id: "3", name: "Nome 3", message: "Última mensagem", unread: true },
   { id: "4", name: "Nome 4", message: "Última mensagem", unread: false },
   { id: "5", name: "Nome 5", message: "Última mensagem", unread: true },
   { id: "6", name: "Nome 6", message: "Última mensagem", unread: false },
   { id: "7", name: "Nome 7", message: "Última mensagem", unread: true },
   { id: "8", name: "Nome 8", message: "Última mensagem", unread: false },
];

export default function ChatList() {
   const router = useRouter();
   const isMobile = useMobile();
   const [search, setSearch] = useState("");

   const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase())
   );

   const handleContactClick = (id: string) => {
      if (isMobile) {
         router.push(`/chat/${id}`);
      } else {
         router.push(`/chat/?chat=${id}`);
      }
   };

   return (
      <div className="flex flex-col h-full bg-[#E8E1D9] rounded-l-lg">
         <div className="py-3 bg-[#6D2639] text-white text-center rounded-tl-lg">
            <h2 className="font-bold text-xl">Chat</h2>
         </div>
         <div className="p-2">
            <InputPadrao
               placeholder="Pesquisar..."
               className="bg-white w-full rounded-lg"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="h-full overflow-y-auto hide-scrollbar">
            {filteredContacts.map((contact, index) => (
               <div
                  key={index}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-100 hover:rounded-lg
                            cursor-pointer ${
                               index === filteredContacts.length - 1
                                  ? ""
                                  : "border-b border-gray-400"
                            }`}
                  onClick={() => {
                     handleContactClick(contact.id);
                     router.refresh();
                  }}
               >
                  <div className="flex-1">
                     <div className="font-medium">{contact.name}</div>
                     <div className="text-sm text-gray-500">
                        {contact.message}
                     </div>
                  </div>
                  {contact.unread && (
                     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
}
