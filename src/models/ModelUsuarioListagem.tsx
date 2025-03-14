export default class ModelUsuarioListagem {
    id: number;
    role: string;
    nome: string;
    email: string;
    foto: string;
    ativo: boolean;

    constructor(
        id: number,
        role: string,
        nome: string,
        email: string,
        foto: string,
        ativo: boolean
    ) {
        this.id = id;
        this.role = role;
        this.nome = nome;
        this.email = email;
        this.foto = foto;
        this.ativo = ativo;
    }
}
