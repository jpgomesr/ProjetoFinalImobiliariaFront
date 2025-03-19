import React from "react";
import Image from "next/image";
import FotoUsuarioDeslogado from "../FotoUsuarioDeslogado";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import { UserRound } from "lucide-react";

interface CardCorretorProps {
   corretores?: ModelExibirCorretor[];
}

const ExibirCorretores = (props: CardCorretorProps) => {
   return (
      <div className="justify-center flex flex-row gap-4">
         {props.corretores?.map((corretor, i) => (
            <div key={i} className="flex-col rounded-full">
               
               {corretor.foto ? (
                  
                  <Image
                     src={corretor.foto}
                     alt="Imagem corretor"
                     width={1920}
                     height={1080}
                     className="border-2 border-gray-500 flex justify-center items-center rounded-full h-14 w-16 lg:w-24 lg:h-20 2xl:w-28 2xl:h-24"
                  />
               ) : (
                  <FotoUsuarioDeslogado />
               )}
               {corretor.nome}
               
            </div>
         ))}
      </div>
   );
};

export default ExibirCorretores;