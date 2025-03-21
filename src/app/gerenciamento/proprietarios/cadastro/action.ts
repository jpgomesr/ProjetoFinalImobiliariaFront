"use server";

import { revalidatePath } from "next/cache";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import ModelProprietario from "@/models/ModelProprietario";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface salvarProprietarioProps {
   proprietario: {
      nome: string;
      celular: string;
      telefone: string | null;
      email: string;
      cpf: string;
      ativo: boolean;
      enderecoPostDTO: {
         bairro: string;
         cidade: string;
         estado: string;
         rua: string;
         cep: string;
         tipoResidencia: string;
         numeroCasaPredio: string;
         numeroApartamento: string | null;
      };
   };
   imagemPerfil: File | null;
}

export async function salvarProprietario(props: salvarProprietarioProps) {
   const { proprietario, imagemPerfil } = props;

   const proprietarioFormatado = {
      ...proprietario,
      telefone: proprietario.telefone === "" ? null : proprietario.telefone, // Reverte string vazia para null
      enderecoPostDTO: {
         ...proprietario.enderecoPostDTO,
         numeroApartamento:
            proprietario.enderecoPostDTO.numeroApartamento === ""
               ? null
               : proprietario.enderecoPostDTO.numeroApartamento, // Reverte string vazia para null
      },
   };

   try {
      // Valida os dados de entrada

      const response = await UseFetchPostFormData(
         `${BASE_URL}/proprietarios`,
         proprietarioFormatado,
         "proprietario",
         "foto",
         props.imagemPerfil,
         "POST"
      );

      const data = await response.json();
      data.ok = true;
      if (!response.ok) {
         data.ok = false;
         return await data;
      }

      const proprietario: ModelProprietario = await data;
      // Revalida o caminho após a criação do proprietário
      revalidatePath(`/gerenciamento/proprietarios/edicao/${proprietario.id}`);

      return await data;
   } catch (error) {
      console.error("Erro ao salvar proprietário:", error);
      throw error; // Propaga o erro para o Client Component
   }
}
