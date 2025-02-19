"use client";

import { useState } from "react";
import CardImovel from "../components/card/CardImovel";
import ModelImovel from "../models/ModelImovel";
import Layout from "../components/Layout";
import CompontentePrincipalFiltro from "@/components/componetes_filtro/CompontentePrincipalFiltro";

export default function Home() {
   const [imovel] = useState(
      new ModelImovel(
         "Casa",
         false,
         "Venda",
         99999,
         12345,
         "Rua Arthur Gonçalves de Araujo",
         "João Pessoa",
         "Jaraguá do Sul",
         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque illum, voluptas commodi ullam enim ipsam voluptate, cupiditate natus.",
         1,
         1,
         1,
         32,
         true,
         "MELHOR PREÇO"
      )
   );

   return (
      <Layout>
         <div>
            <CompontentePrincipalFiltro />
         </div>
         <CardImovel imovel={imovel} />
      </Layout>
   );
}
