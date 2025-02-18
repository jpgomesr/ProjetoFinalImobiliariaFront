import React from "react";
import InputFiltro from "./InputFiltro";

interface ComponenteInputFiltroProps {
   label: string;
   placeholder: string;
   tipoInput: string;
   htmlFor: string;
   valor: string;
   onChange: (value: string) => void;
}

const ComponenteInputFiltro = (props: ComponenteInputFiltroProps) => {
   return (
      <div
         className="flex border-b-2 gap-2 text-xs flex-1 max-w-32
        md:max-w-28 md:text-sm"
      >
         <label htmlFor={props.htmlFor}>{props.label}</label>
         <InputFiltro
            placeholder={props.placeholder}
            tipo={props.tipoInput}
            onChange={props.onChange}
            valor={props.valor}
         />
      </div>
   );
};

export default ComponenteInputFiltro;
