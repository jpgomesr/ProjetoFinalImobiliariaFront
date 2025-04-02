"use client";

import { useState, useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { Trash } from "lucide-react";
import BotaoPadrao from "@/components/BotaoPadrao";
import Link from "next/link";
import ModalConfirmacao from "@/components/ComponentesCrud/ModalConfirmacao";
import { Session } from "next-auth";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
interface Horario {
   id: number;
   dataHora: string;
}

interface FormularioHorariosProps {
   id: string;
   BASE_URL: string;
   token: string;
}

export default function FormularioHorarios({
   id,
   BASE_URL,
   token,
}: FormularioHorariosProps) {
   const { showNotification } = useNotification();
   const [data, setData] = useState("");
   const [horario, setHorario] = useState("");
   const [horarios, setHorarios] = useState<Horario[]>([]);
   const [horariosAgrupados, setHorariosAgrupados] = useState<{
      [key: string]: Horario[];
   }>({});
   console.log(id);
   const [modalConfirmacao, setModalConfirmacao] = useState(false);
   const [idHorarioParaExcluir, setIdHorarioParaExcluir] = useState<
      number | null
   >(null);

   const buscarHorarios = async () => {
      try {
         const response = await useFetchComAutorizacaoComToken(
            `${BASE_URL}/corretores/horarios/corretor`,
            {
               method: "GET",
            },
            token
         );
         if (!response.ok) throw new Error("Erro ao buscar horários");
         const data = await response.json();
         setHorarios(data);

         const grupos = data.reduce(
            (acc: { [key: string]: Horario[] }, horario: Horario) => {
               const data = horario.dataHora.split("T")[0];
               if (!acc[data]) acc[data] = [];
               acc[data].push(horario);
               return acc;
            },
            {}
         );
         setHorariosAgrupados(grupos);
      } catch (error) {
         console.error("Erro:", error);
      }
   };

   useEffect(() => {
      buscarHorarios();
   }, []);

   const handleSubmit = async () => {
      if (!data || !horario) return;

      const dataHora = `${data}T${horario}:00`;
      const dataHoraSelecionada = new Date(dataHora);
      const agora = new Date();

      if (dataHoraSelecionada <= agora) {
         showNotification("Só é possível adicionar horários futuros!");
         return;
      }

      try {
         const response = await useFetchComAutorizacaoComToken(`${BASE_URL}/horarios/corretor`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               horario: dataHora,
               idCorretor: id,
            }),
         }, token);

         if (!response.ok) throw new Error("Erro ao cadastrar horário");

         buscarHorarios();
         setHorario("");
      } catch (error) {
         console.error("Erro:", error);
      }
   };

   const excluirHorario = async (horarioId: number) => {

      setIdHorarioParaExcluir(horarioId);
      setModalConfirmacao(true);
   };

   const confirmarDelecao = async () => {
      try {
         const response = await fetch(
            `${BASE_URL}/horarios/corretor/${idHorarioParaExcluir}`,
            {
               method: "DELETE",
            }
         );

         if (!response.ok) throw new Error("Erro ao excluir horário");

         showNotification("Horário excluído com sucesso!");
         buscarHorarios();
      } catch (error) {
         console.error("Erro:", error);
         showNotification("Erro ao excluir horário");
      }
   };

   const dataMinima = new Date().toISOString().split("T")[0];

   return (
      <div className="flex flex-col gap-6">
         <div className="flex flex-col gap-4">
            <Link href={`/historico-agendamentos/${id}`}>
               <BotaoPadrao texto="Agendamentos" />
            </Link>
            <h2 className="text-xl text-havprincipal">Cadastro de horário</h2>
            <div className="flex flex-col md:flex-row gap-4 items-start">
               <div className="flex-1 w-full">
                  <input
                     type="date"
                     value={data}
                     min={dataMinima}
                     onChange={(e) => setData(e.target.value)}
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-havprincipal"
                  />
               </div>
               <div className="flex-1 w-full">
                  <input
                     type="time"
                     value={horario}
                     onChange={(e) => setHorario(e.target.value)}
                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-havprincipal"
                  />
               </div>
               <button
                  onClick={handleSubmit}
                  className="bg-havprincipal text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
               >
                  Adicionar +
               </button>
            </div>
         </div>

         {Object.entries(horariosAgrupados).map(([data, horarios]) => (
            <div key={data} className="flex flex-col gap-4">
               <h3 className="text-lg font-semibold text-havprincipal">
                  Dia {new Date(data).toLocaleDateString("pt-BR")}
               </h3>
               <div className="flex flex-wrap gap-3">
                  {horarios.map((horario) => (
                     <div
                        key={horario.id}
                        className="bg-havprincipal text-white px-4 py-2 rounded-lg relative group cursor-pointer"
                        onClick={() => excluirHorario(horario.id)}
                     >
                        {horario.dataHora.split("T")[1].substring(0, 5)}
                        <div
                           className="absolute top-[-10px] right-[-10px] bg-red-200  p-1 rounded-full cursor-pointer"
                           onClick={(e) => {
                              e.stopPropagation();
                              excluirHorario(horario.id);
                           }}
                        >
                           <Trash
                              className="text-havprincipal"
                              width={16}
                              height={16}
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         ))}
         <ModalConfirmacao
            isOpen={modalConfirmacao}
            onClose={() => setModalConfirmacao(false)}
            onConfirm={confirmarDelecao}
            message="Tem certeza que deseja excluir este horário?"
         />
      </div>
   );
}
