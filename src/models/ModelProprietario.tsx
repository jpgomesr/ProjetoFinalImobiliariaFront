import ModelEndereco from "./ModelEndereco";

export default interface  ModelProprietario {
    id: number;
    nome : string;
    telefone : string;
    celular : string;
    cpf : string;
    email : string;
    imagemUrl: string;
    endereco : ModelEndereco
 }
 