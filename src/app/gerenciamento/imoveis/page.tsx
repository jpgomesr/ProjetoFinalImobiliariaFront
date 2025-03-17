import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import List from "@/components/List";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import ListarImoveis from "./ListarImoveis";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import { TipoImovelEnum } from "@/models/Enum/TipoImovelEnum";
import FiltroList from "./FiltroList";

interface PageProps {
   searchParams: {
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
   };
}

const Page = async ({ searchParams }: PageProps) => {
   const params = await Promise.resolve({
      precoMinimo: searchParams?.precoMinimo ?? "0",
      precoMaximo: searchParams?.precoMaximo ?? "0",
      metrosQuadradosMinimo: searchParams?.metrosQuadradosMinimo ?? "0",
      metrosQuadradosMaximo: searchParams?.metrosQuadradosMaximo ?? "0",
      quantidadeDeQuartos: searchParams?.quantidadeDeQuartos ?? "0",
      quantidadeDeVagas: searchParams?.quantidadeDeVagas ?? "0",
      cidade: searchParams?.cidade ?? "",
      bairro: searchParams?.bairro ?? "",
      tipoImovel: searchParams?.tipoImovel ?? "",
      finalidade: searchParams?.finalidade ?? "",
   });

   const { imoveis, pageableInfo, quantidadeElementos } = await buscarTodosImoveis({
      precoMinimo: params.precoMinimo,
      precoMaximo: params.precoMaximo,
      tamanhoMin: params.metrosQuadradosMinimo,
      tamanhoMax: params.metrosQuadradosMaximo,
      qtdQuartos: params.quantidadeDeQuartos,
      qtdGaragens: params.quantidadeDeVagas,
      cidade: params.cidade,
      bairro: params.bairro,
      tipoResidencia: params.tipoImovel,
      finalidade: params.finalidade
      
   });

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               className="w-full"
               titulo="Gerenciador de imóveis"
            >
               <div className="flex flex-col w-full gap-2 items-left md:flex-row h-full">
                     <FiltroList
                        finalidade={params.finalidade}
                        precoMinimo={params.precoMinimo}
                        precoMaximo={params.precoMaximo}
                        metrosQuadradosMinimo={params.metrosQuadradosMinimo}
                        metrosQuadradosMaximo={params.metrosQuadradosMaximo}
                        quantidadeDeQuartos={params.quantidadeDeQuartos}
                        quantidadeDeVagas={params.quantidadeDeVagas}
                        cidade={params.cidade}
                        bairro={params.bairro}
                        tipoImovel={params.tipoImovel}
                     />
                  
                  <div
                     className="flex flex-row items-center px-2 py-1 gap-2 rounded-md border-2 border-gray-300 
                              bg-white w-full min-h-full min-w-1"
                  >
                     <input
                        type="text"
                        className="focus:outline-none min-w-1 bg-white placeholder:text-gray-500"
                        placeholder="Pesquise aqui"
                     />
                  </div>
                  <div className="flex flex-row-reverse md:flex-row justify-between gap-2 min-h-full">
                     <div className="w-36 min-h-full">
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
               <div className="flex flex-col sm:flex-row">
                  <p className="text-sm">
                     {quantidadeElementos} imóveis encontrados
                  </p>
               </div>

               <ListarImoveis imoveis={imoveis} pageableInfo={pageableInfo} />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
