export default class RespostaViaCepModel{

    bairro: string;
    localidade: string;
    logradouro: string;
    estado: string;

    constructor(
        bairro: string,
        localidade: string,
        logradouro: string,
        estado: string,
    ) {
        this.bairro = bairro;
        this.localidade = localidade;
        this.logradouro = logradouro;
        this.estado = estado;
    }
    
}