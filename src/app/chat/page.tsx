import ChatLayout from "@/components/chat/ChatLayout";
import Layout from "@/components/layout/LayoutPadrao";
import React from "react";

const page = () => {
   return (
      <Layout footerRemove className="p-0 h-full">
         <ChatLayout />
      </Layout>
   );
};

export default page;
