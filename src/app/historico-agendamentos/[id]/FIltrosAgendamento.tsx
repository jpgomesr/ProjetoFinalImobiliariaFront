"use client";

import List from "@/components/List";
import React, { useState } from "react";

const FIltrosAgendamento = () => {[]
   const [data, setData] = useState("");
   const [status, setStatus] = useState("");

   console.log(data);
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
   ];

   return (
      <div className="w-full flex justify-between">
         <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="h-10 px-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-havprincipal"
         />
         <List 
         buttonHolder="Status"
         opcoes={opcoesAgendamento} />
      </div>
   );
};

export default FIltrosAgendamento;
