
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React from "react";
import Formulario from "./Formulario";
import { buscarIdsProprietarios, buscarProprietarioPorId } from "@/Functions/proprietario/buscaProprietario";
import ModelProprietario from "@/models/ModelProprietario";
import { Roles } from "@/models/Enum/Roles";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
interface PageProps {
   params: Promise<{
      id: string;
   }>;
}
export async function generateStaticParams() {

   
   const ids = await buscarIdsProprietarios();
   return ids.map((id) => ({ id: id.toString() }));
}

const Page = async  ({params }  : PageProps) => {
   let { id } = await params
   
   const proprietario : ModelProprietario = await buscarProprietarioPorId(id)
   
   
   
   const session = await getServerSession(authOptions);
   
   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR && session.user?.role !== Roles.EDITOR) {
      redirect("/");
   }
   
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Edição de proprietário"
               className={`w-full`}
               >
               <Formulario proprietario={proprietario}/>
              
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
