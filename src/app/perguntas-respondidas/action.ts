"use server";

import ModelPergunta from "@/models/ModelPergunta";

export async function buscarPerguntasRespondidas() {
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
         throw new Error("Erro ao buscar perguntas respondidas");
      }

      const data = await response.json();

      // Filtra apenas as perguntas que têm resposta
      const perguntasRespondidas = data.content.filter(
         (pergunta: ModelPergunta) =>
            pergunta.perguntaRespondida && pergunta.resposta
      );

      return {
         success: true,
         data: perguntasRespondidas as ModelPergunta[],
      };
   } catch (error) {
      console.error("Erro ao buscar perguntas respondidas:", error);
      return {
         success: false,
         error: "Erro ao buscar perguntas respondidas",
         data: [],
      };
   }
}
