"use client";

import FavButton from "@/components/FavBotao";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";

interface FavoritoProps {
   favoritado: boolean;
   idImovel: number;
}

const IntermediarioBotaoFavorito = ({
   favoritado,
   idImovel,
}: FavoritoProps) => {
   const [isFavoritado, setIsFavoritado] = useState(favoritado);

   return (
      <SessionProvider>
         <FavButton
            favorited={isFavoritado}
            idImovel={idImovel}
            dark={false}
            setIsFavorited={setIsFavoritado}
            className="w-6 h-6"
         />
      </SessionProvider>
   );
};

export default IntermediarioBotaoFavorito;
