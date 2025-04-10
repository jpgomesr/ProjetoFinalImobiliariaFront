"use server";

import ModelPergunta from "@/models/ModelPergunta";

export async function buscarPerguntasRespondidas() {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const url = `${BASE_URL}/perguntas`;

      console.log("Buscando todas as perguntas:", url);

      const response = await fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
         cache: "no-store",
      });

      if (!response.ok) {
         console.error(
            "Erro na resposta:",
            response.status,
            response.statusText
         );
         throw new Error("Erro ao buscar perguntas respondidas");
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      // Filtra apenas as perguntas que possuem resposta não nula
      const perguntasRespondidas = data.content.filter(
         (pergunta: ModelPergunta) =>
            pergunta.resposta && pergunta.resposta.trim() !== ""
      );

      console.log(
         `Encontradas ${perguntasRespondidas.length} perguntas com resposta`
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
