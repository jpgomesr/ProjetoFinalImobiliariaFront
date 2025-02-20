import React from "react";

interface InputPadraoProps {
   placeholder?: string;
   tipoInput: string;
   label: string;
   htmlFor: string;
   required : boolean
}

const InputPadrao = (props: InputPadraoProps) => {
   return (
      <div className="flex flex-col lg:gap-1 2xl:gap-2">
         <label
            htmlFor={props.htmlFor}
            className="opacity-90 text-xs
         font-montserrat
         md:text-sm
         lg:text-xl lg:rounded-lg
         2xl:text-2xl 2xl:rounded-xl
         "
         >
            {props.label}
         </label>
         <input
            type={props.tipoInput}
            placeholder={props.placeholder}
            required={props.required}
            className="h-6 rounded-md border py-2 px-2 border-black text-[10px]
            md:h-8 md:text-sm
            lg:h-10 lg:py-3 lg:px-3
            xl:h-12 xl:text-base xl:py-3 xl:px-4"
         />
      </div>
   );
};

export default InputPadrao;
