import React from "react";

interface InputPadraoProps {
   placeholder?: string;
   tipoInput: string;
   label?: string;
   htmlFor: string;
   onChange: (valor: string) => void;
   required?: boolean;
   maxLenght?: number;
   minLength? : number;
   value? : string;
   mensagemErro?: string 
   disable? : boolean
}

const InputPadrao = (props: InputPadraoProps) => {
   return (
      <div className="flex flex-col lg:gap-1 2xl:gap-2">
         {props.label &&
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
         
         }
       
         <input
            type={props.tipoInput}
            placeholder={props.placeholder}
            required={props.required}
            className={`h-6 rounded-md border py-2 px-2 ${props.mensagemErro ? "border-red-500" : "border-black text-[10px]" } focus:border-black
            md:h-8 md:text-sm
            lg:h-10 lg:py-3 lg:px-3
            xl:h-12 xl:text-base xl:py-3 xl:px-4`}
            onChange={(e) => props.onChange(e.target.value)}
            maxLength={props.maxLenght}
            minLength={props.minLength}
            value={props.value}
            disabled={props.disable}
         />
         {props.mensagemErro && <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">{props.mensagemErro}</span>}

      </div>
   );
};

export default InputPadrao;
