"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

interface ModalAgendamentoProps {
   dataFormatadaCapitalizada: string;
   horarioSelecionado: string | null;
   onClose: () => void;
}

const ModalAgendamento = ({
   dataFormatadaCapitalizada,
   horarioSelecionado,
   onClose,
}: ModalAgendamentoProps) => {
   const { showNotification } = useNotification();

   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
         <div className="bg p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-80 md:w-96 lg:w-[28rem] text-center bg-white">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold flex justify-center">
               Corretor xxx
            </h2>
            <div className="grid grid-cols-[auto,1fr] gap-2 md:gap-3 items-center justify-center mt-2 md:mt-3 lg:mt-4">
               <CalendarDays className="h-5 md:h-6 lg:h-7 w-5 md:w-6 lg:w-7" />
               <p className="text-left md:text-lg lg:text-xl">
                  {dataFormatadaCapitalizada}
               </p>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-2 md:gap-3 items-center justify-items-start mt-2 md:mt-3 lg:mt-4">
               <Clock className="h-5 md:h-6 lg:h-7 w-5 md:w-6 lg:w-7" />
               <p className="text-left md:text-lg lg:text-xl">
                  Você agendou para {horarioSelecionado}
               </p>
            </div>
            <button
               className="mt-4 md:mt-6 lg:mt-8 bg-havprincipal text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-md md:text-lg lg:text-xl"
               onClick={() => {
                  onClose();
                  showNotification("Agendado com sucesso!");
                  scrollToTop();
               }}
            >
               Concluir
            </button>
         </div>
      </div>
   );
};

export default ModalAgendamento;
