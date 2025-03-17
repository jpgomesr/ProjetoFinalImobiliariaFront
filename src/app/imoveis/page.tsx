import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import FiltroList from "@/components/componetes_filtro/FiltroList";
import ListagemImovelPadrao from "@/components/listagem_imoveis/ListagemImovelPadrao";
import InputPadrao from "@/components/InputPadrao";

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
   }>;
}

const Page = async ({ searchParams }: PageProps) => {
   const params = {
      precoMinimo: (await searchParams).precoMinimo ?? "0",
      precoMaximo: (await searchParams).precoMaximo ?? "0",
      metrosQuadradosMinimo: (await searchParams).metrosQuadradosMinimo ?? "0",
      metrosQuadradosMaximo: (await searchParams).metrosQuadradosMaximo ?? "0",
      quantidadeDeQuartos: (await searchParams).quantidadeDeQuartos ?? "0",
      quantidadeDeVagas: (await searchParams).quantidadeDeVagas ?? "0",
      cidade: (await searchParams).cidade ?? "",
      bairro: (await searchParams).bairro ?? "",
      tipoImovel: (await searchParams).tipoImovel ?? "",
      finalidade: (await searchParams).finalidade ?? "",
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
      });

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Imóveis Disponíveis">
               <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_7fr_1fr] xl:grid-cols-[1fr_6fr_1fr]">
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
                     url="/imoveis"
                     value={params.finalidade}
                  />

              
                     <InputPadrao
                        type="text"
                        placeholder="Pesquise aqui"
                        search={true}
                        className="w-full"

                     />
          
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
                        url={"/imoveis"}
                     />
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row">
                  <p className="text-sm">
                     {quantidadeElementos} imóveis encontrados
                  </p>
               </div>

               <ListagemImovelPadrao
                  imoveis={imoveis}
                  pageableInfo={pageableInfo}
               />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
