
import CardImovel from "../components/card/CardImovel";
import ModelImovel from "../models/ModelImovel";
import Layout from "../components/layout/LayoutPadrao";
import CompontentePrincipalFiltro from "@/components/componetes_filtro/pagina_inicial/CompontentePrincipalFiltro";
import { Roles } from "@/models/Enum/Roles";
import Image from "next/image";
import TituloBgDegrade from "@/components/TituloBgDegrade";
import { Suspense } from "react";

export default function Home() {
   
   const imoveis : ModelImovel[] = [];

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
               <Suspense fallback={<div>Carregando filtros...</div>}>
                     <CompontentePrincipalFiltro />
                  </Suspense>
               </div>
            </div>
         </div>
         <div className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="destaque" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel}  />
               ))}
            </div>
         </div>
         <div className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="condições especias" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel}  />
               ))}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel}  />
               ))}
            </div>
         </div>
         <div className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis " boldText="recentemente adicionados" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel}  />
               ))}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel}  />
               ))}
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} />
               ))}
            </div>
         </div>
      </Layout>
   );
}
