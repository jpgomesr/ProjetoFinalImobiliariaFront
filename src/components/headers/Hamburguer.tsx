import React from "react";
import CasaIcon from "@/svg/icons/header/CasaIcon";
import FaqIcon from "@/svg/icons/header/FaqIcon";
import FavIcon from "@/svg/icons/header/FavIcon";
import ChatIcon from "@/svg/icons/header/ChatIcon";
import SobreNosIcon from "@/svg/icons/header/SobreNosIcon";
import ImoveisIcon from "@/svg/icons/header/ImoveisIcon";
import AgendamentoIcon from "@/svg/icons/header/AgendamentoIcon";
import PerfilIcon from "@/svg/icons/header/PerfilIcon";
import CorretoresIcon from "@/svg/icons/header/CorretoresIcon";
import RelatoriosIcon from "@/svg/icons/header/RelatoriosIcon";
import { useRouter } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";

interface HamburguerProps {
   role: Roles;
}

const Hamburguer = (props: HamburguerProps) => {
   const router = useRouter();

   const opcoesHamburguer = [
      {
         label: "Página inicial",
         icone: <CasaIcon className="w-5" />,
         route: "/",
      },
      {
         label: "Perguntas frequêntes",
         icone: <FaqIcon className="w-5" />,
         route: "/perguntas-frequentes",
      },
      {
         label: "Favoritos",
         icone: <FavIcon className="w-5" />,
         route: "/favoritos",
      },
      {
         label: "Chat",
         icone: <ChatIcon className="w-5" />,
         route: "/chat",
      },
      {
         label: "Sobre nós",
         icone: <SobreNosIcon className="w-5" />,
         route: "/sobre-nos",
      },
      {
         label: "Imóveis",
         icone: <ImoveisIcon className="w-5" />,
         route: "/imoveis",
      },
      {
         label: "Agendamentos",
         icone: <AgendamentoIcon className="w-5" />,
         route: "/agendamentos",
      },
   ];

   const opcoesRoles = [
      {
         role: Roles.ADMIN,
         title: "Admin",
         items: [
            {
               label: "Gerenciar imóveis",
               route: "/chat",
               icone: <CasaIcon className="h-5" />,
            },
            {
               label: "Usuários",
               route: "/",
               icone: <PerfilIcon className="h-5" />,
            },
            {
               label: "Proprietários",
               route: "/",
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
               route: "/chat",
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

   const existeRole = opcoesRoles.some((group) => group.role === props.role);

   const renderizeOpcoesHamburguer = () => {
      return opcoesHamburguer.map((botao, key) => (
         <button
            key={key}
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push(botao.route)}
         >
            {botao.icone}
            <p className="text-base font-bold text-white">{botao.label}</p>
         </button>
      ));
   };

   const renderizeOpcoesRoles = () => {
      return opcoesRoles
         .filter((group) => group.role == props.role)
         .map((group, index) => (
            <div key={index} className="flex flex-col items-start gap-4">
               <p className="text-center w-full text-white text-lg font-semibold font-inter">
                  Funções {group.title}
               </p>
               {group.items.map((item, idx) => (
                  <div
                     className="flex flex-row w-full gap-4 items-center"
                     key={idx}
                  >
                     <button
                        className="flex flex-row gap-1 items-center justify-left"
                        onClick={() => router.push(item.route)}
                     >
                        {item.icone}
                        <p className="text-base font-bold text-white">
                           {item.label}
                        </p>
                     </button>
                  </div>
               ))}
            </div>
         ));
   };

   return (
      <div className="absolute top-[64px] right-0 w-3/4 bg-havprincipal z-50 py-4 px-5 space-y-3">
         {renderizeOpcoesHamburguer()}
         {existeRole && renderizeOpcoesRoles()}
      </div>
   );
};

export default Hamburguer;
