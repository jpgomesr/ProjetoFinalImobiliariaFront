"use client";

import LogoHavClaro from "../../svg/icons/logo/LogoHavClaro";
import PerfilIcon from "../../svg/icons/header/PerfilIcon";
import MenuHamburguer from "../../svg/icons/header/MenuHamburguer";
import XIcon from "../../svg/icons/header/XIcon";
import { useState } from "react";
import Hamburguer from "./Hamburguer";
import FavIcon from "@/svg/icons/header/FavIcon";
import FaqIcon from "@/svg/icons/header/FaqIcon";
import ChatIcon from "@/svg/icons/header/ChatIcon";
import FuncoesHeader from "./FuncoesHeader";
import { Roles } from "@/models/Enum/Roles";
import Link from "next/link";

interface HeaderVermelhoProps {
   role?: Roles;
}

export default function HeaderVermelho(props: HeaderVermelhoProps) {
   const [isHamburguerVisible, setIsHamburguerVisible] = useState(false);

   const handleHamburguer = (e: any) => {
      e.preventDefault();

      setIsHamburguerVisible(!isHamburguerVisible);
   };

   return (
      <div
         className="bg-havprincipal px-6 py-1
                     md:px-10 md:py-3 
                     2xl:px-20 2xl:py-5 
                     flex justify-between"
      >
         <div className="flex flex-row md:gap-14 2xl:gap-28">
            <FuncoesHeader role={Roles.ADMIN} />
            <Link href={"/"}>
               <LogoHavClaro
                  className="w-14 h-14 2xl:w-20 2xl:h-20"
                  visible={true}
               />
            </Link>
            <Link href={"/"} className="flex justify-center">
               <button className="hidden md:block text-white md:text-base 2xl:text-xl font-montserrat font-light">
                  Página inicial
               </button>
            </Link>
            <Link href={"/sobre-nos"} className="flex justify-center">
               <button className="hidden md:block text-white md:text-base 2xl:text-xl font-montserrat font-light">
                  Sobre nós
               </button>
            </Link>
         </div>
         <div className="flex justify-center items-center gap-5 md:gap-10 2xl:gap-20">
            <Link href="/chat">
               <button>
                  <ChatIcon className="hidden md:block md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            <Link href="/perguntas-frequentes">
               <button>
                  <FaqIcon className="hidden md:block md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            <Link href="/favoritos">
               <button>
                  <FavIcon className="hidden md:block md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            <Link href="/perfil">
               <button>
                  <PerfilIcon className="w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
               </button>
            </Link>
            <div
               onClick={handleHamburguer}
               className="cursor-pointer md:hidden"
            >
               {!isHamburguerVisible ? (
                  <MenuHamburguer width={23} height={15} />
               ) : (
                  <div>
                     <XIcon width={23} height={23} />
                     <Hamburguer role={props.role} />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
