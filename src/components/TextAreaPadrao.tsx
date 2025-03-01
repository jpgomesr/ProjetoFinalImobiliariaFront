import React from "react";

interface TextAreaPadraoProps {
   placeholder?: string;
   label: string;
   htmlFor: string;
   onChange: (valor: string) => void;
   value?: string;
   mensagemErro? : string
}

const TextAreaPadrao = (props: TextAreaPadraoProps) => {
   return (
      <div className="flex flex-col lg:gap-1 2xl:gap-2">
         <label
            htmlFor={props.htmlFor}
            className="opacity-90 text-xs
         font-montserrat
         md:text-sm
         lg:text-base lg:rounded-lg
         2xl:text-xl 2xl:rounded-xl
         "
         >
            {props.label}
         </label>
         <textarea
            name="descricao"
            className={`border ${props.mensagemErro ? "border-red-500" : "border-black"} rounded-md min-h-20 text-xs py-2 px-2
            md:h-8 md:text-sm
            lg:h-10 lg:py-3 lg:px-3
            xl:h-12 xl:text-base xl:py-3 xl:px-4`}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            value={props.value}
         ></textarea>
       {props.mensagemErro && <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">{props.mensagemErro}</span>}
      </div>
   );
};

export default TextAreaPadrao;
