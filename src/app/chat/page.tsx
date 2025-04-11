import { getServerSession } from "next-auth";
import Layout from "@/components/layout/LayoutPadrao";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import ChatLayout from "@/components/chat/ChatLayout";
import { ChatProvider } from "@/context/ChatContext";
export default async function ChatPage() {
   const session = await getServerSession(authOptions);

   if (!session) {
      return redirect("/login");
   }

   return (
      <Layout footerRemove className="p-0 h-full">
         <ChatProvider session={session}>
            <ChatLayout />
         </ChatProvider>
      </Layout>
   );
}
