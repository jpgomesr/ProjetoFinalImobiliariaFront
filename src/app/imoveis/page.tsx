import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FiltrosImoveis from "./FiltrosImoveis";
import ImoveisView from "./ImoveisView";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";

interface PageProps {
   searchParams: Promise<{
      precoMinimo?: string;
      precoMaximo?: string;
      metrosQuadradosMinimo?: string;
      metrosQuadradosMaximo?: string;
      quantidadeDeQuartos?: string;
      quantidadeDeVagas?: string;
      cidade?: string;
      bairro?: string;
      tipoImovel?: string;
      finalidade?: string;
      view?: string;
   }>;
}

const Page = async ({ searchParams }: PageProps) => {
   const session = await getServerSession(authOptions);
   const parametrosResolvidos = await searchParams;
   const parametrosBusca = {
      precoMinimo: parametrosResolvidos.precoMinimo ?? "0",
      precoMaximo: parametrosResolvidos.precoMaximo ?? "0",
      metrosQuadradosMinimo: parametrosResolvidos.metrosQuadradosMinimo ?? "0",
      metrosQuadradosMaximo: parametrosResolvidos.metrosQuadradosMaximo ?? "0",
      quantidadeDeQuartos: parametrosResolvidos.quantidadeDeQuartos ?? "0",
      quantidadeDeVagas: parametrosResolvidos.quantidadeDeVagas ?? "0",
      cidade: parametrosResolvidos.cidade ?? "",
      bairro: parametrosResolvidos.bairro ?? "",
      tipoImovel: parametrosResolvidos.tipoImovel ?? "",
      finalidade: parametrosResolvidos.finalidade ?? "",
   };
   const view = parametrosResolvidos.view ?? "cards";

   const { imoveis, pageableInfo, quantidadeElementos } =
      await buscarTodosImoveis({
         precoMinimo: parametrosBusca.precoMinimo,
         precoMaximo: parametrosBusca.precoMaximo,
         tamanhoMin: parametrosBusca.metrosQuadradosMinimo,
         tamanhoMax: parametrosBusca.metrosQuadradosMaximo,
         qtdQuartos: parametrosBusca.quantidadeDeQuartos,
         qtdGaragens: parametrosBusca.quantidadeDeVagas,
         cidade: parametrosBusca.cidade,
         bairro: parametrosBusca.bairro,
         tipoResidencia: parametrosBusca.tipoImovel,
         finalidade: parametrosBusca.finalidade,
         revalidate: 30,
      });
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Imóveis Disponíveis">
               <FiltrosImoveis />
               <ImoveisView
                  imoveis={imoveis}
                  pageableInfo={pageableInfo}
                  quantidadeElementos={quantidadeElementos}
                  view={view}
               />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
