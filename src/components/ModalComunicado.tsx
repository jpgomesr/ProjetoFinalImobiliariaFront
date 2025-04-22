"use client";

import { useState } from "react";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
import { X } from "lucide-react";
import BotaoPadrao from "./BotaoPadrao";
import TextAreaPadrao from "./TextAreaPadrao";
import { useNotification } from "@/context/NotificationContext";
interface ModalComunicadoProps {
   isOpen: boolean;
   onClose: () => void;
   userId: number;
   token?: string;
}

const ModalComunicado = ({ isOpen, onClose, userId, token }: ModalComunicadoProps) => {
   const [mensagem, setMensagem] = useState("");

   const { showNotification } = useNotification();

   
   const handleSubmit = async () => {
      try {
         await useFetchComAutorizacaoComToken(
            `${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/comunicado/${userId}?mensagem=${mensagem}`,
            {
                method: "POST",
            },
            token ?? ""
         );
         showNotification("Comunicado enviado com sucesso!");
         onClose();
      } catch (error) {
         console.error("Erro ao enviar comunicado:", error);
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold">Enviar Comunicado</h2>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
               >
                  <X size={24} />
               </button>
            </div>

            <TextAreaPadrao 
               value={mensagem}
               onChange={(e) => setMensagem(e.target.value)}
               placeholder="Digite sua mensagem aqui..."
               label="Mensagem"
               htmlFor="mensagem"
            />

            <div className="flex justify-end gap-4 mt-4">
               <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
               >
                  Cancelar
               </button>
               <BotaoPadrao
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-havprincipal text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                  texto="Enviar"
               />
            </div>
         </div>
      </div>
   );
};

export default ModalComunicado;
