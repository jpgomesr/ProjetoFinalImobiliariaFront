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

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.6);
        background: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10;
      }
      .popup-close {
        position: absolute;
        right: 8px;
        top: 8px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        z-index: 11;
      }
      .popup-content * {
        color: #8B0000 !important;
      }
      .popup-content svg {
        fill: #8B0000 !important;
      }
      .popup-content .bg-havprincipal,
      .popup-content .bg-havprincipal * {
        color: white !important;
      }
      .popup-content a {
        color: #8B0000 !important;
      }
      .popup-content a span {
        color: #8B0000 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div ref={mapContainer} className="w-full h-[350px] rounded-lg shadow-lg" />
      {selectedImovel && (
        <div ref={popupRef} className="custom-popup">
          <button 
            className="popup-close"
            onClick={handleClosePopup}
          >
            ×
          </button>
          <div className="popup-content">
            <CardImovel imovel={selectedImovel} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap2; 