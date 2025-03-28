import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioCadastroProprietario from "./FormularioCadastroProprietario";

export default function Page() {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FormularioCadastroProprietario />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
