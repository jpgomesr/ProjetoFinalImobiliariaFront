import React from "react";
import RecContaForm from "../forms/RecContaForm";
import Image from "next/image";
import { X } from "lucide-react";

const RecContaModal = () => {
   return (
      <div className="w-full h-full flex items-center justify-center">
         <div
            className="py-4 sm:py-8 md:py-16 lg:py-32 2xl:py-40 flex bg-gradient-to-b from-begeEscuroPadrao to-white rounded-xl 
                        justify-center items-center relative px-4 sm:px-8 md:px-16 lg:gap-40 2xl:gap-60 z-40 lg:w-10/12"
            onClick={(e) => e.stopPropagation()}
         >
            <X
               className="text-havprincipal absolute top-4 left-4 cursor-pointer w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 lg:block hidden"
               onClick={() => {}}
            />
            <RecContaForm />
            <div className="hidden lg:block">
               <Image
                  src="/logoHavVermelhoCEscrita.svg"
                  alt="Logo Hav Vermelho Com Escrita"
                  width={100}
                  height={100}
                  className="w-full h-full 2xl:w-[500px]"
               />
            </div>
         </div>
      </div>
   );
};

export default RecContaModal;
