import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import Layout from "@/components/layout/LayoutPadrao";
import React from "react";
import SuporteClient from "./cliente";

const page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Suporte ao cliente" className="w-full">
               <section className="flex flex-row gap-4">
                  <div>
                     <h1 className="text-2xl font-bold">
                        Como podemos te ajudar?
                     </h1>
                     <h2 className="text-sm text-gray-500">
                        Selecione uma opção.
                     </h2>
                  </div>
               </section>
               <SuporteClient />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
