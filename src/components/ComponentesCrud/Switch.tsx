"use client";

import type React from "react";

import { useState } from "react";

interface SwitchProps {
   className?: string;
   handleAcao: ( e?:any) => void;
   value? : boolean
}

const Switch = (props: SwitchProps) => {
   const [isChecked, setIsChecked] = useState(props.value ?? false);

   return (
      <div className={`inline-block ${props.className}`}>
         <label className="relative inline-flex items-center cursor-pointer w-full h-full">
            <input
               type="checkbox"
               className="sr-only peer"
               checked={isChecked}
               onChange={() => {
                  setIsChecked(!isChecked);
                  props.handleAcao(!isChecked);
                  
               }}
            />
            <div
               className={`
                        relative w-full h-full bg-gray-300 rounded-full 
                        peer-checked:bg-havprincipal 
                        after:content-[''] after:absolute
                        after:bg-white after:rounded-full after:h-[100%] after:w-[50%]
                        after:transition-all after:duration-300 
                        peer-checked:after:translate-x-[100%]
                        peer-active:after:w-[56.67%]
                        shadow-inner border-gray-300
                        border-[1px] peer-checked:border-havprincipal
                    `}
            ></div>
         </label>
      </div>
   );
};

export default Switch;
