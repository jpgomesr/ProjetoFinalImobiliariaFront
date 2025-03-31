import { getServerSession } from "next-auth";
import ChatLayout from "@/components/chat/ChatLayout";
import Layout from "@/components/layout/LayoutPadrao";
import { ChatProvider } from "@/context/ChatContext";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ChatPage() {
   const session = await getServerSession(authOptions);

   return (
      <ChatProvider session={session}>
         <Layout footerRemove className="p-0 h-full">
            <ChatLayout />
         </Layout>
      </ChatProvider>
   );
}
