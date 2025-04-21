import React from "react";
import Link from "next/link";
import { Roles } from "@/models/Enum/Roles";
import LogoHavClaro from "@/svg/icons/logo/LogoHavClaro";
import FuncoesHeader from "./FuncoesHeader";
import HamburguerButton from "./HamburguerButton";
import PerfilDropdown from "./PerfilDropdown";
import Notificacao from "@/components/notificacao/Notificacao";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
   User,
   MessageCircleQuestion,
   Heart,
   MessageCircleMore,
} from "lucide-react";

interface HeaderVermelhoProps {
   role?: Roles;
   id?: string;
   foto?: string | null;
   nome?: string;
   t?: (key: string) => string;
}

const HeaderVermelho = ({ role, id, foto, nome, t }: HeaderVermelhoProps) => {
   return (
      <div
         className="bg-havprincipal px-6 py-1
                     md:px-10 md:py-3 
                     2xl:px-20 2xl:py-5 
                     flex justify-between"
      >
         <div className="flex flex-row md:gap-8  2xl:gap-16">
            <FuncoesHeader role={role as Roles} />
            <Link href={"/"}>
               <LogoHavClaro
                  className="w-14 h-14 2xl:w-20 2xl:h-20"
                  visible={true}
               />
            </Link>
            <Link href={"/"} className="flex justify-center">
               <button className="hidden md:block text-white md:text-base 2xl:text-xl font-montserrat font-light">
               {t?.("navigation.home") || "Home"}
               </button>
            </Link>
            <Link href={"/sobre-nos"} className="flex justify-center">
               <button className="hidden md:block text-white md:text-base 2xl:text-xl font-montserrat font-light">
               {t?.("navigation.about") || "Sobre Nós"}
               </button>
            </Link>
            <Link href={"/imoveis"} className="flex justify-center">
               <button className="hidden md:block text-white md:text-base 2xl:text-xl font-montserrat font-light">
               {t?.("navigation.properties") || "Imóveis"}
               </button>
            </Link>
            <Link
               href={id ? `/historico-agendamentos/${id}` : "/api/auth/signin"}
               className="flex justify-center"
            >
               <button className="hidden md:block text-white md:text-base 2xl:text-xl font-montserrat font-light">
               {t?.("navigation.appointments") || "Agendamentos" }
               </button>
            </Link>
         </div>
         <div className="flex justify-center items-center gap-5 md:gap-10 2xl:gap-20">
            <LanguageSwitcher />
            <Notificacao />
            <Link href={id ? "/chat" : "/api/auth/signin"}>
               <button className="text-white">
                  <MessageCircleMore className="hidden md:block md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            <Link href="/perguntas-frequentes">
               <button className="text-white">
                  <MessageCircleQuestion className="hidden md:block md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            <Link href={id ? `/favoritos/${id}` : "/api/auth/signin"}>
               <button className="text-white">
                  <Heart className="hidden md:block md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            {id ? (
               <PerfilDropdown foto={foto || undefined} id={id} nome={nome} />
            ) : (
               <Link href="/api/auth/signin">
                  <button className="text-white hover:text-opacity-80">
                     <User className="w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
                  </button>
               </Link>
            )}

            <HamburguerButton role={role} />
         </div>
      </div>
   );
};

export default HeaderVermelho;
