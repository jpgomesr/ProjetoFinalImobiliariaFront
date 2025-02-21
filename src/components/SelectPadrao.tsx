import React, {useState} from 'react'


interface SelectPadraoProps {
    opcoes: string[];
    onChange: (selecionado: string) => void;
    placeholder: string;
    selecionado: string;
 }

const SelectPadrao = (props : SelectPadraoProps) => {

   const [selecionado, setSelecionado] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valorSelecionado = e.target.value;
        setSelecionado(valorSelecionado);
        props.onChange(valorSelecionado);
     };
  return (

    

    <select
         className="w-full p-1.5 border border-black rounded-md text-[10px] max-w-24
         2xl:w-44 2xl:max-w-44 md:text-sm"
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
  )
}

export default SelectPadrao;
