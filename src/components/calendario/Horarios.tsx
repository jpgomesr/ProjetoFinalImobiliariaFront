import React from "react";

interface HorariosProps {
   horario: string;
   selecionado: boolean;
   onSelecionar: () => void;
}

const Horarios = ({ horario, selecionado, onSelecionar }: HorariosProps) => {
   return (
      <>
         <div
            className={`flex w-20 hover:opacity-100 h-7 items-center rounded-lg justify-center text-begepadrao font-montserrat cursor-pointer transition-all ${
               selecionado
                  ? "bg-havprincipal text-white"
                  : "bg-havprincipal opacity-75"
            }`}
            onClick={onSelecionar}
         >
            {horario}
         </div>
      </>
   );
};

export default Horarios;
