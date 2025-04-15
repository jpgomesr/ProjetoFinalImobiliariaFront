"use client";

import { useLanguage } from "@/context/LanguageContext";
import React from "react";

interface FundoBrancoPadraoProps {
   titulo: string;
   children: React.ReactNode;
   className?: string;
   isTranslationKey?: boolean;
}

const FundoBrancoPadrao = (props: FundoBrancoPadraoProps) => {
   const { t } = useLanguage();

   return (
      <div
         className="py-4 px-4 flex flex-col bg-white w-11/12 rounded-md   
         md:w-10/12
         lg:py-6 lg:px-6
         2xl:py-8 2xl:px-8"
      >
         <h2
            className="text-havprincipal text-sm
            md:text-xl lg:text-2xl"
         >
            {props.isTranslationKey ? t(props.titulo) : props.titulo}
         </h2>
         <div className="h-[1px] w-full bg-gray-400 my-3
            md:my-4
            lg:my-6
            2xl:my-8"></div>

         <div className={`flex flex-col gap-3 ${props.className ? props.className : "w-10/12"}`}>{props.children}</div>
      </div>
   );
};

export default FundoBrancoPadrao;
