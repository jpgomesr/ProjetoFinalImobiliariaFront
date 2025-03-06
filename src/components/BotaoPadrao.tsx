import React, { ReactElement } from "react";

interface BotaoProps {
   texto: string | ReactElement;
   key?: number;
   handler?: () => void;
   className?: string;
   disable?: boolean;
}

const BotaoPadrao = (props: BotaoProps) => {
   return (
      <button
         className={`botao ${props.className ?? "bg-havprincipal text-white"} ${
            props.disable ? "opacity-40" : ""
         }`}
         onClick={props.handler}
         disabled={props.disable}
         key={props.key}
      >
         {props.texto}
      </button>
   );
};

export default BotaoPadrao;
