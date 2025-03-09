export default class ModelProprietarioListagem {
    id: number;
    nome : string;
    telefone : string;
    cpf : string;
    email : string;
    imagemUrl: string;
 
 
    constructor(
        id: number,
        nome : string,
        telefone : string,
        cpf : string,
        email : string,
        imagemUrl: string
    ) {
       this.id = id;
       this.nome = nome;
       this.telefone = telefone;
       this.cpf = cpf;
       this.email = email;
       this.imagemUrl = imagemUrl;
    }
 }
 