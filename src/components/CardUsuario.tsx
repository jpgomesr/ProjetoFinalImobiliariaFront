import React, { useEffect, useState } from "react";
import { Trash, UserRound } from "lucide-react";
import FotoUsuarioDeslogado from "./FotoUsuarioDeslogado";
import BotaoPadrao from "./BotaoPadrao";
import Image from "next/image";
import { UseFetchDelete } from "@/hooks/UseFetchDelete";
import Link from "next/link";

interface CardUsuarioProps {
   id: number;
   nome: string;
   email: string;
   tipoConta: string;
   status: string;
   imagem?: string;
   deletarUsuario: (id: number) => void;
}

const CardUsuario = (props: CardUsuarioProps) => {
   return (
      <div
         className="border bg-brancoEscurecido border-gray-700 rounded-md shadow-[4px_4px_4px_rgba(0,0,0,0.2)]  relative
         py-2 px-2 flex gap-3 w-full max-w-full
         lg:py-4 lg:px-4 lg:rounded-lg
         2xl:rounded-xl"
      >
         <div
            className="absolute top-[-10px] right-[-10px] bg-havprincipal  p-1 rounded-full cursor-pointer"
            onClick={() => props.deletarUsuario(props.id)}
         >
            <Trash className="text-white" />
         </div>

         {props.imagem ? (
            <Image
               src={props.imagem}
               alt="Imagem usuario"
               width={1920}
               height={1080}
               className="flex justify-center border-2 border-gray-500 items-center rounded-full h-16 w-16 lg:w-20 lg:h-20 2xl:w-28 2xl:h-28"
            />
         ) : (
            <FotoUsuarioDeslogado />
         )}

         <div className="flex flex-col w-full min-w-0">
            <p className="text-sm font-bold lg:text-xl">Informações</p>

            <div className="flex flex-col text-xs md:flex-row md:gap-4 lg:text-sm 2xl:text-base min-w-0">
               <div className="flex flex-col justify-between w-fit min-w-0">
                  <p className="truncate min-w-0 max-w-32 md:max-w-40 xl:max-w-44 2xl:max-w-64">
                     Nome: {props.nome}
                  </p>
                  <p className="truncate min-w-0 max-w-32 md:max-w-40 xl:max-w-44 2xl:max-w-64">
                     Email: {props.email}
                  </p>
               </div>
               <div className="flex flex-col justify-between w-fit min-w-0">
                  <p className="truncate min-w-0 max-w-32 md:max-w-40 xl:max-w-44">
                     Status: {props.status}
                  </p>
                  <p className="truncate min-w-0 max-w-32 md:max-w-40 xl:max-w-44 2xl:max-w-64">
                     Tipo conta: {props.tipoConta}
                  </p>
               </div>
            </div>

            <div
               className="flex flex-wrap justify-start max-w-full mt-1 gap-2 text-xs w-full
               md:flex-row  md:gap-4 
               lg:justify-center lg:text-sm 2xl:text-base 2xl:max-w-96 2xl:gap-8 2xl:mt-3"
            >
               <Link href={`/usuarios/edicao/${props.id}`}>
                  <button className="bg-white border-black border rounded-md px-2 py-1">
                     Editar usuário
                  </button>
               </Link>

               <button className="bg-white border-black border rounded-md px-2 py-1">
                  Enviar comunicado
               </button>
            </div>
         </div>
      </div>
   );
};

export default CardUsuario;
