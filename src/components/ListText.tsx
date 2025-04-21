"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ListTextProps extends React.InputHTMLAttributes<HTMLSelectElement> {
   titulo: string;
   texto: string;
   buttonHolder?: string;
   bordaPreta?: boolean;
   mudandoValor?: (valor: string) => void;
   divClassName?: string;
   differentSize?: string;
   mensagemErro?: string;
}

const ListText = (props: ListTextProps) => {
   const [aberto, setAberto] = useState(false);

   return (
      <div className={"flex flex-col"}>
         <div
            className={`relative h-full lg:gap-1 2xl:gap-2 flex flex-col
               ${
                  props.divClassName
                     ? props.divClassName
                     : "max-w-24 min-w-24 w-24 md:max-w-32 md:min-w-32 md:w-32 2xl:max-w-44 2xl:w-44"
               }
                `}
         >
            <div
               className={
                  props.className == null

                     ? `${ "border-gray-300 border-2"
                       } rounded-md bg-white shadow-sm cursor-pointer h-full ${
                          aberto
                             ? "rounded-bl-none rounded-br-none border-b-0"
                             : null
                       }`

                     : props.className
               }
               onClick={() => setAberto(!aberto)}
            >
               {props.buttonHolder && (
                  <p className="text-xs absolute top-[-7px] px-1 bg-white left-1 text-gray-400">
                     {props.buttonHolder}
                  </p>
               )}
               <div
                  className={`flex items-center justify-between px-2 py-1 gap-2 h-full  ${
                     "border-gray-300 border-2"
                  } border-transparent ${props.differentSize}`}
               >
                  <span className="text-xs sm:text-sm truncate xl:text-base">
                     {props.titulo}
                  </span>
                  <ChevronDown
                     className={`transition-transform min-w-4 max-w-4 w-4 ${
                        aberto ? "rotate-180" : ""
                     }`}
                  />
               </div>
               {aberto && (
                  <div
                     className={`absolute left-0 right-0 z-10 bg-white rounded-b-md shadow-md p-4 ${

                           "border-gray-300 border-2 border-t-0"
                     }`}
                  >
                     <p className="text-sm md:text-base">{props.texto}</p>
                  </div>
               )}
            </div>
         </div>
         {props.mensagemErro && (
            <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
               {props.mensagemErro}
            </span>
         )}
      </div>
   );
};

export default ListText;
