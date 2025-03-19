import React from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";

const ChatLayout = () => {
   return (
      <div className="h-full bg-begeClaroPadrao py-8 px-16">
         <div className="w-full h-[77.3vh]">
            <div className="flex h-full rounded-xl shadow-lg">
               <div className="h-full w-1/4">
                  <ChatList />
               </div>
               <div className="w-3/4">
                  <ChatContent />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChatLayout;
