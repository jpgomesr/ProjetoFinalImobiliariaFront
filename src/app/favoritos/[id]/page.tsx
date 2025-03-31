import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FiltrosImoveis from "@/app/imoveis/FiltrosImoveis";
import ImoveisView from "@/app/imoveis/ImoveisView";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";

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
