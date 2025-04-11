"use client";

import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import ModelPergunta from "@/models/ModelPergunta";
import { z } from "zod";
import { useSession } from "next-auth/react";
const perguntaSchema = z.object({
   tipoPergunta: z.string().min(1, "Selecione um assunto"),
   email: z.string().email("Email inválido"),
   telefone: z
      .string()
      .min(10, "Telefone inválido")
      .max(11, "Telefone inválido"),
   nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
   mensagem: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres"),
});

interface EnviarPerguntaProps {
   tipoPergunta: TipoPergunta;
   mensagem: string;
   email: string;
   titulo: string;
}

export async function enviarPergunta({
   tipoPergunta,
   mensagem,
   email,
   titulo,
}: EnviarPerguntaProps) {
   try {
      const url = process.env.NEXT_PUBLIC_BASE_URL + "/perguntas";
      const session = useSession();
      const token = session.data?.accessToken;

      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            tipoPergunta,
            mensagem,
            email,
            titulo,
            data: new Date(),
            perguntaRespondida: false,
         }),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Erro ao enviar pergunta");
      }

      const data = await response.json();

      return {
         success: true,
         data,
      };
   } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
      return {
         success: false,
         error:
            error instanceof Error ? error.message : "Erro ao enviar pergunta",
      };
   }
}
