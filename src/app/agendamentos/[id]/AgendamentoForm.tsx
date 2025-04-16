"use client";

import { useState, useEffect } from "react";
import { Calendario } from "@/components/calendario/Calendario";
import Horario from "@/components/calendario/Horarios";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ModalAgendamento from "./ModalAgendamento";
import {
   buscarHorariosDisponiveis,
   HorarioDisponivel,
} from "@/Functions/agendamento/buscaHorarios";

interface AgendamentoFormProps {
   id: string;
   idUsuario: number | undefined;
}

const AgendamentoForm = ({ id, idUsuario }: AgendamentoFormProps) => {
   const [horarioSelecionado, setHorarioSelecionado] =
      useState<HorarioDisponivel | null>(null);
   const [mostrarModal, setMostrarModal] = useState(false);
   const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
   const [horariosDisponiveis, setHorariosDisponiveis] = useState<
      HorarioDisponivel[]
   >([]);
   const [carregando, setCarregando] = useState(false);

   const handleSelecionarHorario = (horario: HorarioDisponivel) => {
      setHorarioSelecionado(horario);
   };

   const handleSelecionarData = async (data: Date) => {
      setDataSelecionada(data);
      setCarregando(true);

      try {
         const dataFormatada = format(data, "yyyy-MM-dd");
         const horarios = await buscarHorariosDisponiveis(dataFormatada, id);
         setHorariosDisponiveis(horarios);
      } catch (error) {
         console.error("Erro ao buscar horários:", error);
      } finally {
         setCarregando(false);
      }
   };

   const dataFormatada = dataSelecionada
      ? format(dataSelecionada, "EEEE, dd 'de' MMMM", { locale: ptBR })
      : "";
   const dataFormatadaCapitalizada = dataFormatada
      ? dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)
      : "";

   const handleAgendar = () => {
      if (horarioSelecionado) {
         setMostrarModal(true);
      }
   };

   useEffect(() => {
      handleSelecionarData(dataSelecionada);
   }, []);

   return (
      <>
         <div className="w-full px-4 md:px-6 lg:px-8 flex-grow flex flex-col">
            <div className="bg-havprincipal w-full md:max-w-[600px] lg:max-w-[700px] mx-auto rounded-xl flex-grow flex flex-col overflow-hidden">
               <div className="flex gap-2 items-center justify-center text-begepadrao pt-2 px-4">
                  <CalendarDays className="h-5 md:h-6 lg:h-7 w-5 md:w-6 lg:w-7" />
                  <span className="text-sm md:text-base lg:text-lg text-left">
                     {dataFormatadaCapitalizada}
                  </span>
               </div>
               <Calendario onDateSelect={handleSelecionarData} />
            </div>
         </div>
         <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl md:text-2xl lg:text-3xl text-center my-4 md:my-6 lg:my-8">
            <h2>Horários</h2>
         </div>
         <div className="grid grid-rows-2 gap-7">
            {carregando ? (
               <div className="text-center">Carregando horários...</div>
            ) : (
               <>
                  <div className="grid grid-cols-4 gap-2 lg:gap-16">
                     {horariosDisponiveis.slice(0, 4).map((horario) => (
                        <Horario
                           key={horario.id}
                           horario={horario.dataHora}
                           selecionado={horarioSelecionado?.id === horario.id}
                           onSelecionar={() => handleSelecionarHorario(horario)}
                           disponivel={horario.disponivel}
                        />
                     ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2 lg:gap-16">
                     {horariosDisponiveis.slice(4).map((horario) => (
                        <Horario
                           key={horario.id}
                           horario={horario.dataHora}
                           selecionado={horarioSelecionado?.id === horario.id}
                           onSelecionar={() => handleSelecionarHorario(horario)}
                           disponivel={horario.disponivel}
                        />
                     ))}
                  </div>
                  {horarioSelecionado && (
                     <div className="flex justify-center">
                        <button
                           className="bg-havprincipal/90 flex justify-center items-center h-7 w-24 rounded-md font-inter lg:w-32 lg:h-10 text-begepadrao"
                           onClick={handleAgendar}
                        >
                           Agendar
                        </button>
                     </div>
                  )}
               </>
            )}
         </div>

         {mostrarModal && horarioSelecionado && (
            <ModalAgendamento
               idCorretor={horarioSelecionado.idCorretor}
               idImovel={+id}
               idUsuario={idUsuario ? idUsuario.toString() : "0"}
               dataFormatadaCapitalizada={dataFormatadaCapitalizada}
               horarioSelecionado={horarioSelecionado.dataHora}
               onClose={() => setMostrarModal(false)}
            />
         )}
      </>
   );
};

export default AgendamentoForm;
