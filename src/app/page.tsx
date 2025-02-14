"use client";

import { useState } from "react";
import CardImovel from "../components/card/CardImovel";
import HeaderVermelho from "../components/headers/HeaderVermelho";
import ModelImovel from "../models/ModelImovel";

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
      <div className="flex flex-col gap-4">
         <HeaderVermelho />
         <CardImovel imovel={imovel} />
      </div>
   );
}
