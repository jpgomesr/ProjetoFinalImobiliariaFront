
import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import ModelPergunta from "@/models/ModelPergunta";
import { z } from "zod";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

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
   token: string;
}

export async function enviarPergunta({
   tipoPergunta,
   mensagem,
   email,
   titulo,
   token,
}: EnviarPerguntaProps) {
   console.log("Tokeasdasdan:", token);

   try {
      const url = process.env.NEXT_PUBLIC_BASE_URL + "/perguntas";
      console.log("Token:", token);
      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,   
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
