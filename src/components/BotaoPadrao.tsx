import React from "react";

interface BotaoProps {
   texto: string;
   handler?: ( e?:any) => void;
   className?: string;
   disable?:boolean
}

const BotaoPadrao = (props: BotaoProps) => {
   return (
      <button
         className={`botao ${props.className ?? "bg-havprincipal text-white"} ${props.disable ? "opacity-40": ""}`}
         onClick={props.handler}
         disabled={props.disable}
      >
         {props.texto}
      </button>
   );
};

export default BotaoPadrao;
