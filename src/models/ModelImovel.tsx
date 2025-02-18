export default class Imovel {
   tipo: string;
   favoritado: boolean;
   objImovel: string;
   valor: number;
   codigo: number;
   endereco: string;
   bairro: string;
   cidade: string;
   descricao: string;
   qtdBanheiros: number;
   qtdQuartos: number;
   qtdVagas: number;
   metragem: number;
   banner: boolean;
   tipoBanner: string;

   constructor(
      tipo: string,
      favoritado: boolean,
      objImovel: string,
      valor: number,
      codigo: number,
      endereco: string,
      bairro: string,
      cidade: string,
      descricao: string,
      qtdBanheiros: number,
      qtdQuartos: number,
      qtdVagas: number,
      metragem: number,
      banner: boolean,
      tipoBanner: string
   ) {
      this.tipo = tipo;
      this.favoritado = favoritado;
      this.objImovel = objImovel;
      this.valor = valor;
      this.codigo = codigo;
      this.endereco = endereco;
      this.bairro = bairro;
      this.cidade = cidade;
      this.descricao = descricao;
      this.qtdBanheiros = qtdBanheiros;
      this.qtdQuartos = qtdQuartos;
      this.qtdVagas = qtdVagas;
      this.metragem = metragem;
      this.banner = banner;
      this.tipoBanner = tipoBanner;
   }
}
