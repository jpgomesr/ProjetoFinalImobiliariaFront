import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import ListarImoveis from "./ListarImoveis";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import FiltroList from "@/components/componetes_filtro/FiltroList";
import { opcoesSort } from "@/data/opcoesSort";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
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
      sort?: string;
      ativo?: string;
   }>;
}

const Page = async ({ searchParams }: PageProps) => {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (
      session.user?.role !== Roles.ADMINISTRADOR &&
      session.user?.role !== Roles.EDITOR
   ) {
      redirect("/");
   }

   const parametrosResolvidos = await searchParams;

   const params = {
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
      ativo: parametrosResolvidos.ativo ?? "",
   };

   const { imoveis, pageableInfo, quantidadeElementos } =
      await buscarTodosImoveis({
         precoMinimo: params.precoMinimo,
         precoMaximo: params.precoMaximo,
         tamanhoMin: params.metrosQuadradosMinimo,
         tamanhoMax: params.metrosQuadradosMaximo,
         qtdQuartos: params.quantidadeDeQuartos,
         qtdGaragens: params.quantidadeDeVagas,
         cidade: params.cidade,
         bairro: params.bairro,
         tipoResidencia: params.tipoImovel,
         finalidade: params.finalidade,
         sort: params.sort,
         ativo: params.ativo === "" ? undefined : params.ativo,
         cache: "no-store",
         buscarIndependenteAtivo:
            params.ativo === "" ||
            params.ativo === undefined ||
            params.ativo === null,
      });

   console.log(params.ativo === "" ||
      params.ativo === undefined ||
      params.ativo === null,);

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               className="w-full"
               titulo="Gerenciador de imóveis"
            >
               <div className="flex flex-col w-full gap-2 items-left md:flex-row h-full">
                  <FiltroList
                     opcoes={[
                        { id: "venda", label: "Venda" },
                        { id: "aluguel", label: "Aluguel" },
                        { id: "", label: "Todos" },
                     ]}
                     nome="finalidade"
                     url="/gerenciamento/imoveis"
                     defaultPlaceholder="Todas"
                     value={params.finalidade}
                  />

                  <div
                     className="flex flex-row items-center px-2 py-1 gap-2 rounded-md border-2 border-gray-300 
                              bg-white w-full min-w-1"
                  >
                     <input
                        type="text"
                        className="focus:outline-none min-w-1 w-full bg-white placeholder:text-gray-500"
                        placeholder="Pesquise aqui"
                     />
                  </div>
                  <div className="flex flex-row-reverse md:flex-row justify-between gap-2">
                     <div className="w-36">
                        <ButtonFiltro
                           precoMinimo={params.precoMinimo}
                           precoMaximo={params.precoMaximo}
                           metrosQuadradosMinimo={params.metrosQuadradosMinimo}
                           metrosQuadradosMaximo={params.metrosQuadradosMaximo}
                           quantidadeDeQuartos={params.quantidadeDeQuartos}
                           quantidadeDeVagas={params.quantidadeDeVagas}
                           cidade={params.cidade}
                           bairro={params.bairro}
                           tipoImovel={params.tipoImovel}
                           finalidade={params.finalidade}
                           url={"/gerenciamento/imoveis"}
                        />
                     </div>
                     <Link href={"/gerenciamento/imoveis/cadastro"}>
                        <button
                           className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full
                           text-sm py-1 px-2
                           lg:text-base lg:py-2 lg:px-3
                           2xl:py-3 2xl:px-4"
                        >
                           Adicionar <PlusIcon className="w-4" />
                        </button>
                     </Link>
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row sm:justify-between lg:my-4">
                  <FiltroList
                     opcoes={opcoesSort}
                     value={params.sort}
                     url={"/gerenciamento/imoveis"}
                     nome="sort"
                     buttonHolder="Ordenar por"
                     defaultValue="Nenhum"
                  />
                  <p className="text-sm my-2">
                     {quantidadeElementos} imóveis encontrados
                  </p>
                  <FiltroList
                     opcoes={[
                        { id: "true", label: "Ativo" },
                        { id: "false", label: "Inativo" },
                     ]}
                     nome="ativo"
                     url="/gerenciamento/imoveis"
                     defaultPlaceholder="Todos"
                     value={params.ativo}
                     buttonHolder="Status"
                  />
               </div>

               <ListarImoveis imoveis={imoveis} pageableInfo={pageableInfo} />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
