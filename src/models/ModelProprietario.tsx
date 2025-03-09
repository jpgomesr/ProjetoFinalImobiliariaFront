import ModelEndereco from "./ModelEndereco";

export default class ModelProprietario {
    id: number;
    nome : string;
    telefone : string;
    celular : string;
    cpf : string;
    email : string;
    imagemUrl: string;
    endereco : ModelEndereco
   
 
 
    constructor(
        id: number,
        nome : string,
        telefone : string,
        cpf : string,
        celular : string,
        email : string,
        imagemUrl: string,
        endereco : ModelEndereco
    ) {
       this.id = id;
       this.nome = nome;
       this.telefone = telefone;
       this.cpf = cpf;
       this.email = email;
       this.imagemUrl = imagemUrl;
       this.endereco = endereco
       this.celular = celular;
    }
 }
 