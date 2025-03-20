import React from "react";
import RegisterForm from "../forms/RegisterForm";

interface RegisterModalProps {
   onClose: () => void;
   onLogin: () => void;
}

const RegisterModal = ({ onClose, onLogin }: RegisterModalProps) => {
   return (
      <div className="w-full h-full flex bg-gradient-to-b from-begeEscuroPadrao to-white rounded-xl">
         <RegisterForm onClose={onClose} onLogin={onLogin} />
      </div>
   );
};

export default RegisterModal;
