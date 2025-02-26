"use client";

import { useState } from "react";
import CardImovel from "../components/card/CardImovel";
import ModelImovel from "../models/ModelImovel";
import Layout from "../components/layout/LayoutPadrao";
import CompontentePrincipalFiltro from "@/components/componetes_filtro/CompontentePrincipalFiltro";
import { Roles } from "@/models/Enum/Roles";
import Image from "next/image";
import TituloBgDegrade from "@/components/TituloBgDegrade";

export default function Home() {
   const imovel1 = new ModelImovel(
      "Casa",
      true,
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
   );
   const imovel2 = new ModelImovel(
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
   );
   const tabelaTest = [imovel1, imovel2];
   const [imovel] = useState(tabelaTest);

   return (
      <Layout role={Roles.ADMIN} className="pt-0 py-8 bg-begeClaroPadrao">
         <div className="h-full">
            <div
               className="h-[30vh] overflow-hidden relative z-10
                           md:h-[35vh]
                           lg:h-[40vh]"
            >
               <Image
                  src="/image-paginaprincipal.png"
                  alt="a"
                  fill
                  className="object-cover"
               />
            </div>
            <div
               className="w-full mt-[-9vh] relative z-20
                           lg:mt-[-20vh]"
            >
               <div className="flex justify-center">
                  <CompontentePrincipalFiltro />
               </div>
            </div>
         </div>
         <div className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="destaque" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imovel.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} destaque={true} />
               ))}
            </div>
         </div>
         <div className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="condições especias" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imovel.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} destaque={false} />
               ))}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imovel.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} destaque={false} />
               ))}
            </div>
         </div>
         <div className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="condições especias" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imovel.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} destaque={false} />
               ))}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imovel.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} destaque={false} />
               ))}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imovel.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} destaque={false} />
               ))}
            </div>
         </div>
      </Layout>
   );
}
