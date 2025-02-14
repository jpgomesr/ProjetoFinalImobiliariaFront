import React from "react";

interface BotaoProps {
   texto: string;
   handler?: () => void;
}

const BotaoPadrao = (props: BotaoProps) => {
   return (
      <button
         className="botao bg-havprincipal text-white"
         onClick={props.handler}
      >
         {props.texto}
      </button>
   );
};

export default BotaoPadrao;
