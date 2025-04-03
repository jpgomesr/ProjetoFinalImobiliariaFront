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
      // TODO: Implementar a chamada à API
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
      return {
         success: false,
         error: "Erro ao enviar pergunta",
      };
   }
}
