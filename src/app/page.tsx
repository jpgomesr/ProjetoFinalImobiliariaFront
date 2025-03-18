import CardImovel from "../components/card/CardImovel";
import ModelImovel from "../models/ModelImovel";
import Layout from "../components/layout/LayoutPadrao";
import CompontentePrincipalFiltro from "@/components/componetes_filtro/pagina_inicial/CompontentePrincipalFiltro";
import { Roles } from "@/models/Enum/Roles";
import Image from "next/image";
import TituloBgDegrade from "@/components/TituloBgDegrade";
import { Suspense } from "react";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";

export default async function Home() {
   const imoveisDestaque = await buscarTodosImoveis({ destaque: "true" });
   const imoveisCondicoesEspeciais = await buscarTodosImoveis({
      ativo: "true",
      condicoesEspeciais: "true",
      revalidate: 60,
   });
   const imoveisRecentes = await buscarTodosImoveis({
      ativo: "true",
      sort: "dataCadastro,desc",
      paginaAtual: "0",
      revalidate: 60,
   });

   return (
      <Layout role={Roles.ADMIN} className="pt-0 py-8 bg-begeClaroPadrao">
         <div className="h-full lg:h-[80vh]">
            <div
               className="h-[30vh] overflow-hidden relative z-10
                           md:h-[35vh]
                           lg:h-full"
            >
               <Image
                  src="/image-paginaprincipal.png"
                  alt="Imagem da pagina principal"
                  fill
                  quality={100}
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  className="object-cover"
               />
            </div>
            <div
               className="w-full mt-[-9vh] relative z-20
                           lg:mt-[-50vh]"
            >
               <div className="flex justify-center">
                  <Suspense fallback={<div>Carregando filtros...</div>}>
                     <CompontentePrincipalFiltro />
                  </Suspense>
               </div>
            </div>
         </div>
         <section className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="destaque" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveisDestaque.imoveis.map((imovel, index) => (
                  <CardImovel key={index} imovel={imovel} />
               ))}
            </div>
         </section>
         <section className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text="Imóveis em" boldText="condições especias" />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveisCondicoesEspeciais.imoveis.map((imovel, index) => (
                  imovel.permitirDestaque = false,
                  <CardImovel key={index} imovel={imovel} />
               ))}
            </div>
         </section>
         <section className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade
               text="Imóveis "
               boldText="recentemente adicionados"
            />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveisRecentes.imoveis.map((imovel, index) => (
                  imovel.permitirDestaque = false,
                  <CardImovel key={index} imovel={imovel} />
               ))}
            </div>
         </section>
      </Layout>
   );
}
