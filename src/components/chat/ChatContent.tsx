"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import ChatMessages from "./ChatMessages";

const ChatContent = () => {
   const searchParams = useSearchParams();
   const chatParam = searchParams.get("chat");
   const chat = chatParam ? parseInt(chatParam, 10) : null;

   if (chat === null || isNaN(chat)) {
      return (
         <div className="h-full bg-begeClaroPadrao rounded-r-lg flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-havprincipal mb-2">
                  Nenhum chat selecionado
               </h2>
               <p className="text-gray-600">
                  Selecione uma conversa para começar
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="h-full bg-begeClaroPadrao rounded-r-lg">
         <ChatMessages chat={chat} />
      </div>
   );
};

export default ChatContent;
