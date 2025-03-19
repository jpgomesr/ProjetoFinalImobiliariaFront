interface CardInfoSobrenosProps {
   imagemSrc: any;
   titulo: string;
   altImagem: string;
}

import Image from "next/image";
import React from "react";

const CardInfoSobrenos = (props: CardInfoSobrenosProps) => {
   return (
      <div className="bg-havprincipal p-1 w-40 h-40 lg:w-2/12 lg:h-48">
         <div className="border-white border-2 w-full h-full text-begepadrao flex flex-col  items-center gap-2 pt-5">
            <Image
               src={props.imagemSrc}
               alt={props.altImagem}
               width={1920}
               height={1080}
               className="w-12 h-12"
            />
            <div>{props.titulo}</div>
         </div>
      </div>
   );
};

export default CardInfoSobrenos;