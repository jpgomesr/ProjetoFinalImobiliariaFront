import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioCadastroImovel from "./FormularioCadastroImovel";

export default function Page() {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FormularioCadastroImovel />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
