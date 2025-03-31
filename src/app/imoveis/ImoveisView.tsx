"use client";

import { useEffect, useState } from "react";
import {
   getCoordinatesFromAddress,
   Coordinates,
} from "@/app/actions/geoCoding";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import dynamic from "next/dynamic";
import ListagemImovelPadrao from "@/components/listagem_imoveis/ListagemImovelPadrao";
import { Suspense } from "react";

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

interface ImoveisViewProps {
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
   };
   quantidadeElementos: number;
   view?: string;
}

const ImoveisView = ({
   imoveis: imoveisIniciais,
   pageableInfo,
   quantidadeElementos,
   view = "cards",
}: ImoveisViewProps) => {
   const [imoveis, setImoveis] =
      useState<ImovelComCoordenadas[]>(imoveisIniciais);
   const [mapaCarregado, setMapaCarregado] = useState(false);

   useEffect(() => {
      let mounted = true;

      const processarImoveis = async () => {
         try {
            if (imoveisIniciais.length > 0 && view === "map") {
               const imoveisComCoordenadas = await Promise.all(
                  imoveisIniciais.map(async (imovel) => {
                     try {
                        const coords = await getCoordinatesFromAddress({
                           rua: imovel.endereco?.rua || "",
                           numeroCasaPredio: String(
                              imovel.endereco?.numeroCasaPredio || ""
                           ),
                           bairro: imovel.endereco?.bairro || "",
                           cidade: imovel.endereco?.cidade || "",
                           estado: imovel.endereco?.estado || "",
                           cep: String(imovel.endereco?.cep || ""),
                           latitude: 0,
                           longitude: 0,
                        });
                        return { ...imovel, coordenadas: coords };
                     } catch (error) {
                        console.error(
                           "Erro ao obter coordenadas para imóvel:",
                           error
                        );
                        return imovel;
                     }
                  })
               );
               if (mounted) {
                  setImoveis(imoveisComCoordenadas);
               }
            } else {
               if (mounted) {
                  setImoveis(imoveisIniciais);
               }
            }

            if (mounted) {
               setMapaCarregado(true);
            }
         } catch (error) {
            console.error("Erro ao processar imóveis:", error);
         }
      };

      processarImoveis();

      return () => {
         mounted = false;
      };
   }, [imoveisIniciais, view]);

   const calcularCentroMapa = () => {
      const imoveisComCoordenadas = imoveis.filter(
         (imovel) => imovel.coordenadas
      );
      if (imoveisComCoordenadas.length === 0) return null;

      const somaLat = imoveisComCoordenadas.reduce(
         (sum, imovel) => sum + (imovel.coordenadas?.latitude || 0),
         0
      );
      const somaLng = imoveisComCoordenadas.reduce(
         (sum, imovel) => sum + (imovel.coordenadas?.longitude || 0),
         0
      );

      return {
         latitude: somaLat / imoveisComCoordenadas.length,
         longitude: somaLng / imoveisComCoordenadas.length,
      };
   };

   return (
      <>
         

         {view === "cards" && (
            <Suspense fallback={<div>Carregando...</div>}>
               <ListagemImovelPadrao
                  imoveis={imoveis}
                  pageableInfo={pageableInfo}
               />
            </Suspense>
         )}
         {view === "map" && mapaCarregado && imoveis.length > 0 && (
            <div className="mt-4">
               <Suspense
                  fallback={
                     <div className="w-full h-[350px] flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-havprincipal">Carregando mapa...</p>
                     </div>
                  }
               >
                  <MapboxMap2
                     imoveis={imoveis}
                     centroMapa={calcularCentroMapa()}
                  />
               </Suspense>
            </div>
         )}
      </>
   );
};

export default ImoveisView;
