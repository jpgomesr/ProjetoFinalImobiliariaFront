"use client";

import React from "react";
import { SearchIcon } from "lucide-react"; // Importe o ícone de lupa
import { twMerge } from "tailwind-merge";

interface InputPadraoProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   htmlFor?: string;
   mensagemErro?: string;
   search?: boolean; // Nova prop para o ícone de lupa
   handlePesquisa?: () => void; // Função para o clique no botão de lupa
}

const InputPadrao = ({
   label,
   htmlFor,
   mensagemErro,
   search = false, // Valor padrão para a prop search
   handlePesquisa,
   ...props
}: InputPadraoProps) => {
   return (
      <div className="flex flex-col lg:gap-1 2xl:gap-2">
         {label && (
            <label
               htmlFor={htmlFor}
               className="opacity-90 text-xs
                       font-montserrat
                       md:text-sm
                       lg:text-base lg:rounded-lg
                       2xl:text-xl 2xl:rounded-xl
                       "
            >
               {label}
            </label>
         )}

         <div
            className={`relative flex items-center rounded-md border ${
               mensagemErro ? "border-red-500" : "border-black"
            } ${props.disabled ? "opacity-30" : ""}`}
         >
            <input
               {...props}
               className={twMerge(
                  `h-6 w-full focus:outline-none text-[10px] bg-transparent border-none  px-2
                  md:h-8 md:text-sm
                  lg:h-10 lg:py-3 lg:px-3
                  xl:h-12 xl:text-base xl:py-3 xl:px-4
                  ${search ? "pl-2" : ""}`,
                  props.className
               )} // Adiciona padding à esquerda se search for true
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                  }
               }}
            />
            {search && ( // Renderiza o botão de lupa se search for true
               <button
                  type="button" // Define o tipo do botão para evitar submit de formulário
                  className="absolute inset-y-0 right-2 flex items-center justify-center p-2 hover:cursor-pointer"
                  onClick={handlePesquisa} // Função de clique no botão
               >
                  <SearchIcon className="w-4 h-4 text-black" />{" "}
                  {/* Ícone de lupa */}
               </button>
            )}
         </div>
         {mensagemErro && (
            <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
               {mensagemErro}
            </span>
         )}
      </div>
   );
};

export default InputPadrao;
