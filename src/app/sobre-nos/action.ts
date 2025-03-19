"use server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import ModelExibirCorretor from "@/models/ModelExibirCorretor";

export async function renderizarUsuariosApi() {
   console.log("Iniciando busca de corretores...");
   console.log(
      "URL da API:",
      `${BASE_URL}/usuarios/corretorApresentacao/CORRETOR`
   );

   try {
      if (!BASE_URL) {
         throw new Error("BASE_URL não está definida no arquivo .env");
      }

      const response = await fetch(
         `${BASE_URL}/usuarios/corretorApresentacao/CORRETOR`,
         {
            cache: "no-store",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
            method: "GET",
         }
      );

      console.log("Status da resposta:", response.status);

      if (response.status === 500) {
         console.error(
            "Erro 500 do servidor - Verifique se o backend está funcionando corretamente"
         );
         throw new Error(
            "Serviço temporariamente indisponível. Por favor, tente novamente mais tarde."
         );
      }

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Resposta da API:", errorText);
         throw new Error(
            `Falha ao buscar corretores: ${response.status} - ${errorText}`
         );
      }

      const data = (await response.json()) as ModelExibirCorretor[];
      console.log("Dados recebidos com sucesso:", data);
      return data;
   } catch (error) {
      console.error("Erro detalhado ao buscar corretores:", error);
      throw new Error(
         `Erro ao buscar corretores: ${
            error instanceof Error ? error.message : "Erro desconhecido"
         }`
      );
   }
}
