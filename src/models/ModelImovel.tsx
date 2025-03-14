import { TipoBanner } from "./Enum/TipoBanner";
import { ModelCorretor } from "./ModelCorretor";

export default interface Imovel {
   id: number;
   titulo: string;
   favoritado: boolean;
   objImovel: string;
   preco: number;
   precoPromocional: number;
   iptu: number;
   valorCondominio: number;
   codigo: number;
   descricao: string;
   qtdBanheiros: number;
   qtdQuartos: number;
   qtdGaragens: number;
   qtdChurrasqueira: number;
   qtdPiscina: number;
   tamanho: number;
   banner: boolean;
   tipoBanner: TipoBanner;
   academia: boolean;
   destaque: boolean;
   visibilidade: boolean;
   imagens: {
      imagemPrincipal: File | null | string;
      imagensGaleria: (File | null | string)[];
   };
   proprietario: {
      id: number;
   };
   corretores: ModelCorretor[];
   endereco: {
      bairro: string;
      cep: number;
      cidade: string;
      estado: string;
      numeroApartamento: number;
      numeroCasaPredio: number;
      tipoResidencia: string;
      rua: string;
   };
}
