import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioCadastroUsuario from "./FormularioCadastroUsuario";

const Page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FormularioCadastroUsuario />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
