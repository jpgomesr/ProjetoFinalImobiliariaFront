"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import ModelUsuario from "@/models/ModelUsuario";
import { buscarUsuarioPorId } from "@/Functions/usuario/buscaUsuario";
import { useEffect, useState } from "react";
import { atualizarAgendamento, salvarAgendamento } from "@/Functions/agendamento/buscaHorarios";
import { redirect } from "next/navigation";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";

interface ModalAgendamentoProps {
   dataFormatadaCapitalizada: string;
   horarioSelecionado: string;
   idCorretor: number;
   idImovel: number;
   onClose: () => void;
   idUsuario: string;
   token: string;
   idAgendamento?: number;
   method?: "POST" | "PUT";
}

const ModalAgendamento = ({
   dataFormatadaCapitalizada,
   horarioSelecionado,
   idImovel,
   onClose,
   idUsuario,
   idCorretor,
   token,
   method = "POST",
   idAgendamento
}: ModalAgendamentoProps) => {
   const { showNotification } = useNotification();
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const confirmarAgendamento = async () => {
      if(method === "POST"){
         const response = await salvarAgendamento({
            dataHora: horarioSelecionado,
            idCorretor: idCorretor,
            idImovel,
            idUsuario: +idUsuario,
      }, token);
      showNotification(response.mensagem || "Ocorreu um erro durante o agendamento");
      if(response.status === 201){
         redirect("/imovel/" + idImovel);
      }
      } else if(method === "PUT"){
      console.log(idAgendamento);

         const response = await atualizarAgendamento({
            id: idAgendamento || 0,
            dataHora: horarioSelecionado,
            idCorretor: idCorretor,
            idImovel,
            idUsuario: +idUsuario,  
         }, token);
         showNotification(response.mensagem || "Ocorreu um erro durante o agendamento");
         window.location.reload();
      }
   };
   const [usuario, setUsuario] = useState<ModelUsuario>();

   useEffect(() => {
      const buscarUsuario = async () => {
         const usuarioRequisicao = await useFetchComAutorizacaoComToken(`${BASE_URL}/usuarios/${idCorretor}`, {
            method: "GET",
         }, token);
         const usuario = await usuarioRequisicao.json() as ModelUsuario;
         setUsuario(usuario);   
         
      };

      buscarUsuario();
   }, [idCorretor]);

   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
         <div className="bg p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-80 md:w-96 lg:w-[28rem] text-center bg-white">
            <h2 className="text-base md:text-xl lg:text-2xl font-bold flex justify-center">
               Corretor : {usuario?.nome}
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
            <div className="flex flex-row gap-2 justify-center flex-wrap">
            <button
               className="mt-4 md:mt-6 lg:mt-8 bg-havprincipal text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-md md:text-lg lg:text-xl"
               onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  confirmarAgendamento();
                  scrollToTop();
               }}
            >
               Concluir
            </button>
            <button
               className="mt-4 md:mt-6 lg:mt-8 bg-havprincipal text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-md md:text-lg lg:text-xl"
               onClick={(e) => {
                  e.preventDefault();
                  onClose();
               }}
            >
               Cancelar
            </button>
            </div>
         </div>
      </div>   
   );
};

export default ModalAgendamento;
