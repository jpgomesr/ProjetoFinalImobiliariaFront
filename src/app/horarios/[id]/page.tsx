import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import FormularioHorarios from "./FormularioHorarios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
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
            <FundoBrancoPadrao titulo="Meus horários">
               <FormularioHorarios id={paramsResolvidos.id} BASE_URL={BASE_URL} />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
