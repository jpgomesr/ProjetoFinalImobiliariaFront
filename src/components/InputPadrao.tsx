import React from "react";

interface InputPadraoProps {
   placeholder?: string;
   tipoInput: string;
   label: string;
   htmlFor: string;
}

const InputPadrao = (props: InputPadraoProps) => {
   return (
      <div className="flex flex-col">
         <label
            htmlFor={props.htmlFor}
            className="text-sm
         md:text-xl
         lg:text-[20px] lg:rounded-lg
         2xl:text-2xl 2xl:rounded-xl
         "
         >
            {props.label}
         </label>
         <input
            type={props.tipoInput}
            placeholder={props.placeholder}
            className="h-6 rounded-md border py-2 px-2 border-black text-[10px]
            md:h-8 md:text-sm
            lg:h-10 
            xl:h-12 xl:text-base xl:py-3 xl:px-4"
         />
      </div>
   );
};

export default InputPadrao;
