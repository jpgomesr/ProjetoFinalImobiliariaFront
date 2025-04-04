import { UserRound } from "lucide-react";
import React from "react";

const FotoUsuarioDeslogado = () => {
   return (
      <div
         className="border border-gray-500 flex justify-center items-center 
                     rounded-full p-2 w-16 h-16 lg:w-24 lg:h-24 2xl:w-28 2xl:h-28"
      >
         <UserRound className="h-12 w-12 lg:w-20 lg:h-16 2xl:w-24 2xl:h-20" />
      </div>
   );
};

export default FotoUsuarioDeslogado;
