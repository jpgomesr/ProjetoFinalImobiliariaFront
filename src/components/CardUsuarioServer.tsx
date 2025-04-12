"use client"
import React from "react";
import FotoUsuarioDeslogado from "./FotoUsuarioDeslogado";
import Image from "next/image";
import CardUsuarioActions from "./CardUsuarioActions";
import { useLanguage } from "@/context/LanguageContext";

interface CardUsuarioServerProps {
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
   deletarUsuario: (id: number) => void;
}

const CardUsuarioServer = (props: CardUsuarioServerProps) => {
   const { t } = useLanguage();

   const formatarTerceiroValor = (valor: string): string => {
      if (valor.length === 11) {
         return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }
      if (valor.length === 10) {
         return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
      return valor;
   };

   const formatarQuartoValor = (valor: any): string => {
      if (typeof valor === "string" && valor.length === 11 && /^\d+$/.test(valor)) {
         return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      }
      return String(valor);
   };

   return (
      <div
         className="border bg-brancoEscurecido border-gray-700 rounded-md shadow-[4px_4px_4px_rgba(0,0,0,0.2)] relative
         py-2 px-2 flex gap-3 w-full max-w-full
         lg:py-4 lg:px-4 lg:rounded-lg
         2xl:rounded-xl"
      >
         <div className="flex justify-center items-center">
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
         </div>

         <div className="flex flex-col w-full min-w-0">
            <CardUsuarioActions
               id={props.id}
               linkEdicao={props.linkEdicao}
               deletarUsuario={props.deletarUsuario}
               showTitle={true}
            />
            
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
                     {props.labelTerceiroValor + " " + formatarTerceiroValor(props.terceiroValor)}
                  </p>
                  <p className="truncate max-w-full">
                     {props.labelQuartoValor + " " + formatarQuartoValor(props.quartoValor)}
                  </p>
               </div>
            </div>

            <CardUsuarioActions
               id={props.id}
               linkEdicao={props.linkEdicao}
               deletarUsuario={props.deletarUsuario}
               showTitle={false}
            />
         </div>
      </div>
   );
};

export default CardUsuarioServer; 