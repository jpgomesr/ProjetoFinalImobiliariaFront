import React from "react";

interface TextAreaPadraoProps {
   placeholder?: string;
   label: string;
   htmlFor: string;
   onChange: (valor: string) => void;
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
            className="border border-black min-h-20 text-xs py-2 px-2
            md:h-8 md:text-sm
            lg:h-10 lg:py-3 lg:px-3
            xl:h-12 xl:text-base xl:py-3 xl:px-4"
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
         ></textarea>
      </div>
   );
};

export default TextAreaPadrao;
