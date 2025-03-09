export default class ModelProprietario {
    id: number;
    nome : string;
    telefone : string;
    cpf : string;
    email : string;
    imagemUrl: string;
    idEndereco : number;
    bairro : string;
    cidade : string;
    estado : string;
    rua : string ;
    cep : string;
    tipoResidencia : string;
    numeroCasaPredio : number;
    numeroApartamento : number;
 
 
    constructor(
        id: number,
        nome : string,
        telefone : string,
        cpf : string,
        email : string,
        imagemUrl: string,
        idEndereco : number,
        bairro : string,
        cidade : string,
        estado : string,
        rua : string ,
        cep : string,
        tipoResidencia : string,
        numeroCasaPredio : number,
        numeroApartamento : number,
    ) {
       this.id = id;
       this.nome = nome;
       this.telefone = telefone;
       this.cpf = cpf;
       this.email = email;
       this.imagemUrl = imagemUrl;
       this.idEndereco = idEndereco;
       this.bairro = bairro;
       this.cidade = cidade;
       this.estado = estado;
       this.rua = rua ;
       this.cep = cep;
       this.tipoResidencia = tipoResidencia;
       this.numeroCasaPredio = numeroCasaPredio;
       this.numeroApartamento = numeroApartamento;
    }
 }
 