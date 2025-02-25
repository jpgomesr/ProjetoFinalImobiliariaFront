export default class ModelUsuario {
    id: number;
    role: string;
    nome: string;
    telefone: string;
    email: string;
    descricao: string;
    foto: string;
    ativo: boolean;

    constructor(
        id: number,
        role: string,
        nome: string,
        telefone: string,
        email: string,
        descricao: string,
        foto: string,
        ativo: boolean
    ) {
        this.id = id;
        this.role = role;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.descricao = descricao;
        this.foto = foto;
        this.ativo = ativo;
    }
}
