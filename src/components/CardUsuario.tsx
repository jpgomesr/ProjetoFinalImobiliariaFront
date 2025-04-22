"use client";
import { useLanguage } from "@/context/LanguageContext";
import CardUsuarioServer from "./CardUsuarioServer";
import { obterNomeRole, RolesDisplay } from "@/models/Enum/Roles";
import { Roles } from "@/models/Enum/Roles";
import FotoUsuarioDeslogado from "./FotoUsuarioDeslogado";
import { RotateCcw, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ModalComunicado from "./ModalComunicado";

interface CardUsuarioProps {
   id: number;
   labelPrimeiroValor: string;
   primeiroValor: string;
   labelSegundoValor: string;
   segundoValor: string;
   labelTerceiroValor: string;
   terceiroValor: string;
   labelQuartoValor: string;
   quartoValor: string | { [key: string]: string } | any;
   imagem?: string;
   linkEdicao: string;
   ativo: boolean;
   deletarUsuario: (id: number) => void;
   restaurarUsuario: (id: number) => void;
   token: string;
   email: string;
   nome: string;
}

const CardUsuario = (props: CardUsuarioProps) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const formatarTerceiroValor = (valor: string): string => {
      if (valor.length === 11) {
         // Formatação de telefone: (XX) XXXXX-XXXX
         return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }
      if (valor.length === 10) {
         // Formatação de telefone: (XX) XXXXX-XXXX
         return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
      return valor;
   };

   // Função para formatar o valor, tratando enums ou outros tipos de objetos
   const formatarQuartoValor = (valor: any): string => {
      if (typeof valor === "object" && valor !== null) {
         // Se for um objeto (como um enum), tenta extrair o valor legível
         if (
            valor.hasOwnProperty("name") &&
            RolesDisplay[valor.name as Roles]
         ) {
            return RolesDisplay[valor.name as Roles];
         }
         return obterNomeRole(valor);
      }
      // Verifica se é uma string que corresponde a uma role
      if (
         typeof valor === "string" &&
         Object.values(Roles).includes(valor as Roles)
      ) {
         return RolesDisplay[valor as Roles] || valor;
      }
      if (
         typeof valor === "string" &&
         valor.length === 11 &&
         /^\d+$/.test(valor)
      ) {
         // Formata CPF: XXX.XXX.XXX-XX
         return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      }
      return String(valor);
   };

   return (
      <>
         <div
            className="border bg-brancoEscurecido border-gray-700 rounded-md shadow-[4px_4px_4px_rgba(0,0,0,0.2)]  relative
            py-2 px-2 flex gap-3 w-full max-w-full
            lg:py-4 lg:px-4 lg:rounded-lg
            2xl:rounded-xl"
         >
            {props.ativo ? (
               <div
                  className="absolute top-[-10px] right-[-10px] bg-havprincipal  p-1 rounded-full cursor-pointer"
                  onClick={() => props.deletarUsuario(props.id)}
               >
                  <Trash className="text-white" />
               </div>
            ) : (
               <div
                  className="absolute top-[-10px] right-[-10px] bg-havprincipal  p-1 rounded-full cursor-pointer"
                  onClick={() => props.restaurarUsuario(props.id)}
               >
                  <RotateCcw className="text-white" />
               </div>
            )}

            <div className="flex justify-center items-center">
               {props.imagem ? (
                  <div className="flex justify-center border-2 border-gray-500 items-center rounded-full h-16 w-16 lg:w-24 lg:h-24 2xl:w-28 2xl:h-28">
                     <Image
                        src={props.imagem}
                        alt="Imagem usuario"
                        width={1920}
                        height={1080}
                        className="flex justify-center  border-gray-500 items-center rounded-full h-16 w-16 lg:w-24 lg:h-24 2xl:w-28 2xl:h-28"
                     />
                  </div>
               ) : (
                  <FotoUsuarioDeslogado />
               )}
            </div>

            <div className="flex flex-col w-full min-w-0">
               <p className="text-sm font-bold lg:text-xl">Informações</p>

               <div className="flex flex-col text-xs md:flex-row md:gap-4 lg:text-sm 2xl:text-base min-w-0 justify-between">
                  <div className="flex flex-col justify-between min-w-0 w-full">
                     <p className="truncate max-w-full">
                        {props.labelPrimeiroValor + " " + props.primeiroValor}{" "}
                     </p>
                     <p className="truncate max-w-full">
                        {props.labelSegundoValor + " " + props.segundoValor}
                     </p>
                  </div>
                  <div className="flex flex-col justify-between min-w-0 w-full">
                     <p className="truncate max-w-full">
                        {props.labelTerceiroValor +
                           " " +
                           formatarTerceiroValor(props.terceiroValor)}
                     </p>
                     <p className="truncate max-w-full">
                        {props.labelQuartoValor +
                           " " +
                           formatarQuartoValor(props.quartoValor)}
                     </p>
                  </div>
               </div>

               <div
                  className="flex flex-wrap justify-start max-w-full mt-1 gap-2 text-xs w-full
                  md:flex-row  md:gap-4 
                  lg:justify-center lg:text-sm 2xl:text-base 2xl:max-w-96 2xl:gap-8 2xl:mt-3"
               >
                  <Link href={props.linkEdicao}>
                     <button className="bg-white border-black border rounded-md px-2 py-1">
                        Editar usuário
                     </button>
                  </Link>

                  <button
                     onClick={() => setIsModalOpen(true)}
                     className="bg-white border-black border rounded-md px-2 py-1"
                  >
                     Enviar comunicado
                  </button>
               </div>
            </div>
         </div>

         <ModalComunicado
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userId={props.id}
            token={props.token}
            email={props.email}
            nome={props.nome}
         />
      </>
   );
};

export default CardUsuario;
