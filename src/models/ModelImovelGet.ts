import { EnderecoMapBox } from "./ModelEnrecoMapBox";

interface Endereco {
   bairro: string;
   cidade: string;
   rua: string;
   tipoResidencia: string;
   cep: number;
   estado: string;
   numeroCasaPredio: number;
   numeroApartamento: number;
}

interface Imagem {
   id: number;
   imagemCapa: boolean;
   referencia: string;
}

interface Pessoa {
   id: number;
   nome: string;
}

export interface ModelImovelGet {
   banner: boolean;
   destaque: boolean;
   descricao: string;
   endereco: Endereco;
   finalidade: string;
   ativo: boolean;
   id: number;
   imagens: Imagem[];
   permitirDestaque: boolean;
   preco: number;
   precoPromocional: number;
   qtdBanheiros: number;
   qtdGaragens: number;
   qtdQuartos: number;
   tamanho: number;
   tipoBanner: string;
   titulo: string;
   qtdPiscina: number;
   qtdChurrasqueira: number;
   iptu: number;
   valorCondominio: number;
   academia: boolean;
   proprietario: Pessoa;
   corretores: Pessoa[];
   favoritado?: boolean;
}

export interface ModelImovelGetId {
   id: number;
   titulo: string;
   descricao: string;
   preco: number;
   precoPromocional?: number;
   iptu: string;
   condominio: string;
   tamanho: string;
   qtdBanheiros: number;
   qtdQuartos: number;
   qtdGaragens: number;
   qtdPiscina: number;
   qtdChurrasqueira: number;
   imagens: {
      id: number;
      imagemCapa: boolean;
      referencia: string;
   }[];
   corretores: {
      id: number;
      nome: string;
      email: string;
      telefone: string;
      foto: string;
   }[];
   proprietario: Pessoa;
   endereco: EnderecoMapBox;
   favoritado: boolean;
   ativo: boolean;
}

export interface ImovelSemelhanteModel {
   id: number;
   titulo: string;
   preco: number;
   precoPromocional?: number;
   qtdBanheiros: number;
   qtdQuartos: number;
   imagens: {
      id: number;
      imagemCapa: boolean;
      referencia: string;
   }[];
}
