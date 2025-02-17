import React, { useState } from "react";

interface ComponenteRadioFiltroProps {
   titulo: string;
   onChange: (valores: number[]) => void;
   selecionados: number[];
}

const ComponenteRadioFiltro = (props: ComponenteRadioFiltroProps) => {
   const [selecionados, setSelecionados] = useState<number[]>(
      props.selecionados
   );
   const opcoes = [1, 2, 3, 4];
   console.log(selecionados);
   console.log("via props" + props.selecionados);
   const toggleSelecao = (valor: number) => {
      setSelecionados(props.selecionados);

      let novosSelecionados = [];
      if (selecionados.includes(valor)) {
         novosSelecionados = selecionados.filter((item) => item !== valor);
      } else {
         novosSelecionados = [...selecionados, valor];
      }
      setSelecionados(novosSelecionados);
      props.onChange(novosSelecionados);
   };

   return (
      <div className="flex flex-col text-xs gap-1">
         <p>{props.titulo}</p>
         <div className="flex text-[10px] gap-2">
            {opcoes.map((opcao) => (
               <div
                  key={opcao}
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer ${
                     props.selecionados.includes(opcao)
                        ? "bg-havprincipal text-white"
                        : "bg-begepadrao"
                  }`}
                  onClick={() => toggleSelecao(opcao)}
               >
                  {opcao === 4 ? "4+" : opcao}
               </div>
            ))}
         </div>
      </div>
   );
};

export default ComponenteRadioFiltro;
