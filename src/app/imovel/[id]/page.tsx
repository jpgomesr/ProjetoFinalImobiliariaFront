"use client";

import Layout from "@/components/layout/LayoutPadrao";
import {
   BedDouble,
   Car,
   Heart,
   Ruler,
   Share2,
   ShowerHead,
   WavesLadder,
   ChevronLeft,
   ChevronRight,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";
import CardImovel from "@/components/card/CardImovel";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
// Importação dinâmica do MapboxMap para evitar problemas de SSR
const MapboxMap = dynamic(() => import("@/components/Mapboxmap"), {
   ssr: false,
   loading: () => <p>Carregando mapa...</p>,
});

// Defina a interface para o tipo Imovel
interface Imovel {
   id: number;
   titulo: string;
   descricao: string;
   preco: number;
   precoPromocional?: number;
   iptu: string;
   condominio: string;
   tamanho: string;
   qtdBanheiros: number;
   qtdQuartos: number;
   qtdGaragens: number;
   qtdPiscina: number;
   qtdChurrasqueira: number;
   imagens: {
      id: number;
      imagemCapa: boolean;
      referencia: string;
   }[];
   endereco: EnderecoMapBox;
}

interface ImovelSemelhante {
   id: number;
   titulo: string;
   preco: number;
   precoPromocional?: number;
   qtdBanheiros: number;
   qtdQuartos: number;
   imagens: {
      id: number;
      imagemCapa: boolean;
      referencia: string;
   }[];
}

const Page = () => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const [showCopiedMessage, setShowCopiedMessage] = useState(false);
   const [isShared, setIsShared] = useState(false);

   if (!BASE_URL) {
      throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
   }

   const { id } = useParams(); // Obtém o ID do imóvel da URL
   const [imovel, setImovel] = useState<Imovel | null>(null); // Define o tipo do estado
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [imoveisSemelhantes, setImoveisSemelhantes] = useState<
      ImovelSemelhante[]
   >([]);

   // Imagem padrão
   const IMAGEM_PADRAO =
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg";

   // Função para buscar os dados do imóvel
   useEffect(() => {
      if (!id) return; // Verifica se o ID está disponível

      const fetchImovel = async () => {
         try {
            const response = await fetch(`${BASE_URL}/imoveis/${id}`);
            if (!response.ok) {
               throw new Error("Erro ao buscar os dados do imóvel");
            }
            const data = await response.json();
            setImovel(data);
         } catch (err) {
            if (err instanceof Error) {
               setError(err.message);
            } else {
               setError("Ocorreu um erro desconhecido");
            }
         } finally {
            setLoading(false);
         }
      };

      fetchImovel();
   }, [id]);

   const buscarImoveisSemelhantes = async () => {
      try {
         const response = await buscarTodosImoveis();
         console.log("Todos os imóveis:", response); // Debug todos os imóveis
         console.log("Imóvel atual:", imovel); // Debug imóvel atual

         // Garantir que response.imoveis é um array antes de usar filter
         const imoveis = Array.isArray(response.imoveis)
            ? response.imoveis
            : [];
         console.log("Imóveis para filtrar:", imoveis); // Debug array de imóveis

         if (!imovel) return; // Garantir que temos o imóvel atual

         const semelhantes = imoveis.filter(
            (imovelComparado: ImovelSemelhante) => {
               console.log("Comparando com:", imovelComparado); // Debug cada comparação

               // Validar se o imóvel comparado tem todos os campos necessários
               if (
                  !imovelComparado ||
                  typeof imovelComparado.preco !== "number" ||
                  !imovelComparado.qtdBanheiros ||
                  !imovelComparado.qtdQuartos
               ) {
                  console.log("Imóvel inválido:", imovelComparado);
                  return false;
               }

               if (imovelComparado.id === Number(id)) {
                  console.log("Mesmo imóvel, ignorando");
                  return false;
               }

               try {
                  const precoAtual = imovel.preco;
                  const precoComparado = imovelComparado.preco;
                  const diferencaPreco = Math.abs(precoAtual - precoComparado);

                  console.log("Preços:", {
                     atual: precoAtual,
                     comparado: precoComparado,
                     diferenca: diferencaPreco,
                  });

                  console.log("Comparações:", {
                     banheiros:
                        imovelComparado.qtdBanheiros === imovel.qtdBanheiros,
                     quartos: imovelComparado.qtdQuartos === imovel.qtdQuartos,
                     preco: diferencaPreco <= 5000,
                  });

                  const isSemelhante =
                     imovelComparado.qtdBanheiros === imovel.qtdBanheiros ||
                     imovelComparado.qtdQuartos === imovel.qtdQuartos ||
                     diferencaPreco <= 5000;

                  console.log("É semelhante?", isSemelhante);
                  return isSemelhante;
               } catch (err) {
                  console.error("Erro ao comparar imóvel:", err);
                  return false;
               }
            }
         );

         console.log("Imóveis semelhantes encontrados:", semelhantes); // Debug resultado final
         setImoveisSemelhantes(semelhantes);
      } catch (err) {
         console.error("Erro ao buscar imóveis semelhantes:", err);
      }
   };

   useEffect(() => {
      if (imovel) {
         buscarImoveisSemelhantes();
      }
   }, [imovel]);

   console.log(imovel);

   if (loading) {
      return <p>Carregando...</p>;
   }

   if (error) {
      return <p>Erro: {error}</p>;
   }

   if (!imovel) {
      return <p>Imóvel não encontrado.</p>;
   }

   const handleNextImage = () => {
      setCurrentImageIndex((prev) =>
         prev === imovel.imagens.length - 1 ? 0 : prev + 1
      );
   };

   const handlePreviousImage = () => {
      setCurrentImageIndex((prev) =>
         prev === 0 ? imovel.imagens.length - 1 : prev - 1
      );
   };

   const handleShare = async () => {
      try {
         await navigator.clipboard.writeText(window.location.href);
         setShowCopiedMessage(true);
         setIsShared(true);
         setTimeout(() => {
            setShowCopiedMessage(false);
            setIsShared(false);
         }, 2000);
      } catch (err) {
         console.error("Erro ao copiar link:", err);
      }
   };

   return (
      <Layout className="bg-begepadrao py-8">
         <div className="flex flex-col items-center w-full gap-1 md:flex-row md:px-8 md:items-start">
            {/* Imagem principal */}
            <div className="flex w-11/12 flex-col gap-1 items-center md:items-start lg:ml-24 md:ml-20">
               <div className="flex justify-center items-center w-full relative">
                  <button
                     onClick={handlePreviousImage}
                     className="absolute left-0 md:left-[8%] z-10 bg-havprincipal/50 hover:bg-havprincipal p-1 md:p-2 rounded-full text-begepadrao"
                  >
                     <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                  <Image
                     src={
                        imovel.imagens[currentImageIndex]?.referencia ||
                        IMAGEM_PADRAO
                     }
                     alt="House image"
                     width={1920}
                     height={1080}
                     className="w-full md:w-10/12 lg:w-[400px] md:w-[300px] aspect-[16/9] object-cover"
                  />
                  <button
                     onClick={handleNextImage}
                     className="absolute right-0 md:right-[8%] z-10 bg-havprincipal/50 hover:bg-havprincipal p-1 md:p-2 rounded-full text-begepadrao"
                  >
                     <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
               </div>

               {/* Grid de 3 imagens */}
               <div className="grid grid-cols-3 w-full md:w-10/12 gap-1 lg:w-[400px] md:w-[300px] mx-auto">
                  {[...imovel.imagens, ...imovel.imagens] // Duplicamos o array para permitir rotação circular
                     .slice(currentImageIndex + 1, currentImageIndex + 4) // Pegamos as próximas 3 imagens após a atual
                     .map((imagem, index) => (
                        <Image
                           key={`${imagem.id}-${index}`}
                           src={imagem.referencia || IMAGEM_PADRAO}
                           alt="House image"
                           width={1920}
                           height={1080}
                           className="w-full aspect-[16/9] object-cover cursor-pointer"
                           onClick={() => {
                              const targetIndex =
                                 (currentImageIndex + 1 + index) %
                                 imovel.imagens.length;
                              setCurrentImageIndex(targetIndex);
                           }}
                        />
                     ))}
               </div>
            </div>

            {/* Textos alinhados com as imagens */}
            <div className="w-9/12 font-inter text-havprincipal mt-3 md:mt-0 md:ml-24 lg:ml-0">
               <p className="font-medium text-sm md:text-xl">À venda por</p>
               {imovel.precoPromocional ? (
                  <>
                     <h1 className="font-extrabold text-xl text-shadow md:text-3xl">
                        R${imovel.precoPromocional}
                     </h1>
                     <p className="text-sm line-through opacity-75">
                        R${imovel.preco}
                     </p>
                  </>
               ) : (
                  <h1 className="font-extrabold text-xl text-shadow md:text-3xl">
                     R${imovel.preco}
                  </h1>
               )}
               <p className="font-semibold md:text-xl">{imovel.titulo}</p>
               <p className="w-full text-start md:w-9/12 md:text-lg">
                  {imovel.descricao}
               </p>
               {imovel.iptu && (
                  <p className="mt-2">
                     <strong>IPTU:</strong> R${imovel.iptu}
                  </p>
               )}
               {imovel.condominio && (
                  <p className="mt-2">
                     <strong>Condominio:</strong> R${imovel.condominio}
                  </p>
               )}
               <div className="flex gap-5 mt-2">
                  <button className="w-52 bg-havprincipal md:w-40 h-8 rounded-lg">
                     <p className="text-white text-center p-1 text-[15px]">
                        Agendar visita
                     </p>
                  </button>
                  <div className="mt-1 flex gap-3">
                     <button
                        onClick={handleShare}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                           isShared ? "bg-havprincipal text-white" : ""
                        }`}
                     >
                        <Share2 className="w-5 h-5" />
                        {showCopiedMessage && (
                           <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-havprincipal text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                              Link copiado!
                           </span>
                        )}
                     </button>
                     <Heart />
                  </div>
               </div>
            </div>
         </div>
         <div className="w-full">
            <MapboxMap
               endereco={imovel.endereco}
               detalhesImovel={{
                  tamanho: imovel.tamanho,
                  qtdQuartos: imovel.qtdQuartos,
                  qtdGaragens: imovel.qtdGaragens,
                  qtdBanheiros: imovel.qtdBanheiros,
                  qtdPiscina: imovel.qtdPiscina,
                  qtdChurrasqueira: imovel.qtdChurrasqueira,
               }}
            />
         </div>

         {/* Seção de Imóveis Semelhantes */}
         {imoveisSemelhantes.length > 0 && (
            <div className="mt-10 px-8">
               <h2 className="text-2xl font-semibold text-havprincipal mb-6">
                  Imóveis Semelhantes
               </h2>
               <div className="flex flex-row gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {imoveisSemelhantes.map((imovelSemelhante) => (
                     <CardImovel
                        key={imovelSemelhante.id}
                        imovel={imovelSemelhante as any}
                     />
                  ))}
               </div>
            </div>
         )}
      </Layout>
   );
};

export default Page;
