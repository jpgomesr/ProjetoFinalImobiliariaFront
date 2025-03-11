import {TipoImovelEnum } from "@/models/Enum/TipoImovelEnum";
import z from "zod";

export const createUsuarioValidator = (
   isPasswordChangeEnabled = true,
) => {
   return z
      .object({
         nomeCompleto: z.string().min(1, { message: "Campo obrigatório" }),
         email: z.string().optional(),
         senha: isPasswordChangeEnabled ? z
            .string()
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
            .regex(/[A-Z]/, {
               message: "A senha deve conter pelo menos uma letra maiúscula.",
            })
            .regex(/[a-z]/, {
               message: "A senha deve conter pelo menos uma letra minúscula.",
            })
            .regex(/[0-9]/, {
               message: "A senha deve conter pelo menos um número.",
            })
            .regex(/[^A-Za-z0-9]/, {
               message: "A senha deve conter pelo menos um caractere especial.",
            })
            .refine((senha) => !/(.)\1{2,}/.test(senha), {
               message: "A senha não pode conter sequências repetidas.",
            })
            .refine((senha) => !senha.includes("usuario"), {
               message: "A senha não pode conter o nome de usuário.",
            }) : 
            z.string().optional(),
         confirmaSenha: isPasswordChangeEnabled
            ? z.string().min(8, {
                 message: "A senha deve ter no mínimo oito caracteres",
              })
            : z.string().optional(),
         telefone: z
            .string()
            .length(11, { message: "O telefone deve conter 11 dígitos" }),
         tipoUsuario: z.string().min(1, { message: "Campo obrigatório" }),
         descricao: z.string().optional(),
         ativo: z.string(),
         imagemPerfil: z
            .instanceof(File)
            .nullable() 
            .refine(
               (file) => {
                  if (file) {
                     return file.size <= 5 * 1024 * 1024;
                  }
                  return true;
               },
               {
                  message: "O arquivo deve ter no máximo 5MB",
               }
            ),
      })
      .refine(
         (data) => {
            if (isPasswordChangeEnabled) {
               return data.senha === data.confirmaSenha;
            }
            return true;
         },
         {
            message: "As senhas não coincidem",
            path: ["confirmaSenha"],
         }
      );
};

export const proprietarioValidator  =  z.object({
      nome :  z.string().min(1, "Campo obrigatório"),
      celular : z.string().min(11, {message : "O número deve conter exatamente 11 digitos"}).regex(/^\d+$/, {
         message: 'A string deve conter apenas números',
      }),
      telefone : z.string().min(7, { message : "O telefone deve conter ao mínimo 7 números"}).max(13, "O telefone pode conter no máximo 13 digitos").regex(/^\d+$/, {
         message: 'A string deve conter apenas números',
      }),
      email : z.string().email({message: "Insira um e-mail válido"}).min(1, {message : "Campo obrigatório"}), 
      cpf : z.string().length(11, {message : "O cpf deve conter exatamente 11 digitos"}).regex(/^\d+$/, {
         message: 'A string deve conter apenas números',
       }),
      imagemPerfil: z
      .instanceof(File)
      .nullable() 
      .refine(
         (file) => {
            if (file) {
               return file.size <= 5 * 1024 * 1024; 
            }
            return true;
         },
         {
            message: "O arquivo deve ter no máximo 5MB",
         }
      ),
      bairro: z.string()
      .max(150, { message: "O bairro deve conter até 150 caracteres" })
      .min(1, { message: "Campo obrigatório" }),
  
    cidade: z.string()
      .max(150, { message: "A cidade deve conter até 150 caracteres" }) 
      .min(1, { message: "Campo obrigatório"}), 
  
    estado: z.string()
      .max(150, { message: "O estado deve conter até 150 caracteres" }) 
      .min(1, { message: "Campo obrigatório" }), 
  
    rua: z.string()
      .max(150, { message: "A rua deve conter até 150 caracteres" }) 
      .min(1, { message: "Campo obrigatório" }), 
  
    cep: z.string()
      .regex(/^[0-9]{8}$/, { message: "O CEP deve conter exatamente 8 dígitos numéricos" }),
  
    tipoResidencia: z.string().min(1, {message:"Campo obrigatório"}),
  
    numeroCasaPredio: z.number( {message : "Campo obrigatório"})
      .int({ message: "O número da casa/prédio deve ser um inteiro" })
      .nonnegative({ message: "O número da casa/prédio não pode ser negativo" })
      .positive({ message: "O número da casa/prédio não pode ser zero" }),
  
    numeroApartamento: z.number( {message : "Campo obrigatório"})
      .int({ message: "O número do apartamento deve ser um inteiro" })
      .positive({ message: "O número do apartamento não pode ser negativo" }) 
      .optional(),

   })

