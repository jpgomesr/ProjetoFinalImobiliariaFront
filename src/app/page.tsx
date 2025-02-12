"use client";

import { useState } from "react";
import CardImovel from "./components/card/CardImovel";
import ModelImovel from "./models/ModelImovel";

export default function Home() {
   const [imovel] = useState(
      new ModelImovel(
         "Casa",
         false,
         "Venda",
         99999,
         9999,
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
         "PROMOÇÃO"
      )
   );

   return (
      <div>
         <CardImovel imovel={imovel} />
      </div>
   );
}
