"use client";

import Image from "next/image";
import CardBanner from "./CardBanner";
import { useState } from "react";
import ModalCofirmacao from "../ComponentesCrud/ModalConfirmacao";
interface CardReservaProps {
   id: number;
   urlImagem: string;
   horario: string;
   data: string;
   corretor: string;
   status: "PENDENTE" | "CONFIRMADO" | "CANCELADO";
   localizacao: string;
   endereco: string;
   onConfirm?: () => void;
   onCancel?: () => void;
}

export default function CardReserva({
   urlImagem = "/placeholder.svg?height=300&width=500",
   horario = "16:00",
   data = "19/12/2024",
   status = "PENDENTE",
   corretor = "João Pedro",
   localizacao = "Vila Lenzi",
   endereco = "Rua Hermann Schulz 210",
   id = 0,
}: CardReservaProps) {
   const [modalConfirmacao, setModalConfirmacao] = useState(false);

   const atualizarStatus = async (
      id: number,
      status: "PENDENTE" | "CONFIRMADO" | "CANCELADO"
   ) => {
      try {
         const response = await fetch(
            `http://localhost:8082/agendamentos/${id}?status=${status}`,
            {
               method: "PATCH",
            }
         );

         if (!response.ok) {
            throw new Error("Erro ao atualizar status");
         }
         window.location.reload();
      } catch (error) {
         console.error("Erro ao atualizar status:", error);
      }
   };

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
               tipo={
                  status === "CONFIRMADO"
                     ? "Confirmado"
                     : status === "CANCELADO"
                     ? "Cancelado"
                     : "Pendente"
               }
               cor={
                  status === "CONFIRMADO"
                     ? "bg-green-900"
                     : status === "CANCELADO"
                     ? "bg-havprincipal"
                     : "bg-gray-700"
               }
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
                  <span className="font-semibold">Corretor:</span> {corretor}
               </p>
               <p>
                  <span className="font-semibold">Localização:</span>{" "}
                  {localizacao}, {endereco}
               </p>
            </div>
         </div>

         <div className="px-6 pb-6 pt-2 flex gap-4">
            <button
               disabled={status === "CANCELADO" || status === "CONFIRMADO"}
               onClick={() => atualizarStatus(id, "CONFIRMADO")}
               className="flex-1 py-2 px-4 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors duration-200 font-medium"
            >
               Confirmar
            </button>
            <button
               disabled={status === "CANCELADO"}
               onClick={() => setModalConfirmacao(true)}
               className="flex-1 py-2 px-4 bg-[#7a2638] hover:bg-[#662030] text-white rounded-md transition-colors duration-200 font-medium"
            >
               Cancelar
            </button>
         </div>
         {modalConfirmacao && (
            <ModalCofirmacao
               message="Tem certeza que deseja cancelar este agendamento?"
               isOpen={modalConfirmacao}
               onClose={() => setModalConfirmacao(false)}
               onConfirm={() => atualizarStatus(id, "CANCELADO")}
            />
         )}
      </div>
   );
}
