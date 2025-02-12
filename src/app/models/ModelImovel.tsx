export default class Imovel {
    tipo: string;
    favoritado: boolean;
    objImovel: string;
    valor: number;
    qtdFav: number;
    codigo: number;
    endereco: string;
    bairro: string;
    cidade: string;
    descricao: string;
    qtdBanheiros: number;
    qtdQuartos: number;
    qtdVagas: number;
    metragem: number;

    constructor(
        tipo: string,
        favoritado: boolean,
        objImovel: string,
        valor: number,
        qtdFav: number,
        codigo: number,
        endereco: string,
        bairro: string,
        cidade: string,
        descricao: string,
        qtdBanheiros: number,
        qtdQuartos: number,
        qtdVagas: number,
        metragem: number
    ) {
        this.tipo = tipo;
        this.favoritado = favoritado;
        this.objImovel = objImovel;
        this.valor = valor;
        this.qtdFav = qtdFav;
        this.codigo = codigo;
        this.endereco = endereco;
        this.bairro = bairro;
        this.cidade = cidade;
        this.descricao = descricao;
        this.qtdBanheiros = qtdBanheiros;
        this.qtdQuartos = qtdQuartos;
        this.qtdVagas = qtdVagas;
        this.metragem = metragem;
    }
}