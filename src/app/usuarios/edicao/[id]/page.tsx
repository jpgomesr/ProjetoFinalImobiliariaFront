import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React from "react";
import {
   buscarIdsUsuarios,
   buscarUsuarioPorId,
} from "@/Functions/usuario/buscaUsuario";
import Formulario from "./Formulario";

// Interface para os parâmetros da página
interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

// Gera os parâmetros estáticos para a página
export async function generateStaticParams() {
   const ids = await buscarIdsUsuarios();
   return ids.map((id) => ({ id: id.toString() }));
}

const Page = async ({ params }: PageProps) => {

   const {id} = await params

   const usuario = await buscarUsuarioPorId(id);

   if (!usuario) {
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
            <FundoBrancoPadrao titulo="Edição de usuário" className="w-full">
               <Formulario usuario={usuario} />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
