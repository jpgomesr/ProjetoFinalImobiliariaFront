import React, { ReactElement } from "react";

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   texto: string | ReactElement;
   handler?: () => void;
   className?: string;
   disable?: boolean;
}

const BotaoCalendario = (props: BotaoProps) => {
   return (
      <button
         className={`botao-2 ${
            props.className ?? "bg-havprincipal text-white"
         } ${props.disable ? "opacity-40" : ""}`}
         onClick={props.handler}
         disabled={props.disable}
      >
         {props.texto}
      </button>
   );
};

export default BotaoCalendario;
