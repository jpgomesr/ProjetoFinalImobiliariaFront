"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ListProps extends React.InputHTMLAttributes<HTMLSelectElement> {
   opcoes: { id: any; label: string }[];
   defaultValue?: string;
   buttonHolder?: string;
   bordaPreta?: boolean;
   title?: string;
   mudandoValor?: (valor: string) => void;
   divClassName?: string;
   // classe do div que contem o titulo e o select
   // {* lidera o tamanho total do list *}
   differentSize?: string;
   mensagemErro?: string;
   width?: string; // Nova prop para customizar a largura
}

const List = (props: ListProps) => {
   const { value, onChange, defaultValue, ...rest } = props;
   const [selecionado, setSelecionado] = useState(value || props.opcoes[0]?.id);
   const [aberto, setAberto] = useState(false);

   useEffect(() => {
      if (value !== undefined) {
         setSelecionado(value);
      }
   }, [value]);

   const handleSelect = (id: string) => {
      setSelecionado(id);
      setAberto(false);

      if (props.mudandoValor) {
         props.mudandoValor(id);
      }
   };

   const opcaoSelecionada =
      props.opcoes.find((opc) => opc.id === selecionado)?.label ||
      props.opcoes[selecionado]?.label;

   return (
      <div className={"flex flex-col"}>
         <div
            className={`relative h-full lg:gap-1 2xl:gap-2 flex flex-col
               ${
                  props.divClassName
                     ? props.divClassName
                     : props.width 
                        ? props.width
                        : "max-w-24 min-w-24 w-24 md:max-w-32 md:min-w-32 md:w-32 2xl:max-w-44 2xl:w-44"
               }
                `}
         >
            {props.title && (
               <label className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl">
                  {props.title}
               </label>
            )}
            <div
               className={
                  props.className == null
                     ? `${
                          props.bordaPreta
                             ? "border-black border-[1px]"
                             : "border-gray-300 border-2"
                       } rounded-md bg-white shadow-sm cursor-pointer h-full   ${
                          aberto ? "rounded-bl-none rounded-br-none" : null
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
                  className={`flex  items-center justify-between px-2 py-1 gap-2 h-full  ${
                     props.bordaPreta ? "border" : "border-2"
                  } border-transparent ${props.differentSize}`}
               >
                  <span className="text-xs sm:text-sm truncate xl:text-base">
                     {opcaoSelecionada}
                  </span>
                  <ChevronDown
                     className={`transition-transform min-w-4 max-w-4 w-4 ${
                        aberto ? "rotate-180" : ""
                     }`}
                  />
               </div>
               {aberto && (
                  <div className="absolute left-0 right-0 z-10 bg-white border-t-0 rounded-b-md shadow-md">
                     {props.opcoes
                        .filter((opc) => opc.id !== selecionado)
                        .map((opc, index, arr) => (
                           <div
                              key={opc.id}
                              className={`text-xs px-2 py-1 cursor-pointer hover:bg-gray-100 
                                       ${
                                          props.bordaPreta
                                             ? "border-black"
                                             : "border-gray-300"
                                       } border-l border-r
                                       ${
                                          index === 0
                                             ? "border-t rounded-t-none"
                                             : ""
                                       }
                                       ${
                                          index === arr.length - 1
                                             ? "border-b rounded-b-md"
                                             : ""
                                       }
                                       ${
                                          index > 0 && index < arr.length - 1
                                             ? "border-t border-b-none"
                                             : ""
                                       }
                                       ${
                                          index == arr.length - 2 &&
                                          arr.length > 3
                                             ? "border-b"
                                             : ""
                                       }
                                       ${
                                          index == arr.length - 1 &&
                                          arr.length == 3
                                             ? "border-t"
                                             : ""
                                       } xl:text-base`}
                              onClick={() => handleSelect(opc.id)}
                           >
                              {opc.label}
                           </div>
                        ))}
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

export default List;
