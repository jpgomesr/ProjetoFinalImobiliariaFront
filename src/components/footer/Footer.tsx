import LogoHav from "@/svg/icons/logo/LogoHavClaro";
import FacebookIcon from "@/svg/icons/footer/FacebookIcon";
import InstagramIcon from "@/svg/icons/footer/InstagramIcon";
import TwitterIcon from "@/svg/icons/footer/TwitterIcon";
import React from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
   const router = useRouter();

   return (
      <div className="px-4 pb-12 pt-6 bg-havprincipal h-full w-full">
         <div className="flex flex-col px-4 space-y-4 text-xs text-[#DFDAD0] justify-center items-start">
            <button onClick={() => router.push("/")}>Termos de serviço</button>
            <button onClick={() => router.push("/")}>Corretores</button>
            <button onClick={() => router.push("/")}>
               Política de privacidade
            </button>
            <button onClick={() => router.push("/")}>HAV na sociedade</button>
            <button onClick={() => router.push("/")}>Contato</button>
            <button onClick={() => router.push("/")}>Conheça a HAV</button>
            <button onClick={() => router.push("/")}>Feedbacks</button>
            <button onClick={() => router.push("/")}>Cadastre-se</button>
            <button onClick={() => router.push("/")}>Casas</button>
            <button onClick={() => router.push("/")}>Apartamentos</button>
            <button onClick={() => router.push("/")}>Dúvidas frequentes</button>
            <button onClick={() => router.push("/")}>Chat Bot</button>
            <div className="flex flex-row gap-2 justify-center">
               <LogoHav className="w-12 h-12" visible={false} />
               <button onClick={() => router.push("/")}>HAV Imobiliária</button>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
               <button onClick={() => router.push("/")}>
                  <FacebookIcon width={20} height={20} />
               </button>
               <button onClick={() => router.push("/")}>
                  <InstagramIcon width={20} height={20} />
               </button>
               <button onClick={() => router.push("/")}>
                  <TwitterIcon width={20} height={20} />
               </button>
            </div>
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
