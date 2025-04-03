"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Imagem {
   id: number;
   referencia: string;
}

interface GaleriaImagensProps {
   imagens: Imagem[];
   imagemPadrao?: string;
   className?: string;
   imagemPrincipalClassName?: string;
   miniaturaClassName?: string;
   containerClassName?: string;
}

const GaleriaImagens = ({
   imagens,
   imagemPadrao = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
   className = "",
   imagemPrincipalClassName = "w-full md:w-10/12 lg:w-[400px] aspect-[16/9] object-cover",
   miniaturaClassName = "w-full aspect-[16/9] object-cover cursor-pointer",
   containerClassName = "",
}: GaleriaImagensProps) => {
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   // Se não houver imagens, exibe a imagem padrão
   const imagensParaExibir =
      imagens.length > 0 ? imagens : [{ id: 0, referencia: imagemPadrao }];

   const handleNextImage = () => {
      setCurrentImageIndex((prev) =>
         prev === imagensParaExibir.length - 1 ? 0 : prev + 1
      );
   };

   const handlePreviousImage = () => {
      setCurrentImageIndex((prev) =>
         prev === 0 ? imagensParaExibir.length - 1 : prev - 1
      );
   };

   return (
      <div
         className={`flex flex-col gap-1 items-center md:items-start ${containerClassName}`}
      >
         {/* Imagem principal */}
         <div
            className={`flex justify-center items-center w-full relative ${className}`}
         >
            <button
               onClick={handlePreviousImage}
               className="absolute left-0 md:left-[8%] z-10 bg-havprincipal/50 hover:bg-havprincipal p-1 md:p-2 rounded-full text-begepadrao"
            >
               <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <Image
               src={
                  imagensParaExibir[currentImageIndex]?.referencia ||
                  imagemPadrao
               }
               alt="Imagem do imóvel"
               width={1920}
               height={1080}
               className={imagemPrincipalClassName}
            />
            <button
               onClick={handleNextImage}
               className="absolute right-0 md:right-[8%] z-10 bg-havprincipal/50 hover:bg-havprincipal p-1 md:p-2 rounded-full text-begepadrao"
            >
               <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
         </div>

         {/* Grid de 3 imagens (miniaturas) */}
         {imagensParaExibir.length > 1 && (
            <div className="grid grid-cols-3 w-full md:w-10/12 gap-1 lg:w-[400px] md:w-[300px] mx-auto">
               {[...imagensParaExibir, ...imagensParaExibir] // Duplicamos o array para permitir rotação circular
                  .slice(currentImageIndex + 1, currentImageIndex + 4) // Pegamos as próximas 3 imagens após a atual
                  .map((imagem, index) => (
                     <Image
                        key={`${imagem.id}-${index}`}
                        src={imagem.referencia || imagemPadrao}
                        alt={`Miniatura ${index + 1}`}
                        width={1920}
                        height={1080}
                        className={miniaturaClassName}
                        onClick={() => {
                           const targetIndex =
                              (currentImageIndex + 1 + index) %
                              imagensParaExibir.length;
                           setCurrentImageIndex(targetIndex);
                        }}
                     />
                  ))}
            </div>
         )}
      </div>
   );
};

export default GaleriaImagens;
