import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FiltrosImoveis from "./FiltrosImoveis";
import ImoveisView from "./ImoveisView";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import FiltroList from "@/components/componetes_filtro/FiltroList";
import { opcoesSort } from "@/data/opcoesSort";
import ModalComparacaoImoveis from "@/components/pop-up/ModalComparacaoImoveis";
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
      imovelDescTitulo?: string;
      view?: string;
      sort?: string;
      numeroPaginaAtual?: string;
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
      sort: parametrosResolvidos.sort ?? "",
      imovelDescTitulo: parametrosResolvidos.imovelDescTitulo ?? "",
      numeroPaginaAtual: parametrosResolvidos.numeroPaginaAtual ?? "0",
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
         sort: parametrosBusca.sort,
         imovelDescTitulo: parametrosBusca.imovelDescTitulo,
         paginaAtual: parametrosBusca.numeroPaginaAtual,
         size: view === "cards" ? "9" : "400",
         revalidate: 30,
      });

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Imóveis Disponíveis">
               <FiltrosImoveis 
               view={view} 
               bairro={parametrosBusca.bairro}
               finalidade={parametrosBusca.finalidade}
               cidade={parametrosBusca.cidade}
               precoMaximo={parametrosBusca.precoMaximo}
               precoMinimo={parametrosBusca.precoMinimo}
               quantidadeDeQuartos={parametrosBusca.quantidadeDeQuartos}
               quantidadeDeVagas={parametrosBusca.quantidadeDeVagas}
               metrosQuadradosMaximo={parametrosBusca.metrosQuadradosMaximo}
               metrosQuadradosMinimo={parametrosBusca.metrosQuadradosMinimo}
               tipoImovel={parametrosBusca.tipoImovel}
               imovelDescTitulo={parametrosBusca.imovelDescTitulo}
               />
               <div className="flex flex-col sm:flex-row justify-between items-center lg:my-4">
                  <p className="text-sm">
                     {quantidadeElementos} imóveis encontrados
                  </p>
                  {view === "cards" && (
                     <FiltroList
                        opcoes={opcoesSort}
                        value={parametrosBusca.sort}
                        url={"/imoveis"}
                        nome="sort"
                        buttonHolder="Ordenar por"
                     defaultValue="Nenhum"
                  />
                  )}
               </div>
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
