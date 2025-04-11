"use client";

import List from "@/components/List";
import ListFiltroPadrao from "@/components/ListFiltroPadrao";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FiltrosAgendamentoProps {
   id: string;
   url: string;
   status: string;
   data: string;
}

const FIltrosAgendamento = ({ id, url, status = "", data }: FiltrosAgendamentoProps) => {
   const [dataAtual, setDataAtual] = useState("");
   const searchParams = useSearchParams();
   const router = useRouter();
   console.log(status);


   const atualizarURL = (data: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (data) {
         params.set("data", data);
      } else {
         params.delete("data");
      }
      router.push(`${url}?${params.toString()}`);
   };

   const opcoesAgendamento = [
      {
         id: "CANCELADO",
         label: "Cancelado",
      },
      {
         id: "CONFIRMADO",
         label: "Confirmado",
      },
      {
         id: "PENDENTE",
         label: "Pendente",
      },
      {
         id: "CONCLUIDO",
         label: "Concluido",
      },
      {
         id: "",
         label: "Todos",
      },
   ];
   const [statusAtual, setStatusAtual] = useState(opcoesAgendamento[3].id);

   return (
      <div className="w-full flex gap-4 flex-col md:flex-row justify-between">
         <input
            type="date"
            value={data}
            onChange={(e) => {
               setDataAtual(e.target.value);
               atualizarURL(e.target.value);
            }}
            className="h-10 px-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-havprincipal"
         />
         <ListFiltroPadrao
            buttonHolder="Status"
            value={status}
            url={`/historico-agendamentos/${id}`}
            nomeAributo="status"
            opcoes={opcoesAgendamento}
         />
      </div>
   );
};

export default FIltrosAgendamento;
