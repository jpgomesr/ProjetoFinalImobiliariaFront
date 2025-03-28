"use client"

import React from "react";
import { useState } from "react";
import { LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import { Roles } from "@/models/Enum/Roles";
import CasaIcon from "@/svg/icons/header/CasaIcon";
import PerfilIcon from "@/svg/icons/header/PerfilIcon";
import CorretoresIcon from "@/svg/icons/header/CorretoresIcon";
import RelatoriosIcon from "@/svg/icons/header/RelatoriosIcon";

interface FuncoesHeaderProps {
   role?: Roles;
}

const FuncoesHeader = (props: FuncoesHeaderProps) => {
   const [isFuncVisible, setIsFuncVisible] = useState(false);

   const opcoesRole = [
      {
         role: Roles.ADMINISTRADOR,
         title: "Admin",
         items: [
            {
               label: "Gerenciar imóveis",
               route: "/gerenciamento/imoveis",
               icone: <CasaIcon className="h-5" />,
            },
            {
               label: "Usuários",
               route: "/gerenciamento/usuarios",
               icone: <PerfilIcon className="h-5" />,
            },
            {
               label: "Proprietários",
               route: "/gerenciamento/proprietarios",
               icone: <CorretoresIcon className="h-5" />,
            },
            {
               label: "Relatórios",
               route: "/",
               icone: <RelatoriosIcon className="h-5" />,
            },
         ],
      },
      {
         role: Roles.EDITOR,
         title: "Editor",
         items: [
            {
               label: "Gerenciar imóveis",
               route: "/imoveis",
               icone: <CasaIcon className="h-5" />,
            },
            {
               label: "Proprietários",
               route: "/",
               icone: <CorretoresIcon className="h-5" />,
            },
         ],
      },
   ];

   const handleOpcoes = (e: any) => {
      e.preventDefault();
      setIsFuncVisible(!isFuncVisible);
   };

   const existeRole = opcoesRole.some((group) => group.role === props.role);

   const renderizeOpcoes = () => {
      return opcoesRole
         .filter((group) => group.role === props.role)
         .map((group, index) => (
            <div key={index} className="flex flex-col items-start gap-4">
               <p
                  className="text-center w-full text-white text-base font-semibold font-inter
                            2xl:text-xl"
               >
                  Funções {group.title}
               </p>
               {group.items.map((item, idx) => (
                  <div
                     className="flex flex-row w-full gap-4 items-center"
                     key={idx}
                  >
                     <Link href={item.route}>
                        <button className="font-inter text-white font-light 2xl:text-xl">
                           {item.label}
                        </button>
                     </Link>
                     {item.icone}
                  </div>
               ))}
            </div>
         ));
   };

   if (!props.role || !existeRole) {
      return <div className="hidden"></div>;
   }

   return (
      <div className="hidden md:flex">
         <button
            onClick={handleOpcoes}
            className="flex justify-center items-center w-7 2xl:w-8"
         >
            {isFuncVisible ? (
               <X className="text-white w-full h-7 2xl:h-8" />
            ) : (
               <LayoutGrid className="text-white w-full h-7 2xl:h-8" />
            )}
         </button>
         {isFuncVisible && (
            <div
               className="absolute top-20 left-0 bg-havprincipal w-4/12 flex flex-col pt-4 pb-10 px-9 z-50
                            xl:w-3/12 
                            2xl:w-3/12 2xl:top-[120px]"
            >
               <div className="absolute inset-x-0 bottom-2 h-[1px] bg-white" />
               <div className="absolute inset-y-0 right-2 w-[1px] bg-white" />
               {renderizeOpcoes()}
            </div>
         )}
      </div>
   );
};

export default FuncoesHeader;