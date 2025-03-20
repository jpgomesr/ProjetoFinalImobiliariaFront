import React from "react";
import RegisterForm from "../forms/RegisterForm";
import Image from "next/image";
import { X } from "lucide-react";

interface RegisterModalProps {
   onClose: () => void;
   onLogin: () => void;
}

const RegisterModal = ({ onClose, onLogin }: RegisterModalProps) => {
   return (
      <div className="w-full h-full flex items-center justify-center">
         <div
            className="py-4 sm:py-8 md:py-16 lg:py-[4.855rem] 2xl:py-40 flex bg-gradient-to-b from-begeEscuroPadrao to-white rounded-xl
                        justify-center items-center md:gap-16 lg:gap-40 2xl:gap-60 relative px-4 sm:px-8 md:px-16 lg:w-10/12"
            onClick={(e) => e.stopPropagation()}
         >
            <X
               className="text-havprincipal absolute top-4 left-4 hidden lg:block cursor-pointer w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6"
               onClick={onClose}
            />
            <RegisterForm onLogin={onLogin} />
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

export default RegisterModal;
