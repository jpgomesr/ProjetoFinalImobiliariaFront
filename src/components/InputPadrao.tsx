import React from "react";

interface InputPadraoProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   htmlFor: string;
   mensagemErro?: string;
}

const InputPadrao = ({
   label,
   htmlFor,
   mensagemErro,
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

         <input
            {...props}
            className={`h-6 rounded-md border py-2 px-2 focus:outline-none ${
               mensagemErro ? "border-red-500" : "border-black text-[10px]"
            } focus:border-black
            md:h-8 md:text-sm
            lg:h-10 lg:py-3 lg:px-3
            xl:h-12 xl:text-base xl:py-3 xl:px-4`}
         />
         {mensagemErro && (
            <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
               {mensagemErro}
            </span>
         )}
      </div>
   );
};

export default InputPadrao;
