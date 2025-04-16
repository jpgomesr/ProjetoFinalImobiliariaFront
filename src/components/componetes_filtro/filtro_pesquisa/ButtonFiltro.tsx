"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import Filtro from "./Filtro";

interface ButtonFiltroProps {
   className?: string;
   precoMinimo: string;
   precoMaximo: string;
   metrosQuadradosMinimo: string;
   metrosQuadradosMaximo: string;
   quantidadeDeVagas: string;
   quantidadeDeQuartos: string;
   cidade: string;
   bairro: string;
   tipoImovel: string;
   finalidade: string;
   url: string;
   bordaPreta?: boolean;
}
const ButtonFiltro = (props: ButtonFiltroProps) => {
   const [qtdFiltros, setQtdFiltros] = useState(0);
   const [filtroAberto, setFiltroAberto] = useState<boolean>(false)

   return (
      <div className="relative w-full h-full">
         <div
            className={
               props.className == null
                  ? `border-2 border-gray-300 rounded-md bg-white shadow-sm cursor-pointer z-30 h-full flex items-center justify-between ${
                       filtroAberto ? "rounded-b-none border-b-0" : null
                    }`
                  : props.className
            }
            onClick={() => setFiltroAberto(!filtroAberto)}
         >
            <div className="flex flex-row items-center justify-between px-2 py-1 gap-2">
               <span className="flex flex-row gap-2 text-sm items-center">
                  <Filter className="w-4 text-gray-800" /> Filtro ({qtdFiltros})
               </span>
               <ChevronDown
                  size={16}
                  className={`transition-transform ${
                     filtroAberto ? "rotate-180" : ""
                  }`}
               />
            </div>
         </div>
         {filtroAberto && (
            <div className="absolute right-0 top-full z-20 w-max min-w-[200px]">
               <Filtro
                  precoMinimo={props.precoMinimo}
                  precoMaximo={props.precoMaximo}
                  metrosQuadradosMinimo={props.metrosQuadradosMinimo}
                  metrosQuadradosMaximo={props.metrosQuadradosMaximo}
                  quantidadeDeVagas={props.quantidadeDeVagas}
                  quantidadeDeQuartos={props.quantidadeDeQuartos}
                  cidade={props.cidade}
                  bairro={props.bairro}
                  tipoImovel={props.tipoImovel}
                  finalidade={props.finalidade}
                  url={props.url}
                  bordaPreta={props.bordaPreta ?? false}
               />
            </div>
         )}
      </div>
   )
}

export default ButtonFiltro;