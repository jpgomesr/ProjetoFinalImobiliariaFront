import z from "zod";

export const createUsuarioValidator = (
   isPasswordChangeEnabled?: boolean,
) => {
   return z
      .object({
         nomeCompleto: z.string().min(1, { message: "Campo obrigatório" }),
         email: z.string().optional(),
         senha: z
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
            }),
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
            .nullable() // Permite que o valor seja null
            .refine(
               (file) => {
                  // Se o arquivo existir, valida o tamanho
                  if (file) {
                     return file.size <= 5 * 1024 * 1024; // 5MB
                  }
                  // Se for null, a validação é ignorada
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
