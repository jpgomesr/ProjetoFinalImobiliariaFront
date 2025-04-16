import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import PerguntasFrequentesClient from "./cliente";

const page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <PerguntasFrequentesClient />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
