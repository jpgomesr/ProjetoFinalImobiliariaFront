"use client";

import List from "@/components/List";
import ListFiltroPadrao from "@/components/ListFiltroPadrao";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
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
   const { t } = useLanguage();

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
         id: "",
         label: t("SchedulingHistory.status4"),
      },
      {
         id: "CANCELADO",
         label: t("SchedulingHistory.status1"),
      },
      {
         id: "CONFIRMADO",
         label: t("SchedulingHistory.status2"),
      },
      {
         id: "PENDENTE",
         label: t("SchedulingHistory.status3"),
      }
   ];
   const [statusAtual, setStatusAtual] = useState(opcoesAgendamento[0].id);

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
