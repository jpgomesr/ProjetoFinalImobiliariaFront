"use client";

import { useState } from "react";
import Heart from "../svg/icons/CoracaoIcon";

interface HomeProps {
   favorited: boolean;
   dark: boolean;
}

export default function FavButton({ favorited, dark }: HomeProps) {
   const [isFavorited, setIsFavorited] = useState(favorited);

   const handleChangeFav = () => {
      setIsFavorited((prevState) => !prevState);
   };

   return (
      <button
         className="flex items-center justify-center"
         onClick={handleChangeFav}
      >
         {<Heart favorited={isFavorited} height={15} width={15} dark={dark} />}
      </button>
   );
}
