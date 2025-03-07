"use client";

import { useState } from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { Calendario } from "@/components/calendario/Calendario";
import Horario from "@/components/calendario/Horarios";

const Page = () => {
   // Estado para armazenar o horário selecionado
   const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
      null
   );

   // Função para atualizar o horário selecionado
   const handleSelecionarHorario = (horario: string) => {
      setHorarioSelecionado(horario);
   };

   return (
      <Layout className={"py-0"}>
         <SubLayoutPaginasCRUD>
            <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl text-center mb-4">
               <h1>Agendamento de Visitas com</h1>
               <h1 className="font-bold">HAV</h1>
            </div>
            <div className="w-full px-4 flex-grow flex flex-col">
               <div className="bg-havprincipal w-full rounded-xl flex-grow flex flex-col overflow-hidden">
                  <Calendario />
               </div>
            </div>
            <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl text-center my-4">
               <h2>Horários</h2>
            </div>
            <div className="grid grid-rows-2 gap-7">
               <div className="grid grid-cols-4 gap-2">
                  {["10:00", "11:30", "13:30", "14:30"].map((horario) => (
                     <Horario
                        key={horario}
                        horario={horario}
                        selecionado={horario === horarioSelecionado}
                        onSelecionar={() => handleSelecionarHorario(horario)}
                     />
                  ))}
               </div>
               <div className="grid grid-cols-4 gap-2">
                  {["15:30", "16:00", "17:30", "18:00"].map((horario) => (
                     <Horario
                        key={horario}
                        horario={horario}
                        selecionado={horario === horarioSelecionado}
                        onSelecionar={() => handleSelecionarHorario(horario)}
                     />
                  ))}
               </div>
               {horarioSelecionado && (
                  <div className="flex justify-center">
                     <div className="bg-havprincipal/90 flex justify-center items-center h-7 w-24 rounded-md font-inter text-begepadrao" >
                        <p>Agendar</p>
                     </div>
                  </div>
               )}
            </div>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
