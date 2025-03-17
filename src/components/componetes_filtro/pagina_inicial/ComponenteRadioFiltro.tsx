import React, { useState } from "react";

interface ComponenteRadioFiltroProps {
   titulo: string;
   onChange: (valor : number) => void;
   selecionado : number | null;
}

const ComponenteRadioFiltro = (props: ComponenteRadioFiltroProps) => {
   const opcoes = [1, 2, 3, 4];



   return (
      <div className="flex flex-col text-xs gap-1 md:text-sm xl:text-xl">
         <p className="text-center">{props.titulo}</p>
         <div className="flex text-[10px] gap-2">
            {opcoes.map((opcao) => (
               <div
                  key={opcao}
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer 
                  lg:w-6 lg:h-6 lg:text-xs
                  ${
                     props.selecionado === opcao
                        ? "bg-havprincipal text-white"
                        : "bg-begepadrao"
                  }`}
                  onClick={() => props.onChange(opcao)}
               >
                  {opcao === 4 ? "4+" : opcao}
               </div>
            ))}
         </div>
      </div>
   );
};

export default ComponenteRadioFiltro;
