"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import CardImovel from "@/components/card/CardImovel";

interface ImovelComCoordenadas extends ModelImovelGet {
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
}

interface MapboxMap2Props {
  imoveis: ImovelComCoordenadas[];
  centroMapa: {
    latitude: number;
    longitude: number;
  } | null;
}

const MapboxMap2: React.FC<MapboxMap2Props> = ({ imoveis, centroMapa }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedImovel, setSelectedImovel] = useState<ImovelComCoordenadas | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = useCallback((imovel: ImovelComCoordenadas) => {
    setSelectedImovel(imovel);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedImovel(null);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !centroMapa) return;

    mapboxgl.accessToken = "pk.eyJ1Ijoiam9hb3NjaGVpZDExMTIiLCJhIjoiY204ZGdxbGRwMHAycjJsb3dvY2NxdjZybSJ9.LBq6pnASGALoZor7X3zcbQ";

    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [centroMapa.longitude, centroMapa.latitude],
      zoom: 13,
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [centroMapa]);

  useEffect(() => {
    if (!map.current) return;

    // Limpar marcadores existentes
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Criar novos marcadores
    imoveis.forEach((imovel) => {
      if (imovel.coordenadas) {
        const marker = new mapboxgl.Marker({
          color: "#8B0000",
        })
          .setLngLat([imovel.coordenadas.longitude, imovel.coordenadas.latitude])
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => handleMarkerClick(imovel));
        markers.current.push(marker);
      }
    });
  }, [imoveis, handleMarkerClick]);

  return (
     <div className="relative w-full">
        <div
           ref={mapContainer}
           className="w-full h-[350px] rounded-lg shadow-lg"
        />
        {selectedImovel && (
           <div
              ref={popupRef}
              className="absolute max-w-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6] bg-white rounded-lg shadow-lg z-10"
           >
              <button
                 className="absolute right-0 top-0 bg-black/50 text-white border-none px-2 py-1 rounded cursor-pointer z-[11]"
                 onClick={handleClosePopup}
              >
                 ×
              </button>
              <div className="[&>*]:text-[#8B0000] [&_svg]:fill-[#8B0000] [&_.bg-havprincipal]:text-white [&_.bg-havprincipal_*]:text-white [&_a]:text-[#8B0000] [&_a_span]:text-[#8B0000]">
                 <CardImovel imovel={selectedImovel} width="w-full" />
              </div>
           </div>
        )}
     </div>
  );
};

export default MapboxMap2;