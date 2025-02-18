"use client";

import Heart from "../svg/icons/CoracaoIcon";

interface HomeProps {
   favorited: boolean;
}

export default function FavButton({ favorited }: HomeProps) {
   const handleChangeFav = () => {
      favorited = !favorited;
   };

   return (
      <button
         className="flex items-center justify-center"
         onClick={handleChangeFav}
      >
         {<Heart favorited={favorited} height={15} width={15} />}
      </button>
   );
}
