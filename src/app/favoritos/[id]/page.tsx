import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FiltrosImoveis from "@/app/imoveis/FiltrosImoveis";
import ImoveisView from "@/app/imoveis/ImoveisView";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import { opcoesSort } from "@/data/opcoesSort";
import FiltroList from "@/components/componetes_filtro/FiltroList";

interface PageProps {
   params: Promise<{ id: string }>;
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
      sort?: string;
   }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
   const parametrosResolvidos = await searchParams;
   const { id } = await params;
   const session = await getServerSession(authOptions);
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
         idUsuario: session?.user?.id,
         sort: parametrosBusca.sort,
         size: view === "cards" ? "9" : "400",
      });


   if (!session) {      
      redirect("/login");
   }
   if (session?.user.id != id) {
      redirect("/");
   }

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Imóveis Favoritos">
               <FiltrosImoveis url={`/favoritos/${id}`} 
                bairro={parametrosBusca.bairro}
                cidade={parametrosBusca.cidade}
                precoMaximo={parametrosBusca.precoMaximo}
                precoMinimo={parametrosBusca.precoMinimo}
                quantidadeDeQuartos={parametrosBusca.quantidadeDeQuartos}
                quantidadeDeVagas={parametrosBusca.quantidadeDeVagas}
                metrosQuadradosMaximo={parametrosBusca.metrosQuadradosMaximo}
                metrosQuadradosMinimo={parametrosBusca.metrosQuadradosMinimo}
                tipoImovel={parametrosBusca.tipoImovel}
                view={view}
               />
               <div className="flex flex-col sm:flex-row justify-between items-center lg:my-4">
                  <p className="text-sm">
                     {quantidadeElementos} imóveis encontrados
                  </p>
                  {view === "cards" && (
                     <FiltroList
                        opcoes={opcoesSort}
                        value={parametrosBusca.sort}
                        url={`/favoritos/${id}`}
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
