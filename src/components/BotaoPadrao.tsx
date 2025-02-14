import React from "react";

interface BotaoProps {
   texto: string;
   handler?: () => void;
}

const BotaoPadrao = (props: BotaoProps) => {
   return (
      <button
         className="px-3 py-2 bg-havprincipal opacity-90 rounded-md text-xs
          text-white lg:hover:opacity-100"
         onClick={props.handler}
      >
         {props.texto}
      </button>
   );
};

export default BotaoPadrao;
