import { ModelAgendamentoPost, ModelAgendamentoPut } from "@/models/ModelAgendamentoRequisicoes";
import { ErroResposta } from "@/models/ErroResposta";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface HorarioDisponivel {
   id: number;
   dataHora: string;
   disponivel: boolean;
   idCorretor: number;
}


export const buscarHorariosDisponiveis = async (
   data: string,
   idImovel: string,
   token: string
): Promise<HorarioDisponivel[]> => {
   try {
      console.log("teste");
      const response = await useFetchComAutorizacaoComToken(
         `${BASE_URL}/corretores/horarios/${idImovel}?dia=${
            data.split("-")[2]
         }&mes=${data.split("-")[1]}`,{}, token
      );

      if (!response.ok) {
         throw new Error("Erro ao buscar horários disponíveis");
      }

      const horarios = await response.json();
      return horarios;
   } catch (error) {
      console.error("Erro ao buscar horários:", error);
      return [];
   }
};

export const salvarAgendamento = async (agendamento: ModelAgendamentoPost, token: string) => {
   try {
      const response = await useFetchComAutorizacaoComToken(`${BASE_URL}/agendamentos`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(agendamento)
      }, token);

      if(response.ok){
         return { mensagem: "Agendamento concluído com sucesso", status: response.status };
      } else {
         const data: ErroResposta = await response.json();
         return { mensagem: data.mensagem, status: response.status };
      }
   } catch (error) {
      return { mensagem: "Ocorreu um erro durante o agendamento", status: 500 };
   }
};
export const atualizarAgendamento = async (agendamento: ModelAgendamentoPut, token: string) => {
   try {
      console.log(agendamento);
      const response = await useFetchComAutorizacaoComToken(`${BASE_URL}/agendamentos`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(agendamento)
      }, token);

      if(response.ok){
         return { mensagem: "Agendamento concluído com sucesso", status: response.status };
      } else {
         const data: ErroResposta = await response.json();
         return { mensagem: data.mensagem, status: response.status };
      }
   } catch (error) {
      return { mensagem: "Ocorreu um erro durante o agendamento", status: 500 };
   }
}
