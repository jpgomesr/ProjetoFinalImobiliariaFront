export default class ModelProprietarioListagem {
    id: number;
    nome : string;
    telefone : string;
    cpf : string;
    email : string;
    imagemUrl: string;
    ativo : boolean;
 
 
    constructor(
        id: number,
        nome : string,
        telefone : string,
        cpf : string,
        email : string,
        imagemUrl: string,
        ativo : boolean
    ) {
       this.id = id;
       this.nome = nome;
       this.telefone = telefone;
       this.cpf = cpf;
       this.email = email;
       this.imagemUrl = imagemUrl;
       this.ativo = ativo;
    }
 }
 