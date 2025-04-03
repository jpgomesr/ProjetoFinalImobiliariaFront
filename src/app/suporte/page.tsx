import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import Layout from "@/components/layout/LayoutPadrao";
import React from "react";
import FormPerguntas from "@/components/componentes_suporte/FormPerguntas";

const page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Suporte ao cliente" className="w-full">
               <FormPerguntas />
               <h1></h1>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>

      </Layout>
   );
};

export default page;
