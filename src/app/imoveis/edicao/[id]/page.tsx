
import React from "react";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import { buscarIdsImoveis, buscarImovelPorId } from "@/Functions/imovel/buscaImovel";
import Formulario from "./Formulario";


interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

export async function generateStaticParams() {
   const ids = await buscarIdsImoveis();
   return ids.map((id) => ({ id: id.toString() }));
}


const Page = async ({params} : PageProps) => {
   
   const {id} = await params;

   const imovel : ModelImovelGet = await buscarImovelPorId(id)

 
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
            <FundoBrancoPadrao
               titulo="Edição de imóvel"
               className={`w-full`}
            >
               <Formulario imovel={imovel}/>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
