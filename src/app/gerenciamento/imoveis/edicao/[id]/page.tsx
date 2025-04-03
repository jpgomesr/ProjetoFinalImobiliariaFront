import React, { Suspense } from "react";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import {
   buscarIdsImoveis,
   buscarImovelPorId,
} from "@/Functions/imovel/buscaImovel";
import Formulario from "./Formulario";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Roles } from "@/models/Enum/Roles";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Força revalidação dinâmica
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

export async function generateStaticParams() {
   const ids = await buscarIdsImoveis();
   return ids.map((id) => ({ id: id.toString() }));
}

const Page = async ({ params }: PageProps) => {


   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR && session.user?.role !== Roles.EDITOR) {
      redirect("/");
   }     

   const { id } = await params;


   const imovel: ModelImovelGet = await buscarImovelPorId(id);

   if (!imovel) {
      return (
         <Layout className="py-0">
            <SubLayoutPaginasCRUD>
               <FundoBrancoPadrao titulo="Edição de usuário" className="w-full">
                  <p>Usuário não encontrado.</p>
               </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
         </Layout>
      );
   }

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <Suspense fallback={<div>Carregando...</div>}>
               <FundoBrancoPadrao
                  titulo="Edição de imóvel"
                  className={`w-full`}
               >
                  <Formulario imovel={imovel} token={session.accessToken || ""} />
               </FundoBrancoPadrao>
            </Suspense>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
