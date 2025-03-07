import z from "zod"

export const usuarioValidator = z.object({
    nomeCompleto : z.string().min(1, {message : "Campo obrigatório"}),
    email : z.string().optional(),
    senha : z.string().min(8, {message : "A senha deve ter no mínimo oito caractéres"}),
    confirmaSenha : z.string().min(8, {message : "A senha deve ter no mínimo oito caractéres"}),
    telefone : z.string().length(11, {message : "O telefone deve conter 11 digitos"}),
    tipoUsuario : z.string().min(1, {message : "Campo obrigatório"}),
    descricao : z.string().optional(),
    ativo : z.string(),
    imagemPerfil : z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, { message: "O arquivo deve ter no máximo 5MB" }),

})


export type usuarioValidatorSchema = z.infer<typeof usuarioValidator>;