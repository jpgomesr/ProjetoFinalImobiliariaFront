import { ModelNotificacao } from "@/models/ModelNotificacao";

interface EnviarNotificacaoProps {
   titulo: string;
   descricao: string;
}

export const enviarNotificacao = async (
   notificacao: EnviarNotificacaoProps,
   idUser: number | string
) => {
   const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notificacao/${idUser}`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            titulo: notificacao.titulo,
            descricao: notificacao.descricao,
         }),
      }
   );

   if (!response.ok) {
      throw new Error(`Erro ao enviar notificação: ${response.status}`);
   }

   return response.json();
};
