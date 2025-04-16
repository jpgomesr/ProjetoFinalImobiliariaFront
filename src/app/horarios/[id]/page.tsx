import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
import HorariosClient from "./HorariosClient";

interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

export default async function MeusHorarios({ params }: PageProps) {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
   const paramsResolvidos = await params

   const session = await getServerSession(authOptions)
   if(!session){
      redirect("/api/auth/signin")
   }
   if(session.user.id !== paramsResolvidos.id || session.user.role !== Roles.CORRETOR){
      redirect("/")
   }

   return (
      <Layout className="my-0">
         <SubLayoutPaginasCRUD>
            <HorariosClient 
               id={paramsResolvidos.id} 
               BASE_URL={BASE_URL} 
               token={session.accessToken || ""} 
            />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
