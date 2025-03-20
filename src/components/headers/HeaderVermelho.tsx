"use client";

import React, { useState } from "react";
import Link from "next/link";
import Hamburguer from "./Hamburguer";
import { Roles } from "@/models/Enum/Roles";
import LogoHavClaro from "@/svg/icons/logo/LogoHavClaro";
import ChatIcon from "@/svg/icons/header/ChatIcon";
import FaqIcon from "@/svg/icons/header/FaqIcon";
import FavIcon from "@/svg/icons/header/FavIcon";
import PerfilIcon from "@/svg/icons/header/PerfilIcon";
import MenuHamburguer from "@/svg/icons/header/MenuHamburguer";
import XIcon from "@/svg/icons/header/XIcon";
import FuncoesHeader from "./FuncoesHeader";
import LoginModal from "../auth/modal/LoginModal";
import RegisterModal from "../auth/modal/RegisterModal";

interface HeaderVermelhoProps {
   role?: Roles;
}

const HeaderVermelho = ({ role }: HeaderVermelhoProps) => {
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
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
            <LogoHavClaro
               className="w-14 h-14 2xl:w-20 2xl:h-20"
               visible={true}
            />
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

            <button
               onClick={() => setIsLoginModalOpen(true)}
               className="text-white hover:text-opacity-80"
            >
               <PerfilIcon className="w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8" />
            </button>

            <div
               onClick={handleHamburguer}
               className="cursor-pointer md:hidden"
            >
               {!isHamburguerVisible ? (
                  <MenuHamburguer width={23} height={15} />
               ) : (
                  <div>
                     <XIcon width={23} height={23} />
                     {role && <Hamburguer role={role} />}
                  </div>
               )}
            </div>
         </div>

         {(isLoginModalOpen || isRegisterModalOpen) && (
            <div className="fixed inset-0 bg-black/50 z-30 w-full h-full py-10 px-24">
               {isLoginModalOpen ? (
                  <LoginModal
                     onClose={() => setIsLoginModalOpen(false)}
                     onRegister={() => {
                        setIsLoginModalOpen(false);
                        setIsRegisterModalOpen(true);
                     }}
                  />
               ) : (
                  <RegisterModal
                     onClose={() => setIsRegisterModalOpen(false)}
                     onLogin={() => {
                        setIsLoginModalOpen(true);
                        setIsRegisterModalOpen(false);
                     }}
                  />
               )}
            </div>
         )}
      </div>
   );
};

export default HeaderVermelho;
