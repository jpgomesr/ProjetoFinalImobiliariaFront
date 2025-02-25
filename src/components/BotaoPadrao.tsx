import React from "react";

interface BotaoProps {
   texto: string;
   handler?: () => void;
   className?: string;
}

const BotaoPadrao = (props: BotaoProps) => {
   return (
      <button
         className={`botao ${props.className ?? "bg-havprincipal text-white"}`}
         onClick={props.handler}
      >
         {props.texto}
      </button>
   );
};

export default BotaoPadrao;
