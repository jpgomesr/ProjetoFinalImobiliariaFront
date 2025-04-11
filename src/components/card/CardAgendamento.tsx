"use client";

import Image from "next/image";
import CardBanner from "./CardBanner";
import { useState, useEffect } from "react";
import ModalCofirmacao from "../ComponentesCrud/ModalConfirmacao";
import { Roles } from "@/models/Enum/Roles";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
import ModalHorariosAgendamento from "../agendamentos/ModalHorariosAgendamento";
interface CardReservaProps {
   id: number;
   urlImagem: string;
   horario: string;
   data: string;
   corretor: {
      id: number;
      nome: string;
   };
   usuario?: {
      id: number;
      nome: string;
   };
   role: Roles;
   status: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
   localizacao: string;
   endereco: string;
   onConfirm?: () => void;
   onCancel?: () => void;
   token: string;
   idImovel: number;
}

export default function CardReserva({
   urlImagem = "/placeholder.svg?height=300&width=500",
   horario = "16:00",
   data = "19/12/2024",
   status = "PENDENTE",
   corretor,
   localizacao = "Vila Lenzi",
   endereco = "Rua Hermann Schulz 210",
   id = 0,
   idImovel,
   role,
   usuario,
   token,
} : CardReservaProps) {
  
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const [modalConfirmacao, setModalConfirmacao] = useState(false);
   const [modalReagendar, setModalReagendar] = useState(false);
   const [agendamentoPassado, setAgendamentoPassado] = useState(false);
   
   useEffect(() => {
      const dataHoraAgendamento = new Date(`${data.split('/').reverse().join('-')}T${horario}`);
      const agora = new Date();
      setAgendamentoPassado(dataHoraAgendamento < agora);
   }, [data, horario]);

   const atualizarStatus = async (
      id: number,
      novoStatus: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO"
   ) => {
      try {
         const response = await useFetchComAutorizacaoComToken(
            `${BASE_URL}/agendamentos/${id}?status=${novoStatus}`,
            {
               method: "PATCH",
            },
            token
         );

         if (!response.ok) {
            throw new Error("Erro ao atualizar status");
         }
         window.location.reload();
      } catch (error) {
         console.error("Erro ao atualizar status:", error);
      }
   };
   
   const renderizarBotoes = () => {
      // Se o agendamento foi cancelado, não mostra botões interativos
      if (status === "CANCELADO") {
         return (
            <>
               <button
                  disabled
                  className="flex-1 py-2 px-4 bg-white text-gray-400 border border-gray-300 rounded-md font-medium cursor-not-allowed"
               >
                  Reagendar
               </button>
               <button
                  disabled
                  className="flex-1 py-2 px-4 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
               >
                  Cancelar
               </button>
            </>
         );
      }
      
      // Para corretores
      if (role === Roles.CORRETOR) {
         // Se o agendamento já passou e está confirmado, mostrar botão de concluir
         if (agendamentoPassado && status === "CONFIRMADO") {
            return (
               <>
                  <button
                     onClick={() => atualizarStatus(id, "CONCLUIDO")}
                     className="flex-1 py-2 px-4 bg-green-600 text-white hover:bg-green-700 border border-gray-300 rounded-md transition-colors duration-200 font-medium"
                  >
                     Concluir
                  </button>
                  <button
                     onClick={() => setModalConfirmacao(true)}
                     className="flex-1 py-2 px-4 bg-[#7a2638] hover:bg-[#662030] text-white rounded-md transition-colors duration-200 font-medium"
                  >
                     Cancelar
                  </button>
               </>
            );
         }
         
         // Agendamento normal para corretor
         return (
            <>
               <button
                  disabled={status === "CONFIRMADO" || status === "CONCLUIDO"}
                  onClick={() => atualizarStatus(id, "CONFIRMADO")}
                  className="flex-1 py-2 px-4 bg-white text-havprincipal hover:bg-gray-100 border border-gray-300 rounded-md transition-colors duration-200 font-medium disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed"
               >
                  Confirmar
               </button>
               <button
                  disabled={status === "CONCLUIDO"}
                  onClick={() => setModalConfirmacao(true)}
                  className="flex-1 py-2 px-4 bg-[#7a2638] hover:bg-[#662030] text-white rounded-md transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
               >
                  Cancelar
               </button>
            </>
         );
      }
      
      // Para usuários normais
      return (
         <>
            <button
               disabled={status === "CONCLUIDO"}
               onClick={(e) => {
                  e.preventDefault();
                  setModalReagendar(true);
               }}
               className="flex-1 py-2 px-4 bg-white text-havprincipal hover:bg-gray-100 border border-gray-300 rounded-md transition-colors duration-200 font-medium disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed"
            >
               Reagendar
            </button>
            <button
               disabled={status === "CONCLUIDO"}
               onClick={() => setModalConfirmacao(true)}
               className="flex-1 py-2 px-4 bg-[#7a2638] hover:bg-[#662030] text-white rounded-md transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
            >
               Cancelar
            </button>
         </>
      );
   };

   const getBannerInfo = () => {
      switch (status) {
         case "CONFIRMADO":
            return { tipo: "Confirmado", cor: "bg-green-900" };
         case "CANCELADO":
            return { tipo: "Cancelado", cor: "bg-havprincipal" };
         case "CONCLUIDO":
            return { tipo: "Concluído", cor: "bg-blue-700" };
         default:
            return { tipo: "Pendente", cor: "bg-gray-700" };
      }
   };

   const bannerInfo = getBannerInfo();

   return (
      <div
         className={`max-w-96 rounded-xl overflow-hidden bg-begepadrao shadow-[4px_4px_4px_rgba(0,0,0,0.2)] ${
            status === "CANCELADO" ? "opacity-50" : ""
         }`}
      >
         <div className="relative h-48 w-full">
            <Image
               src={urlImagem}
               alt="Imagem da propriedade"
               fill
               className="object-cover"
               priority
            />
            <CardBanner
               tipo={bannerInfo.tipo}
               cor={bannerInfo.cor}
            />
         </div>

         <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-havprincipal mb-4">
               Reserva
            </h2>

            <div className="space-y-2 text-gray-800">
               <p>
                  <span className="font-semibold">Horario:</span> {horario}
               </p>
               <p>
                  <span className="font-semibold">Data:</span> {data}
               </p>
               <p>
                     <span className="font-semibold">{role === Roles.CORRETOR ? "Cliente" : "Corretor"}:</span> {role === Roles.CORRETOR ? usuario?.nome : corretor.nome}
               </p>
               <p>   
                  <span className="font-semibold">Localização:</span>{" "}
                  {localizacao}, {endereco}
               </p>
            </div>
         </div>

         <div className="px-6 pb-6 pt-2 flex gap-4">
            {renderizarBotoes()}
         </div>
         {modalConfirmacao && (
            <ModalCofirmacao
               message="Tem certeza que deseja cancelar este agendamento?"
               isOpen={modalConfirmacao}
               onClose={() => setModalConfirmacao(false)}
               onConfirm={() => atualizarStatus(id, "CANCELADO")}
            />
         )}
         {modalReagendar && (
            <ModalHorariosAgendamento
               isOpen={modalReagendar}
               onClose={() => {
                  setModalReagendar(false);
               }}
               idImovel={idImovel}
               token={token}
               idUsuario={usuario?.id || 0} 
               idAgendamento={id}
            /> 
         )} 
      </div>
   );
}
