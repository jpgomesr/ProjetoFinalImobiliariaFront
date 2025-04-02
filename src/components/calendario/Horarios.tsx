"use client";

interface HorariosProps {
   horario: string;
   selecionado: boolean;
   onSelecionar: () => void;
   disponivel?: boolean;
}

const Horario = ({
   horario,
   selecionado,
   onSelecionar,
   disponivel = true,
}: HorariosProps) => {

   return (
      <button
         className={`flex justify-center items-center h-7 w-24 rounded-md font-inter lg:w-32 lg:h-10
        ${
           selecionado
              ? "bg-havprincipal text-begepadrao"
              : "bg-white text-havprincipal border-2 border-havprincipal"
        }
        ${
           !disponivel
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-havprincipal hover:text-begepadrao"
        }`}
         onClick={onSelecionar}
         disabled={!disponivel}
      >
         {horario?.split('T')[1].slice(0, 5)}
      </button>
   );
};

export default Horario;
