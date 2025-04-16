import React, { TextareaHTMLAttributes } from "react";

interface TextAreaPadraoProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
   label: string;
   htmlFor: string;
   mensagemErro? : string | undefined;
}

const TextAreaPadrao = ({label, htmlFor, mensagemErro, ...props}: TextAreaPadraoProps) => {
   return (
      <div className="flex flex-col lg:gap-1 2xl:gap-2">
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
         <textarea
            {...props}
            className={`border ${mensagemErro ? "border-red-500" : "border-black"} rounded-md min-h-20 text-xs py-2 px-2
            md:h-8 md:text-sm
            lg:h-10 lg:py-3 lg:px-3
            xl:h-12 xl:text-base xl:py-3 xl:px-4`}
         ></textarea>
       {mensagemErro && <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">{mensagemErro}</span>}
      </div>
   );
};

export default TextAreaPadrao;
