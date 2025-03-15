import React, { forwardRef } from "react";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
   label: string;
   htmlFor?: string;
   mensagemErro?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
   ({ label, htmlFor, mensagemErro, ...props }, ref) => {
      return (
         <div className="flex flex-col">
            <div className="flex flex-col lg:gap-1 2xl:gap-2">
               {label && (
                  <label
                     htmlFor={htmlFor}
                     className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl"
                  >
                     {label}
                  </label>
               )}
               <textarea
                  ref={ref}
                  {...props}
                  className={`h-12 rounded-md border py-2 px-2 text-[10px] focus:outline-none
                              md:h-16 md:text-sm
                              lg:h-18 lg:py-3 lg:px-3
                              xl:h-20 xl:text-base xl:py-3 xl:px-4
                              resize-none
                              ${
                                 mensagemErro
                                    ? "border-red-500"
                                    : "border-black"
                              }`}
               />
            </div>
            {mensagemErro && (
               <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
                  {mensagemErro}
               </span>
            )}
         </div>
      );
   }
);

export default TextArea;
