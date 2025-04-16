"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUsuarioValidator } from "@/validators/Validators"; // Ajuste o caminho conforme necessário
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData"; // Ajuste o caminho conforme necessário
import { z } from "zod";
import { UseErros } from "@/hooks/UseErros";
import ModelUsuario from "@/models/ModelUsuario";
import { TipoUsuarioEnum } from "@/models/Enum/TipoUsuarioEnum";



   const usuarioValidator = createUsuarioValidator();
   type usuarioValidatorSchema = z.infer<typeof usuarioValidator>;
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

   interface salvarUsuarioProps {
      usuario: {
         nome: string;
         email: string;
         senha: string | undefined;
         telefone: string | null;
         role: string;
         descricao: string | undefined;
         ativo: boolean;
      };
      imagemPerfil: File | null;
      token?: string;
   }
   
   export async function salvarUsuario(props: salvarUsuarioProps) {
      console.log("a")

      const { usuario, imagemPerfil, token } = props;

      console.log("usuario recebido" + usuario)

   const usuarioFormatado = {
      ...usuario,
      senha: usuario.senha === "" ? undefined : usuario.senha,
      telefone: usuario.telefone === "" ? null : usuario.telefone,
      role: usuario.role === "" ? "USUARIO" : usuario.role,
      descricao: usuario.descricao === "" ? undefined : usuario.descricao,
   };
      try {
         // Valida os dados de entrada

   
         const response = await UseFetchPostFormData(
            `${BASE_URL}/usuarios`,
            usuarioFormatado,
            "usuario",
            "file",
            props.imagemPerfil,
            "POST",
            token || ""
         );
   
         const data = await response.json()
         data.ok = true
         if (!response.ok) {
            data.ok = false
            return await data
         }

   
         const usuario: ModelUsuario = await data;
         // Revalida o caminho após a criação do usuário
         revalidatePath(`/gerenciamento/usuarios/edicao/${usuario.id}`);

         return await data

      } catch (error) {
         console.error("Erro ao salvar usuário:", error);
         throw error; // Propaga o erro para o Client Component
      }
   }
   