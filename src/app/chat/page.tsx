"use client";

import ChatLayout from "@/components/chat/ChatLayout";
import Layout from "@/components/layout/LayoutPadrao";
import React from "react";
import { ChatProvider } from "@/context/ChatContext";

export default function ChatPage() {
   // Este componente é um wrapper para o ChatLayout
   // que garante que o ChatProvider seja inicializado apenas uma vez
   return (
      <ChatProvider>
         <Layout footerRemove className="p-0 h-full">
            <ChatLayout />
         </Layout>
      </ChatProvider>
   );
}
