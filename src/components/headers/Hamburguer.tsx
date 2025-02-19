import React from "react";
import CasaIcon from "../../svg/icons/header/CasaIcon";
import FaqIcon from "../../svg/icons/header/FaqIcon";
import FavIcon from "../../svg/icons/header/FavIcon";
import ChatIcon from "../../svg/icons/header/ChatIcon";
import SobreNosIcon from "../../svg/icons/header/SobreNosIcon";
import ImoveisIcon from "../../svg/icons/header/ImoveisIcon";
import AgendamentoIcon from "../../svg/icons/header/AgendamentoIcon";
import { useRouter } from "next/navigation";

const Hamburguer = () => {
   const router = useRouter();

   return (
      <div className="absolute top-[64px] right-0 w-3/4 bg-havprincipal z-50 py-4 px-5 space-y-3">
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/")}
         >
            <CasaIcon className="w-5 h-[17px]" />
            <p className="text-lg font-bold text-white">Página inicial</p>
         </button>
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/perguntas-frequentes")}
         >
            <FaqIcon className="w-5 h-5" />
            <p className="text-lg font-bold text-white text-left">
               Perguntas frequêntes
            </p>
         </button>
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/favoritos")}
         >
            <FavIcon className="w-5 h-[18px]" />
            <p className="text-lg font-bold text-white">Favoritos</p>
         </button>
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/chat")}
         >
            <ChatIcon className="w-5 h-[18px]" />
            <p className="text-lg font-bold text-white">Chats</p>
         </button>
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/sobre-nos")}
         >
            <SobreNosIcon className="w-5 h-[15px]" />
            <p className="text-lg font-bold text-white">Sobre nós</p>
         </button>
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/imoveis")}
         >
            <ImoveisIcon className="w-5 h-5" />
            <p className="text-lg font-bold text-white">Imóveis</p>
         </button>
         <button
            className="flex flex-row gap-1 items-center justify-left"
            onClick={() => router.push("/agendamentos")}
         >
            <AgendamentoIcon className="w-5 h-5" />
            <p className="text-lg font-bold text-white">Agendamentos</p>
         </button>
      </div>
   );
};

export default Hamburguer;
