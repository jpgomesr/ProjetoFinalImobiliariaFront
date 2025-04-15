import Layout from "@/components/layout/LayoutPadrao";
import React from "react";
import SobreNosClient from "./SobreNosClient";

// Este é um componente de servidor
export default function Page() {
   // Aqui você pode colocar qualquer lógica de servidor, como buscar dados
   // Você também pode verificar autenticação ou fazer outras operações no servidor
   
   return (
      <Layout className="my-0">
         <SobreNosClient />
      </Layout>
   );
}
