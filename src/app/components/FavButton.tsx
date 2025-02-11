"use client";

import Heart from "../icons/Heart";

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
         {<Heart favorited={favorited} />}
      </button>
   );
}
