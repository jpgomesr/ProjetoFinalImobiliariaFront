import React, { Suspense } from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import PerguntasFrequentesClient from "./cliente";

const Page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Perguntas Frequentes">
               <Suspense fallback={<div>Carregando...</div>}>
                  <PerguntasFrequentesClient />
               </Suspense>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
