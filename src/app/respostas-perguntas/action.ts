"use server";

import ModelPergunta from "@/models/ModelPergunta";

export async function buscarPerguntas() {
   try {
      const response = await fetch("http://localhost:8082/perguntas", {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
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
      };
   }
}
