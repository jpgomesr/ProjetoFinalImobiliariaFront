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

export async function enviarPergunta(pergunta: ModelPergunta) {
   try {
      const validacao = perguntaSchema.safeParse(pergunta);

      if (!validacao.success) {
         return {
            success: false,
            error: "Erro de validação",
            erros: validacao.error.errors.map((err) => ({
               campo: err.path.join("."),
               mensagem: err.message,
            })),
         };
      }

      const res = await fetch("http://localhost:8082/perguntas", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            tipoPergunta:
               TipoPergunta[pergunta.tipoPergunta as keyof typeof TipoPergunta],
            email: pergunta.email,
            telefone: pergunta.telefone,
            nome: pergunta.nome,
            mensagem: pergunta.mensagem,
         }),
      });

      if (!res.ok) throw new Error("Erro ao enviar pergunta");

      const data = await res.json();
      return { success: true, data };
   } catch (error) {
      console.error("Erro:", error);
      return { success: false, error: "Erro ao enviar pergunta" };
   }
}
