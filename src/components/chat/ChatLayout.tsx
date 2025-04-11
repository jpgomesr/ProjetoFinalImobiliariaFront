"use client";

import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { useSearchParams, useRouter } from "next/navigation";

const ChatLayout = () => {
   const searchParams = useSearchParams();
   const router = useRouter();
   const chatParam = searchParams.get("chat");
   const chat = chatParam ? parseInt(chatParam, 10) : null;

   const [isMobile, setIsMobile] = useState(false);
   const [chatVisible, setChatVisible] = useState(!!chat);

   useEffect(() => {
      const checkMobile = () => {
         setIsMobile(window.innerWidth < 768);
      };

      checkMobile();

      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
   }, []);

   useEffect(() => {
      setChatVisible(!!chat);
   }, [chat]);

   const handleChatOpen = () => {
      setChatVisible(true);
   };

   const handleChatClose = () => {
      setChatVisible(false);
      router.push("/chat");
   };

   return (
      <div className="h-full bg-begeClaroPadrao py-4 md:py-8 px-4 md:px-16">
         <div className="w-full h-[85vh] md:h-[77.3vh] lg:h-[76.5vh] 2xl:h-[75vh]">
            <div className="flex h-full rounded-xl shadow-lg">
               <div
                  className={`${
                     isMobile && chatVisible ? "hidden" : "w-full md:w-1/4"
                  }`}
               >
                  <ChatList onOpenChat={handleChatOpen} />
               </div>
               <div
                  className={`h-full ${
                     isMobile && !chatVisible ? "hidden" : "w-full md:w-3/4"
                  }`}
               >
                  <ChatContent
                     closeChat={handleChatClose}
                     isMobile={isMobile}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChatLayout;
