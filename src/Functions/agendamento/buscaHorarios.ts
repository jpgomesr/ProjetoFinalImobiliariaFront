const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface HorarioDisponivel {
   id: number,
   dataHora: string;
   disponivel: boolean;
   idCorretor : number
}

export const buscarHorariosDisponiveis = async (
   data: string,
   idImovel: string
): Promise<HorarioDisponivel[]> => {
   try {
      console.log("teste")
      const response = await fetch(
         `${BASE_URL}/corretores/horarios/${idImovel}?dia=${data.split('-')[2]}&mes=${data.split('-')[1]}`
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
