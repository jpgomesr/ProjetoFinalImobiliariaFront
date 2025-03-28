"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";
import { Utensils, GraduationCap, Building2, ShoppingCart, Pill, School, Ruler, BedDouble, Car, ShowerHead, WavesLadder } from 'lucide-react';
import { LocalProximo } from "@/app/actions/geoCoding";
import { MapboxService } from "@/services/MapboxService";

interface MapboxMapProps {
  endereco: EnderecoMapBox;
  onLocaisProximosLoad?: (locais: LocalProximo[]) => void;
  detalhesImovel: {
    tamanho: string;
    qtdQuartos: number;
    qtdGaragens: number;
    qtdBanheiros: number;
    qtdPiscina: number;
    qtdChurrasqueira: number;
  };
}

export const getIconForType = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case 'restaurante':
      return <Utensils className="w-5 h-5 text-begepadrao" />;
    case 'hospital':
      return <Building2 className="w-5 h-5 text-begepadrao" />;
    case 'escola':
    case 'educação':
      return <School className="w-5 h-5 text-begepadrao" />;
    case 'supermercado':
      return <ShoppingCart className="w-5 h-5 text-begepadrao" />;
    case 'farmácia':
      return <Pill className="w-5 h-5 text-begepadrao" />;
    default:
      return <GraduationCap className="w-5 h-5 text-begepadrao" />;
  }
};

