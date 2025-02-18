import LogoHav from "@/svg/icons/logo/LogoHavClaro";
import React from "react";

const Footer = () => {
   return (
      <div className="px-4 pb-12 pt-6 bg-havprincipal h-full w-full">
         <div className="flex flex-col px-4 space-y-4 text-xs text-[#DFDAD0] justify-center items-start">
            <button>Termos de serviço</button>
            <button>Corretores</button>
            <button>Política de privacidade</button>
            <button>HAV na sociedade</button>
            <button>Contato</button>
            <button>Conheça a HAV</button>
            <button>Feedbacks</button>
            <button>Cadastre-se</button>
            <button>Casas</button>
            <button>Apartamentos</button>
            <button>Dúvidas frequentes</button>
            <button>Chat Bot</button>
            <div className="flex flex-row gap-2 justify-center">
               <LogoHav width={50} height={50} visible={false} />
               <button>HAV Imobiliária</button>
            </div>
            <div></div>
            <div className="text-[10px] flex flex-col gap-4">
               <p>RUA DAS FLORES 6212</p>
               <p>VILA NOVA </p>
               <p>JARAGUÁ DO SUL - SC</p>
            </div>
         </div>
      </div>
   );
};

export default Footer;
