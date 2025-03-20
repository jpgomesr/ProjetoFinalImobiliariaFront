import React from "react";
import LoginForm from "../forms/LoginForm";
import Image from "next/image";
interface LoginModalProps {
   onClose: () => void;
   onRegister: () => void;
}

const LoginModal = ({ onClose, onRegister }: LoginModalProps) => {
   return (
      <div
         className="w-full h-full flex bg-gradient-to-b from-begeEscuroPadrao to-white rounded-xl justify-between
                    px-40"
      >
         <LoginForm onClose={onClose} onRegister={onRegister} />
         <Image
            src="/logoHavVermelhoCEscrita.svg"
            alt="Logo Hav Vermelho C Escrita"
            width={100}
            height={100}
            className="w-60"
         />
      </div>
   );
};

export default LoginModal;
