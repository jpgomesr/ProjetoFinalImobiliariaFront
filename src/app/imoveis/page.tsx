"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import FiltroList from "@/components/componetes_filtro/FiltroList";
import ListagemImovelPadrao from "@/components/listagem_imoveis/ListagemImovelPadrao";
import InputPadrao from "@/components/InputPadrao";
import ButtonMapa from "@/components/ButtonMapa";
import { Suspense } from "react";
import { getCoordinatesFromAddress, Coordinates } from "@/app/actions/geoCoding";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import dynamic from "next/dynamic";

// Importação dinâmica do MapboxMap2
const MapboxMap2 = dynamic(() => import("@/components/MapboxMap2"), {
   loading: () => (
      <div className="w-full h-[350px] flex items-center justify-center bg-gray-100 rounded-lg">
         <p className="text-havprincipal">Carregando mapa...</p>
      </div>
   ),
});

interface ImovelComCoordenadas extends ModelImovelGet {
   coordenadas?: Coordinates;
}

const Page = () => {
   const searchParams = useSearchParams();
   const [imoveis, setImoveis] = useState<ImovelComCoordenadas[]>([]);
   const [pageableInfo, setPageableInfo] = useState({ totalPaginas: 0, ultima: false });
   const [quantidadeElementos, setQuantidadeElementos] = useState(0);
   const [mapaCarregado, setMapaCarregado] = useState(false);

   const params = {
      precoMinimo: searchParams.get("precoMinimo") ?? "0",
      precoMaximo: searchParams.get("precoMaximo") ?? "0",
      metrosQuadradosMinimo: searchParams.get("metrosQuadradosMinimo") ?? "0",
      metrosQuadradosMaximo: searchParams.get("metrosQuadradosMaximo") ?? "0",
      quantidadeDeQuartos: searchParams.get("quantidadeDeQuartos") ?? "0",
      quantidadeDeVagas: searchParams.get("quantidadeDeVagas") ?? "0",
      cidade: searchParams.get("cidade") ?? "",
      bairro: searchParams.get("bairro") ?? "",
      tipoImovel: searchParams.get("tipoImovel") ?? "",
      finalidade: searchParams.get("finalidade") ?? "",
      view: searchParams.get("view") ?? "cards",
   };

   useEffect(() => {
      let mounted = true;

      const fetchData = async () => {
         try {
            const result = await buscarTodosImoveis({
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

            if (!mounted) return;

            if (result.imoveis.length > 0 && params.view === "map") {
               const imoveisComCoordenadas = await Promise.all(
                  result.imoveis.map(async (imovel) => {
                     try {
                        const coords = await getCoordinatesFromAddress({
                           rua: imovel.endereco?.rua || "",
                           numeroCasaPredio: String(imovel.endereco?.numeroCasaPredio || ""),
                           bairro: imovel.endereco?.bairro || "",
                           cidade: imovel.endereco?.cidade || "",
                           estado: imovel.endereco?.estado || "",
                           cep: String(imovel.endereco?.cep || ""),
                           latitude: 0,
                           longitude: 0
                        });
                        return { ...imovel, coordenadas: coords };
                     } catch (error) {
                        console.error('Erro ao obter coordenadas para imóvel:', error);
                        return imovel;
                     }
                  })
               );
               if (mounted) {
                  setImoveis(imoveisComCoordenadas);
               }
            } else {
               if (mounted) {
                  setImoveis(result.imoveis);
               }
            }
            
            if (mounted) {
               setPageableInfo(result.pageableInfo);
               setQuantidadeElementos(result.quantidadeElementos);
               setMapaCarregado(true);
            }
         } catch (error) {
            console.error('Erro ao buscar imóveis:', error);
         }
      };

      fetchData();

      return () => {
         mounted = false;
      };
   }, [searchParams, params.view]);

   const calcularCentroMapa = () => {
      const imoveisComCoordenadas = imoveis.filter(imovel => imovel.coordenadas);
      if (imoveisComCoordenadas.length === 0) return null;

      const somaLat = imoveisComCoordenadas.reduce((sum, imovel) => sum + (imovel.coordenadas?.latitude || 0), 0);
      const somaLng = imoveisComCoordenadas.reduce((sum, imovel) => sum + (imovel.coordenadas?.longitude || 0), 0);

      return {
         latitude: somaLat / imoveisComCoordenadas.length,
         longitude: somaLng / imoveisComCoordenadas.length
      };
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Imóveis Disponíveis">
               <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_7fr_1fr] xl:grid-cols-[1fr_6fr_1fr]">
                  <FiltroList
                     opcoes={[
                        { id: "venda", label: "Venda" },
                        { id: "aluguel", label: "Aluguel" },
                        { id: "todos", label: "Todos" },
                     ]}
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

                  <div className="w-36 min-h-full place-self-end md:place-self-auto">
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
                  <div className="flex justify-center gap-4 mt-4 col-span-full">
                     <ButtonMapa
                        texto="Cards"
                        href={`/imoveis?view=cards`}
                        className={`w-32 h-10 ${
                           params.view === "cards"
                              ? "bg-havprincipal text-white"
                              : "bg-havprincipal/50 text-white"
                        }`}
                     />
                     <ButtonMapa
                        texto="Mapa"
                        href={`/imoveis?view=map`}
                        className={`w-32 h-10  ${
                           params.view === "map"
                              ? "bg-havprincipal text-white"
                              : "bg-havprincipal/50 text-white"
                        }`}
                     />
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row">
                  <p className="text-sm">
                     {quantidadeElementos} imóveis encontrados
                  </p>
               </div>

               {params.view === "cards" && (
                  <Suspense fallback={<div>Carregando...</div>}>
                     <ListagemImovelPadrao
                        imoveis={imoveis}
                        pageableInfo={pageableInfo}
                     />
                  </Suspense>
               )}
               {params.view === "map" && mapaCarregado && imoveis.length > 0 && (
                  <div className="mt-4">
                     <Suspense fallback={
                        <div className="w-full h-[350px] flex items-center justify-center bg-gray-100 rounded-lg">
                           <p className="text-havprincipal">Carregando mapa...</p>
                        </div>
                     }>
                        <MapboxMap2
                           imoveis={imoveis}
                           centroMapa={calcularCentroMapa()}
                        />
                     </Suspense>
                  </div>
               )}
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
