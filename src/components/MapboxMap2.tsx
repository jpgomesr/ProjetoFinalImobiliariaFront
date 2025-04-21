"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import { createRoot } from "react-dom/client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Car, Ruler, MapPin, X } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { NotificationProvider } from "@/context/NotificationContext";
import { useNotification } from "@/context/NotificationContext";
import { TipoBanner } from "@/models/Enum/TipoBanner";

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

// Componente Modal
interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   children: React.ReactNode;
   onConfirm?: () => void;
}

const Modal = ({ isOpen, onClose, title, children, onConfirm }: ModalProps) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
         <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex flex-col p-6">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-havprincipal">
                     {title}
                  </h3>
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="mb-6">{children}</div>

               <div className="flex justify-end gap-3">
                  <button
                     onClick={onClose}
                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     onClick={onConfirm}
                     className="px-4 py-2 text-sm font-medium text-white bg-havprincipal rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                     Remover
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

// Componente de Card reduzido para o popup do mapa
const MapCard = ({ imovel }: { imovel: ImovelComCoordenadas }) => {
   const [isFavorited, setIsFavorited] = useState(imovel.favoritado || false);
   const [showUnfavoriteModal, setShowUnfavoriteModal] = useState(false);
   const { showNotification } = useNotification();

   const valorFormatado = imovel.preco.toLocaleString("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   });

   const getImagemCapa = () => {
      if ("imagens" in imovel) {
         if (Array.isArray(imovel.imagens)) {
            const imagemCapa = imovel.imagens.find((img) => img.imagemCapa);
            return imagemCapa ? imagemCapa.referencia : "";
         } else if (
            imovel.imagens &&
            typeof imovel.imagens === "object" &&
            "imagemPrincipal" in imovel.imagens
         ) {
            const imagemObj = imovel.imagens as { imagemPrincipal: string };
            return typeof imagemObj.imagemPrincipal === "string"
               ? imagemObj.imagemPrincipal
               : "";
         }
      }
      return "";
   };

   const handleFavoriteClick = async () => {
      if (isFavorited) {
         setShowUnfavoriteModal(true);
      } else {
         await toggleFavorite();
      }
   };

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
   const session = useSession();
   const token = session.data?.accessToken;

   const toggleFavorite = async () => {
      try {
         const response = await fetch(
            `${BASE_URL}/usuarios/favoritos?idImovel=${imovel.id}`,
            {
               method: isFavorited ? "DELETE" : "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (response.ok) {
            setIsFavorited(!isFavorited);
            showNotification(
               isFavorited
                  ? "Imóvel removido dos favoritos"
                  : "Imóvel adicionado aos favoritos"
            );
         } else {
            throw new Error("Failed to update favorite");
         }
      } catch (error) {
         showNotification("Erro ao atualizar favoritos");
      } finally {
         setShowUnfavoriteModal(false);
      }
   };

   const imagemCapa = getImagemCapa();

   return (
      <>
         <div
            className={`w-full h-full z-50 absolute top-0 left-0 ${
               imovel.tipoBanner == TipoBanner.ADQUIRIDO ||
               imovel.tipoBanner == TipoBanner.ALUGADO
                  ? "bg-white bg-opacity-40 pointer-events-none"
                  : "hidden"
            }`}
         />
         <div
            className={`w-full min-w-[250px] max-w-[300px] rounded-lg bg-white shadow-md overflow-visible relative`}
         >
            <div className="relative h-36 w-full">
               {imovel.destaque && (
                  <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold py-1 px-2 z-10">
                     Destaque
                  </div>
               )}
               {imovel.banner && (
                  <div className="absolute w-full text-center top-6 right-0 bg-havprincipal text-white text-xs font-bold py-1 px-2 z-10">
                     {imovel.tipoBanner}
                  </div>
               )}
               <Image
                  src={imagemCapa || "/images/fallback.jpg"}
                  alt={imovel.titulo}
                  fill
                  className="object-cover rounded-t-lg"
               />
            </div>

            <div className="p-3">
               <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold line-clamp-1 text-havprincipal">
                     {imovel.titulo}
                  </h3>
                  <button
                     onClick={handleFavoriteClick}
                     className="text-havprincipal hover:text-red-500 transition-colors"
                  >
                     {isFavorited ? (
                        <Heart className="w-4 h-4 fill-current" />
                     ) : (
                        <Heart className="w-4 h-4" />
                     )}
                  </button>
               </div>

               <div className="mt-1 flex items-center text-xs text-havprincipal">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>
                     {imovel.endereco.bairro}, {imovel.endereco.cidade}
                  </span>
               </div>

               <div className="mt-1 flex items-center">
                  <span className="text-sm font-bold text-havprincipal">
                     R$ {valorFormatado}
                  </span>
               </div>

               <div className="mt-2 flex justify-between text-xs text-havprincipal">
                  <div className="flex items-center">
                     <Bed className="w-3 h-3 mr-1" />
                     <span>{imovel.qtdQuartos}</span>
                  </div>
                  <div className="flex items-center">
                     <Bath className="w-3 h-3 mr-1" />
                     <span>{imovel.qtdBanheiros}</span>
                  </div>
                  <div className="flex items-center">
                     <Car className="w-3 h-3 mr-1" />
                     <span>{imovel.qtdGaragens}</span>
                  </div>
                  <div className="flex items-center">
                     <Ruler className="w-3 h-3 mr-1" />
                     <span>{imovel.tamanho}m²</span>
                  </div>
               </div>

               <Link
                  href={`/imovel/${imovel.id}`}
                  className="mt-3 block w-full text-center text-xs bg-havprincipal text-white py-1.5 rounded hover:bg-opacity-90 transition"
               >
                  Ver detalhes
               </Link>
            </div>

            {/* Modal para confirmar desfavoritar */}
            <Modal
               isOpen={showUnfavoriteModal}
               onClose={() => setShowUnfavoriteModal(false)}
               title="Remover dos favoritos"
               onConfirm={toggleFavorite}
            >
               <p className="text-gray-600">
                  Tem certeza que deseja remover este imóvel dos seus favoritos?
               </p>
            </Modal>
         </div>
      </>
   );
};

const MapboxMap2: React.FC<MapboxMap2Props> = ({ imoveis, centroMapa }) => {
   const mapContainer = useRef<HTMLDivElement>(null);
   const map = useRef<mapboxgl.Map | null>(null);
   const markers = useRef<mapboxgl.Marker[]>([]);
   const [selectedImovel, setSelectedImovel] =
      useState<ImovelComCoordenadas | null>(null);
   const popupRef = useRef<mapboxgl.Popup | null>(null);
   const rootRef = useRef<any>(null);

   const handleMarkerClick = useCallback((imovel: ImovelComCoordenadas) => {
      setSelectedImovel(imovel);

      if (!map.current || !imovel.coordenadas) return;

      if (popupRef.current) {
         if (rootRef.current) {
            rootRef.current.unmount();
            rootRef.current = null;
         }
         popupRef.current.remove();
         popupRef.current = null;
      }

      const popupEl = document.createElement("div");
      popupEl.className = "w-full text-inherit";

      popupRef.current = new mapboxgl.Popup({
         closeButton: true,
         closeOnClick: false,
         maxWidth: "none",
         offset: 25,
         className: "custom-popup",
      })
         .setLngLat([imovel.coordenadas.longitude, imovel.coordenadas.latitude])
         .setDOMContent(popupEl)
         .addTo(map.current);

      try {
         rootRef.current = createRoot(popupEl);
         rootRef.current.render(
            <SessionProvider>
               <NotificationProvider>
                  <div className="w-full text-inherit">
                     <MapCard imovel={imovel} />
                  </div>
               </NotificationProvider>
            </SessionProvider>
         );
      } catch (error) {
         console.error("Erro ao renderizar o popup:", error);
      }

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

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      return () => {
         markers.current.forEach((marker) => marker.remove());
         markers.current = [];

         if (popupRef.current) {
            if (rootRef.current) {
               rootRef.current.unmount();
               rootRef.current = null;
            }
            popupRef.current.remove();
            popupRef.current = null;
         }

         if (map.current) {
            map.current.remove();
            map.current = null;
         }
      };
   }, [centroMapa]);

   useEffect(() => {
      if (!map.current) return;

      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      imoveis.forEach((imovel) => {
         if (imovel.coordenadas) {
            const marker = new mapboxgl.Marker({
               color: "#702632", // Cor havprincipal do tailwind
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
               padding: 0 !important;
               margin: 0 !important;
               background: transparent !important;
               box-shadow: none !important;
               border: none !important;
               width: auto !important;
               color: inherit !important;
            }
            .mapboxgl-popup-close-button {
               font-size: 24px;
               padding: 8px;
               z-index: 10;
               color: #702632 !important;
               background: transparent !important;
            }
            .mapboxgl-popup-tip {
               display: none !important;
            }
            .mapboxgl-popup {
               max-width: none !important;
            }
            .mapboxgl-popup-content-wrapper {
               padding: 0 !important;
               background: transparent !important;
               color: inherit !important;
            }
            .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
               display: none !important;
            }
            .mapboxgl-popup * {
               color: #702632 !important;
            }
            .mapboxgl-popup .text-gray-500,
            .mapboxgl-popup .text-gray-600 {
               color: #702632 !important;
            }
            .mapboxgl-popup .text-havprincipal {
               color: #702632 !important;
            }
            .mapboxgl-popup .text-white {
               color: white !important;
            }
         `}</style>
      </div>
   );
};

export default MapboxMap2;
