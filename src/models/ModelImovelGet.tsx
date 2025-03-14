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
   destaque : boolean;
   descricao: string;
   endereco: Endereco;
   finalidade: string;
   habilitarVisibilidade: boolean;
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
}
