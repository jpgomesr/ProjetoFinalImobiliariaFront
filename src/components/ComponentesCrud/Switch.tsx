"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   mensagemErro?: string;
   checked?: boolean;
   handleAcao?: ( e?:any) => void;
   
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
   ({ className, onChange, label, checked, mensagemErro, ...props }, ref) => {
      return (
         <>
            <div className={"flex flex-col xl:gap-1"}>
               {label && (
                  <label
                     htmlFor={props.id || label}
                     className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl"
                  >
                     {label}
                  </label>
               )}
               <label className="relative items-center cursor-pointer w-full h-full">
                  <input
                     ref={ref}
                     type="checkbox"
                     className="sr-only peer"
                     checked={checked}
                     onChange={onChange}
                     {...props}
                  />
                  <div
                     className={twMerge(
                        `
                           relative w-full h-full bg-gray-300 rounded-full 
                           peer-checked:bg-havprincipal 
                           after:content-[''] after:absolute
                           after:bg-white after:rounded-full after:h-[100%] after:w-[50%]
                           after:transition-all after:duration-200 
                           peer-checked:after:translate-x-[100%]
                           peer-active:after:w-[56.67%]
                           shadow-inner border-gray-300
                           border-[1px] peer-checked:border-havprincipal
                        `,
                        className
                     )}
                  />
               </label>
            </div>
            {mensagemErro && (
               <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
                  {mensagemErro}
               </span>
            )}
         </>
      );
   }
);

Switch.displayName = "Switch";

export default Switch;
