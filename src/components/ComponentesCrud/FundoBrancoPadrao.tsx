interface FundoBrancoPadraoProps {
   titulo: string;
   children: React.ReactNode;
   className? : string
}

import React from "react";

const FundoBrancoPadrao = (props: FundoBrancoPadraoProps) => {
   return (
      <div
         className="py-4 px-4  flex flex-col bg-white w-10/12 rounded-md
      lg:py-6 lg:px-6
      2xl:py-8 2xl:px-8
      "
      >
         <h2
            className="text-havprincipal text-sm
         md:text-xl lg:text-2xl"
         >
            {props.titulo}
         </h2>
         <div className="h-[1px] w-full bg-gray-400 my-3"></div>
         <div className={`flex flex-col gap-3 ${props.className ? props.className : "w-10/12"}`}>{props.children}</div>
      </div>
   );
};

export default FundoBrancoPadrao;
