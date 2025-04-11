import ModelPergunta from "@/models/ModelPergunta";
import { useSession } from "next-auth/react";

export async function buscarPerguntas() {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const session = useSession();
      const token = session.data?.accessToken;
      
      const response = await fetch(`${BASE_URL}/perguntas`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         cache: "no-store",
      });

      if (!response.ok) {
         throw new Error("Erro ao buscar perguntas");
      }

      const data = await response.json();

      // Filtra apenas as perguntas que não têm resposta
      const perguntasNaoRespondidas = data.content.filter(
         (pergunta: ModelPergunta) =>
            !pergunta.perguntaRespondida || !pergunta.resposta
      );

      return {
         success: true,
         data: perguntasNaoRespondidas as ModelPergunta[],
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
