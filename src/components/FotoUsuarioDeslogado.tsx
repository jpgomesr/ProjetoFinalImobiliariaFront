import { UserRound } from "lucide-react";
import React from "react";

const FotoUsuarioDeslogado = () => {
   return (
      <div className="border-2 border-gray-500 flex justify-center items-center rounded-full h-14 w-16 lg:w-24 lg:h-20 2xl:w-28 2xl:h-24">
         <UserRound className="h-12 w-12 lg:w-20 lg:h-16 2xl:w-24 2xl:h-20" />
      </div>
   );
};

export default FotoUsuarioDeslogado;
