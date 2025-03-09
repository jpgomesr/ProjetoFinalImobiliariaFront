export default class ModelEndereco {
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
        idEndereco : number,
        bairro : string,
        cidade : string,
        estado : string,
        rua : string ,
        cep : string,
        tipoResidencia : string,
        numeroCasaPredio : number,
        numeroApartamento : number,
    ){
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
