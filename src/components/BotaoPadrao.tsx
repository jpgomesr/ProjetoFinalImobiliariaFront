import React from "react";

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   texto: string | React.ReactElement;
   className?: string;
}

const BotaoPadrao = ({ texto, disabled, className, ...props }: BotaoProps) => {
   return (
      <button
         {...props}
         className={`botao ${className ?? "bg-havprincipal text-white"} ${
            disabled ? "opacity-40" : ""
         }`}
         disabled={disabled}
      >
         {texto}
      </button>
   );
};

export default BotaoPadrao;