const MapboxMap: React.FC<MapboxMapProps> = ({ endereco, onLocaisProximosLoad, detalhesImovel }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [locaisProximos, setLocaisProximos] = useState<LocalProximo[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const mapboxService = useRef<MapboxService | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError('');

        if (!mapContainer.current) {
          console.error('Container do mapa não encontrado');
          return;
        }

        // Inicializar o serviço do Mapbox
        if (!mapboxService.current) {
          mapboxService.current = new MapboxService();
        }

        // Inicializar o mapa e buscar locais próximos
        const locais = await mapboxService.current.initializeMap(mapContainer.current, endereco);
        setLocaisProximos(locais);
        if (onLocaisProximosLoad) {
          onLocaisProximosLoad(locais);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao inicializar o mapa:', err);
        setError('Erro ao carregar o mapa');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapboxService.current) {
        mapboxService.current.cleanup();
      }
    };
  }, [endereco, onLocaisProximosLoad]);

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        {/* Container dos detalhes e locais próximos - visível apenas em desktop */}
        <div className="hidden md:block md:mt-24">
          <div className="flex justify-around text-havprincipal mb-2">
            <h2 className="text-xl font-medium">Detalhes do imóvel</h2>
            <h2 className="text-xl font-medium">Nas proximidades do imóvel</h2>
          </div>
          <div className="flex bg-havprincipal">
            <div className="flex-1">
              <div className="grid grid-cols-3 grid-rows-2 h-full">
                <div className="flex justify-center items-center pl-2">
                  <Ruler className="w-7 h-7 text-begepadrao" />
                  <p className="text-begepadrao ml-0.5">{detalhesImovel.tamanho}m²</p>
                </div>
                <div className="flex justify-center items-center">
                  <BedDouble className="w-7 h-7 text-begepadrao" />
                  <p className="text-begepadrao ml-0.5">{detalhesImovel.qtdQuartos}</p>
                </div>
                <div className="flex justify-center items-center">
                  <Car className="w-7 h-7 text-begepadrao" />
                  <p className="text-begepadrao ml-0.5">{detalhesImovel.qtdGaragens}</p>
                </div>
                <div className="flex justify-center items-center pl-2">
                  <ShowerHead className="w-7 h-7 text-begepadrao" />
                  <p className="text-begepadrao ml-0.5">{detalhesImovel.qtdBanheiros}</p>
                </div>
                <div className="flex justify-center items-center">
                  <WavesLadder className="w-7 h-7 text-begepadrao" />
                  <p className="text-begepadrao ml-0.5">{detalhesImovel.qtdPiscina}</p>
                </div>
                <div className="flex justify-center items-center">
                  <ShowerHead className="w-7 h-7 text-begepadrao" />
                  <p className="text-begepadrao ml-0.5">{detalhesImovel.qtdChurrasqueira}</p>
                </div>
              </div>
            </div>

            <div className="w-px self-stretch bg-begepadrao/30 mx-4" />

            <div className="flex-1">
              {isLoading ? (
                <p className="text-begepadrao text-center py-4">Carregando locais próximos...</p>
              ) : error ? (
                <p className="text-red-500 text-center py-4">{error}</p>
              ) : locaisProximos.length === 0 ? (
                <p className="text-begepadrao text-center py-4">Nenhum local próximo encontrado</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-4">
                  {locaisProximos.map((local, index) => (
                    <div key={index} className="flex items-center gap-2 hover:bg-white/10 rounded p-2">
                      <span>{getIconForType(local.tipo)}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-begepadrao truncate">{local.tipo}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-begepadrao font-medium truncate">{local.nome}</span>
                          <span className="text-xs text-begepadrao whitespace-nowrap">- {local.distancia}m</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Container dos detalhes do imóvel - visível apenas em mobile */}
        <div className="md:hidden w-full bg-havprincipal mt-10">
          <h2 className="text-xl text-center mt-5 text-begepadrao">Detalhes do imóvel</h2>
          <div className="grid grid-cols-3 grid-rows-2 py-4">
            <div className="flex flex-col items-center">
              <Ruler className="w-7 h-7 text-begepadrao" />
              <p className="text-begepadrao mt-1">{detalhesImovel.tamanho}m²</p>
            </div>
            <div className="flex flex-col items-center">
              <BedDouble className="w-7 h-7 text-begepadrao" />
              <p className="text-begepadrao mt-1">{detalhesImovel.qtdQuartos}</p>
            </div>
            <div className="flex flex-col items-center">
              <Car className="w-7 h-7 text-begepadrao" />
              <p className="text-begepadrao mt-1">{detalhesImovel.qtdGaragens}</p>
            </div>
            <div className="flex flex-col items-center">
              <ShowerHead className="w-7 h-7 text-begepadrao" />
              <p className="text-begepadrao mt-1">{detalhesImovel.qtdBanheiros}</p>
            </div>
            <div className="flex flex-col items-center">
              <WavesLadder className="w-7 h-7 text-begepadrao" />
              <p className="text-begepadrao mt-1">{detalhesImovel.qtdPiscina}</p>
            </div>
            <div className="flex flex-col items-center">
              <ShowerHead className="w-7 h-7 text-begepadrao" />
              <p className="text-begepadrao mt-1">{detalhesImovel.qtdChurrasqueira}</p>
            </div>
          </div>
        </div>

        {/* Container do mapa */}
        <div ref={mapContainer} className="w-4/5 md:w-3/4 h-[300px] md:h-[350px] mt-10 mx-auto md:mt-8" />

        {/* Container dos locais próximos - visível apenas em mobile */}
        <div className="w-screen md:hidden bg-havprincipal h-[350px] overflow-y-auto">
          <h2 className="text-xl ml-6 mt-5 text-begepadrao">Locais Próximos</h2>
          {isLoading ? (
            <p className="px-4 text-begepadrao">Carregando locais próximos...</p>
          ) : error ? (
            <p className="px-4 text-red-500">{error}</p>
          ) : locaisProximos.length === 0 ? (
            <p className="px-4 text-begepadrao">Nenhum local próximo encontrado</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 px-4">
              {locaisProximos.map((local, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                  <span>{getIconForType(local.tipo)}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-begepadrao truncate">{local.tipo}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-begepadrao font-medium truncate">{local.nome}</span>
                      <span className="text-xs text-begepadrao whitespace-nowrap">- {local.distancia}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapboxMap;