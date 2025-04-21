"use client"

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ComponentePaginacaoProps {
   totalPaginas: number;
   ultimaPagina: boolean;
   setPaginaAtual: (novaPagina: number) => void;
   paginaAtual: number;
   maximoPaginasVisiveis: number;
}

const ComponentePaginacao = (props: ComponentePaginacaoProps) => {
   const {
      paginaAtual,
      totalPaginas,
      setPaginaAtual,
      maximoPaginasVisiveis,
      ultimaPagina,
   } = props;

   if (totalPaginas <= 1) {
      return null;
   }
   console.log(paginaAtual);

   const [paginasVisiveis, setPaginasVisiveis] = useState<(number | string)[]>(
      []
   );

   const trocandoPagina = useCallback(
      (paginaParaTrocar: number) => {
         if (
            paginaParaTrocar !== paginaAtual &&
            paginaParaTrocar >= 0 &&
            paginaParaTrocar < totalPaginas
         ) {
            setPaginaAtual(paginaParaTrocar);
         }
      },
      [paginaAtual, totalPaginas, setPaginaAtual]
   );

   const calcularPaginasVisiveis = useCallback(() => {
      const novasPaginasVisiveis: (number | string)[] = [];

      novasPaginasVisiveis.push(0);

      let inicioPagina = Math.max(
         1,
         paginaAtual - Math.floor((maximoPaginasVisiveis - 2) / 2)
      );
      const fimPagina = Math.min(
         totalPaginas - 1,
         inicioPagina + maximoPaginasVisiveis - 3
      );

      if (fimPagina - inicioPagina < maximoPaginasVisiveis - 3) {
         inicioPagina = Math.max(1, fimPagina - maximoPaginasVisiveis + 3);
      }

      if (inicioPagina > 1) {
         novasPaginasVisiveis.push("...");
      }

      for (let i = inicioPagina; i <= fimPagina; i++) {
         novasPaginasVisiveis.push(i);
      }

      if (fimPagina < totalPaginas - 2) {
         novasPaginasVisiveis.push("...");
      }

      if (
         totalPaginas > 1 &&
         !novasPaginasVisiveis.includes(totalPaginas - 1)
      ) {
         novasPaginasVisiveis.push(totalPaginas - 1);
      }

      return novasPaginasVisiveis;
   }, [paginaAtual, totalPaginas, maximoPaginasVisiveis]);

   useEffect(() => {
      setPaginasVisiveis(calcularPaginasVisiveis());
   }, [calcularPaginasVisiveis]);

   const renderizandoBotoesPaginacao = () => {
      return paginasVisiveis.map((pagina, index) => {
         if (pagina === "...") {
            return (
               <span key={`ellipsis-${index}`} className="">
                  ...
               </span>
            );
         }

         const numeroPagina = pagina as number;
         const estaSelecionada = numeroPagina === paginaAtual;

         return (
            <button
               key={numeroPagina}
               onClick={() => trocandoPagina(numeroPagina)}
               className={`w-6 h-6 text-xs flex items-center justify-center rounded-full ${
                  estaSelecionada
                     ? "bg-havprincipal text-white"
                     : "bg-[#4A4A4A] text-white hover:bg-[#5A5A5A]"
               }`}
               aria-label={`Página ${numeroPagina + 1}`}
               aria-current={estaSelecionada ? "page" : undefined}
            >
               {numeroPagina + 1}
            </button>
         );
      });
   };

   return (
      <div className="flex items-center justify-center space-x-1 my-4">
         <button
            onClick={() => trocandoPagina(paginaAtual - 1)}
            disabled={paginaAtual === 0}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Página anterior"
         >
            <ChevronLeft/>
         </button>

         {renderizandoBotoesPaginacao()}

         <button
            onClick={() => trocandoPagina(paginaAtual + 1)}
            disabled={ultimaPagina}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Próxima página"
         >
            <ChevronRight/>
         </button>
      </div>
   );
};

export default ComponentePaginacao;
