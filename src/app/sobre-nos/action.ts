"use server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import ModelExibirCorretor from "@/models/ModelExibirCorretor";

export async function renderizarUsuariosApi() {
  

   try {
      if (!BASE_URL) {
         throw new Error("BASE_URL não está definida no arquivo .env");
      }

      const response = await fetch(
         `${BASE_URL}/usuarios/corretorApresentacao/CORRETOR`,
         {
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
            method: "GET",
            next: { revalidate: 60 },
         }
      );


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
