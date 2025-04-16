"use client";

import React, {
   useEffect,
   useRef,
   useState,
   useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import { createRoot } from "react-dom/client";
import dynamic from "next/dynamic";

interface ImovelComCoordenadas extends ModelImovelGet {
   coordenadas?: {
      latitude: number;
      longitude: number;
   };
   valor: number;
}

interface MapboxMap2Props {
   imoveis: ImovelComCoordenadas[];
   centroMapa: {
      latitude: number;
      longitude: number;
   } | null;
}

// Carregamento dinâmico do CardImovel para evitar problemas com o app router
const CardImovel = dynamic(() => import("./card/CardImovel"), { ssr: false });

const MapboxPopupContent = ({ imovel }: { imovel: ImovelComCoordenadas }) => {
   return <CardImovel imovel={imovel} />;
};

const MapboxMap2: React.FC<MapboxMap2Props> = ({ imoveis, centroMapa }) => {
   const mapContainer = useRef<HTMLDivElement>(null);
   const map = useRef<mapboxgl.Map | null>(null);
   const markers = useRef<mapboxgl.Marker[]>([]);
   const [selectedImovel, setSelectedImovel] =
      useState<ImovelComCoordenadas | null>(null);
   const popupRef = useRef<mapboxgl.Popup | null>(null);
   const rootRef = useRef<any>(null);

   // Função simplificada para mostrar o popup quando um marcador é clicado
   const handleMarkerClick = useCallback((imovel: ImovelComCoordenadas) => {
      setSelectedImovel(imovel);

      if (!map.current || !imovel.coordenadas) return;

      // Limpar popup anterior se existir
      if (popupRef.current) {
         if (rootRef.current) {
            rootRef.current.unmount();
            rootRef.current = null;
         }
         popupRef.current.remove();
         popupRef.current = null;
      }

      // Criar o elemento do popup
      const popupEl = document.createElement("div");
      popupEl.className = "mapboxgl-popup-content-wrapper";

      // Criar o popup e posicioná-lo acima do marcador
      popupRef.current = new mapboxgl.Popup({
         closeButton: true,
         closeOnClick: false,
         maxWidth: "350px", // Aumentado para dar mais espaço ao conteúdo
         offset: 25, // Isso faz o popup aparecer acima do marcador
         className: "custom-popup", // Classe personalizada para estilização adicional
      })
         .setLngLat([imovel.coordenadas.longitude, imovel.coordenadas.latitude])
         .setDOMContent(popupEl)
         .addTo(map.current);

      // Renderizar o componente React dentro do popup
      try {
         rootRef.current = createRoot(popupEl);
         rootRef.current.render(
            <div className="bg-white rounded-lg shadow-xl p-2 w-full">
               <MapboxPopupContent imovel={imovel} />
            </div>
         );
      } catch (error) {
         console.error("Erro ao renderizar o popup:", error);
      }

      // Limpar quando o popup for fechado
      popupRef.current.on("close", () => {
         setSelectedImovel(null);
         if (rootRef.current) {
            try {
               rootRef.current.unmount();
            } catch (error) {
               console.error("Erro ao desmontar o popup:", error);
            }
            rootRef.current = null;
         }
         popupRef.current = null;
      });
   }, []);

   useEffect(() => {
      if (!mapContainer.current || !centroMapa) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

      if (map.current) return;

      map.current = new mapboxgl.Map({
         container: mapContainer.current,
         style: "mapbox://styles/mapbox/streets-v12",
         center: [centroMapa.longitude, centroMapa.latitude],
         zoom: 13,
      });

      // Adicionar controles de navegação
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      return () => {
         // Limpar marcadores ao desmontar
         markers.current.forEach((marker) => marker.remove());
         markers.current = [];

         // Limpar popup se existir
         if (popupRef.current) {
            if (rootRef.current) {
               rootRef.current.unmount();
               rootRef.current = null;
            }
            popupRef.current.remove();
            popupRef.current = null;
         }

         // Remover o mapa
         if (map.current) {
            map.current.remove();
            map.current = null;
         }
      };
   }, [centroMapa]);

   useEffect(() => {
      if (!map.current) return;

      // Limpar marcadores existentes
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Criar novos marcadores
      imoveis.forEach((imovel) => {
         if (imovel.coordenadas) {
            const marker = new mapboxgl.Marker({
               color: "#8B0000",
            })
               .setLngLat([
                  imovel.coordenadas.longitude,
                  imovel.coordenadas.latitude,
               ])
               .addTo(map.current!);

            marker
               .getElement()
               .addEventListener("click", () => handleMarkerClick(imovel));
            markers.current.push(marker);
         }
      });
   }, [imoveis, handleMarkerClick]);

   return (
      <div className="relative w-full">
         <div
            ref={mapContainer}
            className="w-full h-[500px] rounded-lg shadow-lg"
         />
         <style jsx global>{`
            .custom-popup .mapboxgl-popup-content {
               padding: 0;
               overflow: visible;
               min-width: 250px;
            }
            .mapboxgl-popup-content-wrapper {
               width: 100%;
               height: 100%;
            }
         `}</style>
      </div>
   );
};

export default MapboxMap2;
