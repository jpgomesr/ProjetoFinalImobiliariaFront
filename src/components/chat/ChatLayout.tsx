"use client";

import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { useSearchParams } from "next/navigation";

const ChatLayout = () => {
   const searchParams = useSearchParams();
   const chatParam = searchParams.get("chat");
   const chat = chatParam ? parseInt(chatParam, 10) : null;

   const [chatVisible, setChatVisible] = useState(false);

   const handleChatOpen = () => {
      setChatVisible(true);
   };

   const handleChatClose = () => {
      setChatVisible(false);
   };

   return (
      <div className="h-full bg-begeClaroPadrao py-8 px-16">
         <div className="w-full h-[77.3vh]">
            <div className="flex h-full rounded-xl shadow-lg">
               <div className="h-full w-1/4">
                  <ChatList onOpenChat={handleChatOpen} />
               </div>
               <div className="w-3/4">
                  <ChatContent/>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChatLayout;
