import z from "zod";
import { ModelCorretorSchema } from "@/models/ModelCorretor";

export const createUsuarioValidator = (isPasswordChangeEnabled = true) => {
   return z
      .object({
         nomeCompleto: z
            .string()
            .min(1, { message: "Campo obrigatório" })
            .max(100, { message: "O nome deve conter até 100 caracteres" })
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
               message: "O nome deve conter apenas letras e espaços",
            }),
         email: z
            .string()
            .min(1, { message: "Campo obrigatório" })
            .max(100, { message: "O email deve conter até 100 caracteres" })
            .email({ message: "Insira um email válido" }),
         senha: isPasswordChangeEnabled
            ? z
                 .string()
                 .min(8, {
                    message: "A senha deve ter no mínimo 8 caracteres.",
                 })
                 .regex(/[A-Z]/, {
                    message:
                       "A senha deve conter pelo menos uma letra maiúscula.",
                 })
                 .regex(/[a-z]/, {
                    message:
                       "A senha deve conter pelo menos uma letra minúscula.",
                 })
                 .regex(/[0-9]/, {
                    message: "A senha deve conter pelo menos um número.",
                 })
                 .regex(/[^A-Za-z0-9]/, {
                    message:
                       "A senha deve conter pelo menos um caractere especial.",
                 })
                 .refine((senha) => !/(.)\1{2,}/.test(senha), {
                    message: "A senha não pode conter sequências repetidas.",
                 })
                 .refine((senha) => !senha.includes("usuario"), {
                    message: "A senha não pode conter o nome de usuário.",
                 })
            : z.string().optional(),
         confirmaSenha: isPasswordChangeEnabled
            ? z
                 .string()
                 .min(8, {
                    message: "A senha deve ter no mínimo 8 caracteres",
                 })
                 .max(45, {
                    message: "A senha deve conter no máximo 45 caracteres",
                 })
            : z.string().optional(),
         telefone: z.string().nullable(),
         tipoUsuario: z
            .string()
            .min(1, { message: "Campo obrigatório" })
            .nullable(),
         descricao: z
            .string()
            .max(500, { message: "A descrição deve conter até 500 caracteres" })
            .optional(),
         ativo: z.string().optional(),
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

export const proprietarioValidator = z.object({
   nome: z.string().min(1, "Campo obrigatório"),
   celular: z
      .string()
      .min(11, { message: "O número deve conter exatamente 11 digitos" })
      .regex(/^\d+$/, {
         message: "A string deve conter apenas números",
      }),
   telefone: z
      .string()
      .min(7, { message: "O telefone deve conter ao mínimo 7 números" })
      .max(13, "O telefone pode conter no máximo 13 digitos")
      .regex(/^\d+$/, {
         message: "A string deve conter apenas números",
      }),
   email: z
      .string()
      .email({ message: "Insira um e-mail válido" })
      .min(1, { message: "Campo obrigatório" }),
   cpf: z
      .string()
      .length(11, { message: "O cpf deve conter exatamente 11 digitos" })
      .regex(/^\d+$/, {
         message: "A string deve conter apenas números",
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
   bairro: z
      .string()
      .max(150, { message: "O bairro deve conter até 150 caracteres" })
      .min(1, { message: "Campo obrigatório" }),

   cidade: z
      .string()
      .max(150, { message: "A cidade deve conter até 150 caracteres" })
      .min(1, { message: "Campo obrigatório" }),

   estado: z
      .string()
      .max(150, { message: "O estado deve conter até 150 caracteres" })
      .min(1, { message: "Campo obrigatório" }),

   rua: z
      .string()
      .max(150, { message: "A rua deve conter até 150 caracteres" })
      .min(1, { message: "Campo obrigatório" }),

   cep: z.string().regex(/^[0-9]{8}$/, {
      message: "O CEP deve conter exatamente 8 dígitos numéricos",
   }),

   tipoResidencia: z.string().min(1, { message: "Campo obrigatório" }),

   numeroCasaPredio: z
      .number({ message: "Campo obrigatório" })
      .int({ message: "O número da casa/prédio deve ser um inteiro" })
      .nonnegative({ message: "O número da casa/prédio não pode ser negativo" })
      .positive({ message: "O número da casa/prédio não pode ser zero" }),
   numeroApartamento: z.number({ message: "Campo obrigatório" }).nullable(),
   ativo: z.string(),
});

export const createImovelValidator = () => {
   return z.object({
      titulo: z.string().min(1, { message: "Campo obrigatório" }),
      tipo: z.string().min(1, { message: "Campo obrigatório" }),
      favoritado: z.boolean().optional(),
      objImovel: z.string().min(1, { message: "Campo obrigatório" }),
      valor: z.number({ message: "Campo obrigatório" }),
      valorPromo: z.number().optional(),
      iptu: z.number().optional(),
      valorCondominio: z.number().optional(),
      codigo: z.number().optional(),
      rua: z.string().min(1, { message: "Campo obrigatório" }),
      bairro: z.string().min(1, { message: "Campo obrigatório" }),
      cidade: z.string().min(1, { message: "Campo obrigatório" }),
      descricao: z.string().min(1, { message: "Campo obrigatório" }),
      qtdBanheiros: z.number({ message: "Campo obrigatório" }),
      qtdQuartos: z.number({ message: "Campo obrigatório" }),
      qtdVagas: z.number({ message: "Campo obrigatório" }),
      qtdChurrasqueiras: z.number().optional(),
      qtdPiscinas: z.number().optional(),
      metragem: z.number({ message: "Campo obrigatório" }),
      banner: z.boolean(),
      tipoBanner: z.string().optional(),
      academia: z.boolean(),
      destaque: z.boolean(),
      visibilidade: z.boolean(),
      imagens: z.object({
         imagemPrincipal: z.union([z.instanceof(File), z.string()]).nullable(),
         imagensGaleria: z
            .array(z.union([z.instanceof(File), z.string()]))
            .refine((files) => files.every((file) => file !== null), {
               message: "As imagens da galeria não podem ser nulas",
            })
            .nullable(),
      }),
      cep: z
         .number({ message: "Campo obrigatório" })
         .refine((val) => val.toString().length === 8, {
            message: "O CEP deve ter exatamente 8 dígitos.",
         }),
      numero: z.number({ message: "Campo obrigatório" }),
      numeroApto: z.number().optional(),
      estado: z.string().min(1, { message: "Campo obrigatório" }),
      proprietario: z
         .object({
            id: z.number().nonnegative({ message: "Id não pode ser negativo" }),
            nome: z
               .string({ message: "Nome precisa ser uma string" })
               .min(1, { message: "Campo obrigatório" }),
         })
         .refine((val) => val !== null, {
            message: "Precisa ser selecionado um proprietário",
         }),
      corretores: z
         .array(ModelCorretorSchema, {
            message: "Precisa ter pelo menos um corretor",
         })
         .min(1, { message: "Precisa ter pelo menos um corretor" }),
      id: z.string().optional(),
   });
};
