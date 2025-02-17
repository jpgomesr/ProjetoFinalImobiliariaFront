import React, { useState } from "react";

interface ComponenteInputFiltro {
   opcoes: string[];
   onChange: (selecionado: string) => void;
   placeholder: string;
   selecionado: string;
}

const ComponenteSelectFiltro = (props: ComponenteInputFiltro) => {
   // Estado para controlar o valor selecionado
   const [selecionado, setSelecionado] = useState("");
   // Função de mudança de seleção
   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const valorSelecionado = e.target.value;
      setSelecionado(valorSelecionado);
      props.onChange(valorSelecionado);
   };

   return (
      <select
         className="w-full p-1.5 border border-black rounded-md text-[10px] max-w-24"
         onChange={handleChange}
         value={props.selecionado}
      >
         <option value="" disabled hidden>
            {props.placeholder}
         </option>
         {props.opcoes.map((value, index) => (
            <option key={index} value={value}>
               {value}
            </option>
         ))}
      </select>
   );
};

export default ComponenteSelectFiltro;
