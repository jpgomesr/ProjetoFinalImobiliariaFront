"use client";

import React from "react";
import Link from "next/link";
import { Roles } from "@/models/Enum/Roles";
import { MessageSquareQuote, House, Heart, MessageCircleQuestion, MessageCircleMore, Info, MailQuestion, Calendar, User, UserRoundCheck, BarChart } from "lucide-react";

interface HamburguerProps {
   role?: Roles;
}

const Hamburguer = (props: HamburguerProps) => {
   const opcoesHamburguer = [
      {
         label: "Página inicial",
         icone: <House className="w-5 text-white" />,
         route: "/",
      },
      {
         label: "Perguntas frequêntes",
         icone: <MessageCircleQuestion className="w-5 text-white" />,
         route: "/perguntas-frequentes",
      },
      {
         label: "Favoritos",
         icone: <Heart className="w-5 text-white" />,
         route: "/favoritos",
      },
      {
         label: "Chat",
         icone: <MessageCircleMore className="w-5 text-white" />,
         route: "/chat",
      },
      {
         label: "Sobre nós",
         icone: <Info className="w-5 text-white" />,
         route: "/sobre-nos",
      },
      {
         label: "Imóveis",
         icone: <House className="w-5 text-white" />,
         route: "/",
      },
      {
         label: "Agendamentos",
         icone: <Calendar className="w-5 text-white" />,
         route: "/agendamentos",
      },
   ];

   const opcoesRoles = [
      {
         role: Roles.ADMINISTRADOR,
         title: "Admin",
         items: [
            {
               label: "Gerenciar imóveis",
               route: "/gerenciamento/imoveis",
               icone: <House className="h-5 text-white" />,
            },
            {
               label: "Usuários",
               route: "/gerenciamento/usuarios",
               icone: <User className="h-5 text-white" />,
            },
            {
               label: "Proprietários",
               route: "/gerenciamento/proprietarios",
               icone: <UserRoundCheck className="h-5 text-white" />,
            },
            {
               label: "Relatórios",
               route: "/relatorio",
               icone: <BarChart className="h-5 text-white" />,
            },
            {
               label: "Responder Perguntas",
               route: "/responder-perguntas",
               icone: <MailQuestion className="h-5 text-white" />,
            },
            {
               label: "Perguntas Respondidas",
               route: "/perguntas-respondidas",
               icone: <MessageSquareQuote className="h-5 text-white" />,
            },
         ],
      },
      {
         role: Roles.EDITOR,
         title: "Editor",
         items: [
            {
               label: "Gerenciar imóveis",
               route: "/gerenciamento/imoveis",
               icone: <House className="h-5 text-white" />,
            },
            {
               label: "Proprietários",
               route: "/gerenciamento/proprietarios",
               icone: <UserRoundCheck className="h-5 text-white" />,
            },
            {
               label: "Responder Perguntas",
               route: "/responder-perguntas",
               icone: <MailQuestion className="h-5 text-white" />,
            },
            {
               label: "Perguntas Respondidas",
               route: "/perguntas-respondidas",
               icone: <MessageSquareQuote className="h-5 text-white" />,
            },
         ],
      },
   ];

   const existeRole = opcoesRoles.some((group) => group.role === props.role);

   const renderizeOpcoesHamburguer = () => {
      return opcoesHamburguer.map((botao, key) => (
         <Link href={botao.route} key={key}>
            <button className="flex flex-row gap-1 items-center justify-left">
               {botao.icone}
               <p className="text-base font-bold text-white">{botao.label}</p>
            </button>
         </Link>
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
                     <Link href={item.route}>
                        <button className="flex flex-row gap-1 items-center justify-left">
                           {item.icone}
                           <p className="text-base font-bold text-white">
                              {item.label}
                           </p>
                        </button>
                     </Link>
                  </div>
               ))}
            </div>
         ));
   };

   return (
      <div className="absolute top-[64px] right-0 w-3/4 bg-havprincipal z-50 py-4 px-5 space-y-3">
         <div className="flex flex-col gap-4">
            {renderizeOpcoesHamburguer()}
            {existeRole && renderizeOpcoesRoles()}
         </div>
      </div>
   );
};

export default Hamburguer;
