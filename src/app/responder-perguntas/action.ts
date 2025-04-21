"use server";

import ModelPergunta from "@/models/ModelPergunta";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function buscarPerguntas(token?: string) {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      console.log("BASE_URL:", BASE_URL);

      const url = `${BASE_URL}/perguntas`;
      console.log("URL da requisição:", url);

      const response = await fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
         cache: "no-store",
      });

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Erro na resposta:", response.status, errorText);
         throw new Error(
            `Erro ao buscar perguntas: ${response.status} - ${errorText}`
         );
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      return {
         success: true,
         data: data.content as ModelPergunta[],
      };
   } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      return {
         success: false,
         error:
            error instanceof Error ? error.message : "Erro ao buscar perguntas",
         data: [],
      };
   }
}

export async function buscarPerguntasRespondidas() {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      console.log("BASE_URL em buscarPerguntasRespondidas:", BASE_URL);

      const session = await getServerSession(authOptions);
      console.log(
         "Session em buscarPerguntasRespondidas:",
         session ? "Disponível" : "Não disponível"
      );

      const token = session?.accessToken;
      console.log(
         "Token em buscarPerguntasRespondidas:",
         token ? "Disponível" : "Não disponível"
      );

      const url = `${BASE_URL}/perguntas?buscarRespondida=true`;
      console.log("URL da requisição em buscarPerguntasRespondidas:", url);

      const response = await fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
         cache: "no-store",
      });

      console.log(
         "Status da resposta em buscarPerguntasRespondidas:",
         response.status
      );

      if (!response.ok) {
         const errorText = await response.text();
         console.error(
            "Erro na resposta em buscarPerguntasRespondidas:",
            response.status,
            errorText
         );
         throw new Error(
            `Erro ao buscar perguntas: ${response.status} - ${errorText}`
         );
      }

      const data = await response.json();
      console.log("Dados recebidos em buscarPerguntasRespondidas:", data);

      // Filtra apenas as perguntas que têm resposta
      const perguntasRespondidas = data.content.filter(
         (pergunta: ModelPergunta) =>
            pergunta.perguntaRespondida && pergunta.resposta
      );

      console.log(
         "Perguntas respondidas encontradas:",
         perguntasRespondidas.length
      );
      console.log("Detalhes das perguntas respondidas:", perguntasRespondidas);

      return {
         success: true,
         data: perguntasRespondidas as ModelPergunta[],
      };
   } catch (error) {
      console.error("Erro ao buscar perguntas respondidas:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Erro ao buscar perguntas respondidas",
         data: [],
      };
   }
}

export async function buscarPerguntasNaoRespondidas(token?: string) {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      console.log("BASE_URL:", BASE_URL);

      const url = `${BASE_URL}/perguntas?buscarRespondida=false`;
      console.log("URL da requisição:", url);

      const response = await fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
         cache: "no-store",
      });

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Erro na resposta:", response.status, errorText);
         throw new Error(
            `Erro ao buscar perguntas: ${response.status} - ${errorText}`
         );
      }

      const data = await response.json();
      console.log("Total de perguntas recebidas:", data.content.length);

      // Log de todas as perguntas e seus status
      data.content.forEach((pergunta: ModelPergunta) => {
         console.log(
            `Pergunta ID: ${pergunta.id}, Respondida: ${pergunta.perguntaRespondida}`
         );
      });

   


      return {
         success: true,
         data: data.content as ModelPergunta[],
      };
   } catch (error) {
      console.error("Erro ao buscar perguntas não respondidas:", error);
      return {
         success: false,
         error:
            error instanceof Error
               ? error.message
               : "Erro ao buscar perguntas não respondidas",
         data: [],
      };
   }
}
