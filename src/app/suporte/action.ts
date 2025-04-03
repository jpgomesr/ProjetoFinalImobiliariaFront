"use server";

import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import ModelPergunta from "@/models/ModelPergunta";
import { z } from "zod";

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
}

export async function enviarPergunta({
   tipoPergunta,
   mensagem,
   email,
}: EnviarPerguntaProps) {
   try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${BASE_URL}/perguntas`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            tipoPergunta,
            mensagem,
            email,
         }),
      });

      if (!response.ok) {
         throw new Error("Erro ao enviar pergunta");
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
         error: "Erro ao enviar pergunta",
      };
   }
}
