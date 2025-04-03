"use server";

import ModelPergunta from "@/models/ModelPergunta";

export async function buscarPerguntas() {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${BASE_URL}/perguntas`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
         cache: "no-store",
      });

      if (!response.ok) {
         throw new Error("Erro ao buscar perguntas");
      }

      const data = await response.json();

      return {
         success: true,
         data: data.content as ModelPergunta[],
      };
   } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      return {
         success: false,
         error: "Erro ao buscar perguntas",
         data: [],
      };
   }
}
