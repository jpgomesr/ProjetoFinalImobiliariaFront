"use server";

import { fetchComAutorizacao } from "@/hooks/FetchComAuthorization";

export const criarHorario = async (
   BASE_URL: string,
   dataHora: string,
   id: string
) => {
   const response = await fetchComAutorizacao(`${BASE_URL}/horarios/corretor`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         horario: dataHora,
         idCorretor: id,
      }),
   });

   if (!response.ok) throw new Error("Erro ao cadastrar horário");

   return response;
};
