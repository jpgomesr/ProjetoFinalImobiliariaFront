"use client";

import { HorarioDisponivel } from "@/Functions/agendamento/buscaHorarios";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
import { useState, useEffect } from "react";
import Horario from "@/components/calendario/Horarios";
import { format, parseISO } from "date-fns";
import { id, ptBR } from "date-fns/locale";
import ModalAgendamento from "./ModalAgendamento";

interface ModalHorariosCorretoresProps {
   idImovel: number;
   isOpen: boolean;
   onClose: () => void;
   idUsuario: number;
   token: string;
   idAgendamento: number;
}

export default function ModalHorariosCorretores({
   idImovel,
   isOpen,
   onClose,
   token,
   idUsuario,
   idAgendamento
}: ModalHorariosCorretoresProps) {
   const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
   const [horarioSelecionado, setHorarioSelecionado] = useState<HorarioDisponivel | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [modalConfirmar, setModalConfirmar] = useState(false);
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   
   useEffect(() => {
      const buscarHorarios = async () => {
         try {
            setLoading(true);
            const response = await useFetchComAutorizacaoComToken(`${BASE_URL}/corretores/horarios/${idImovel}`, {
               method: "GET",
            }, token);
            
            if (!response.ok) {
               throw new Error("Erro ao buscar horários");
            }
            
            const data = await response.json();
            setHorarios(data);
         } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar horários");
         } finally {
            setLoading(false);
         }
      };

      if (isOpen && idImovel) {
         buscarHorarios();
      }
   }, [idImovel, isOpen]);

   const handleSelecionarHorario = (horario: HorarioDisponivel) => {
      setHorarioSelecionado(horario);
   };

   // Agrupar horários por dia
   const agruparHorariosPorDia = () => {
      const horariosPorDia: { [key: string]: HorarioDisponivel[] } = {};
      
      horarios.forEach(horario => {
         const data = horario.dataHora.split('T')[0]; // Extrair a data (YYYY-MM-DD)
         if (!horariosPorDia[data]) {
            horariosPorDia[data] = [];
         }
         horariosPorDia[data].push(horario);
      });
      
      return horariosPorDia;
   };

   const formatarData = (dataString: string) => {
      const data = parseISO(dataString);
      return format(data, "EEEE, dd 'de' MMMM", { locale: ptBR }).charAt(0).toUpperCase() + 
             format(data, "EEEE, dd 'de' MMMM", { locale: ptBR }).slice(1);
   };

   const formatarHora = (dataHoraString: string) => {
      return dataHoraString.split('T')[1].substring(0, 5);
   };

   if (!isOpen) return null;

   const horariosPorDia = agruparHorariosPorDia();

   return (
      <> 
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="p-4 border-b">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-havprincipal">
                     Horários de Visita
                  </h2>
                  <button
                     onClick={onClose}
                     className="text-gray-500 hover:text-gray-700"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M6 18L18 6M6 6l12 12"
                        />
                     </svg>
                  </button>
               </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4">
               {loading ? (
                  <div className="flex justify-center items-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-havprincipal"></div>
                  </div>
               ) : error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
               ) : horarios.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                     Nenhum horário disponível para este imóvel
                  </div>
               ) : (
                  <div className="space-y-6">
                     {Object.keys(horariosPorDia).map((data) => (
                        <div key={data} className="border-b pb-4 last:border-b-0">
                           <h3 className="text-lg font-semibold text-havprincipal mb-3">
                              {formatarData(data)}
                           </h3>
                           <div className="grid grid-cols-4 gap-2 lg:gap-8">
                              {horariosPorDia[data].map((horario) => (
                                 <div key={horario.id} className="flex flex-col items-center">                              
                                    <Horario
                                       horario={horario.dataHora}
                                       selecionado={horarioSelecionado?.id === horario.id}
                                       onSelecionar={() => handleSelecionarHorario(horario)}
                                       disponivel={horario.disponivel}
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Botões de ação */}
            <div className="p-4 border-t flex justify-center  space-x-3">
               <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
               >
                  Cancelar
               </button>
               <button
                  onClick={() => setModalConfirmar(true)}
                  disabled={!horarioSelecionado}
                  className={`px-4 py-2 rounded-md text-white ${
                     horarioSelecionado 
                     ? "bg-havprincipal hover:bg-havprincipal/90" 
                     : "bg-gray-400 cursor-not-allowed"
                  }`}
               >
                  Confirmar
               </button>
            </div>
         </div>
      </div>
      {modalConfirmar && horarioSelecionado && (
            <ModalAgendamento
               method="PUT"
               idAgendamento={idAgendamento}
               idCorretor={horarioSelecionado.idCorretor}
               idImovel={idImovel}
               idUsuario={idUsuario ? idUsuario.toString() : "0"}
               dataFormatadaCapitalizada={horarioSelecionado.dataHora}
               horarioSelecionado={horarioSelecionado.dataHora}
               onClose={() => setModalConfirmar(false)}
               token={token}
            />
         )}
      </>
   );
}