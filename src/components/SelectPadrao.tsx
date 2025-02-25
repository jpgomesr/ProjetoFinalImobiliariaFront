import React, { useState } from "react";

interface SelectPadraoProps {
   opcoes: string[];
   onChange: (selecionado: string) => void;
   placeholder: string;
   selecionado: string;
   className?: string;
}

const SelectPadrao = (props: SelectPadraoProps) => {
   const [selecionado, setSelecionado] = useState("");

   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const valorSelecionado = e.target.value;
      setSelecionado(valorSelecionado);
      props.onChange(valorSelecionado);
   };
   return (
      <select
         className={`${props.className ?? ""} 
         border border-black rounded-md py-1 px-2 text-xs
         lg:text-sm lg:py-2 lg:px-3
         xl:text-base xl:py-3 xl:px-4`}
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

export default SelectPadrao;
