import React from "react";

interface BotaoProps  extends React.ButtonHTMLAttributes<HTMLButtonElement>{
   texto: string;
   className?: string;
}

const BotaoPadrao = ({texto, disabled, ...props}: BotaoProps) => {
   return (
      <button
      {...props}
      disabled={disabled} // Adicione esta linha
      className={`botao ${props.className ?? "bg-havprincipal text-white"} ${disabled ? "opacity-40": ""}`}
   >
      {texto}
   </button>
   );
};

export default BotaoPadrao;
