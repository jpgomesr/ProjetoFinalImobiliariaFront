import Layout from "../components/layout/LayoutPadrao";
import CompontentePrincipalFiltro from "@/components/componetes_filtro/pagina_inicial/CompontentePrincipalFiltro";
import Image from "next/image";
import { Suspense } from "react";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import HomePage from "@/components/HomePage";

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
      <Layout className="pt-0 py-8 bg-begeClaroPadrao">
         <div className="lg:h-[80vh]">
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
         <HomePage 
            imoveisDestaque={imoveisDestaque}
            imoveisCondicoesEspeciais={imoveisCondicoesEspeciais}
            imoveisRecentes={imoveisRecentes}
         />
      </Layout>
   );
}
