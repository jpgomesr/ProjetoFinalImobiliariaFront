"use client";

import React from "react";
import Link from "next/link";

interface ButtonMapaProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   texto: string | React.ReactElement;
   className?: string;
   href?: string;
}

const ButtonMapa = ({ texto, href, className, ...props }: ButtonMapaProps) => {
   if (href) {
      return (
         <Link
            href={href}
            className={`botao ${className ?? "bg-white text-havprincipal"}`}
         >
            {texto}
         </Link>
      );
   }

   return (
      <button
         {...props}
         className={`botao ${className ?? "bg-white text-havprincipal"}`}
      >
         {texto}
      </button>
   );
};

export default ButtonMapa;
