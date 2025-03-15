import { TipoImovelEnum } from "@/models/Enum/TipoImovelEnum";
import { ModelImovelGet } from "@/models/ModelImovelGet";

interface retornoGetImovel {
   quantidadeElementos: number;
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
   };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export interface parametrosBuscaImovel {
    paginaAtual?: number,
    ativo?: string,
    descricao?: string,
    tamanho?: number,
    tipoResidencia?: TipoImovelEnum,
    qtdQuartos?: number,
    qtdBanheiros?: number,
    qtdGaragens?: number,
    precoMin?: number,
    precoMax?: number,
    finalidade?: string,
    cidade?: string,
    bairro?: string
}


export const buscarTodosImoveis = async (
   parametros? : parametrosBuscaImovel
): Promise<retornoGetImovel> => {
    const params = new URLSearchParams({
        page: parametros?.paginaAtual?.toString() || '', 
        ativo: parametros?.ativo?.toString() || "true",
        descricao: parametros?.descricao || '',
        tamanho: parametros?.tamanho?.toString() || '',
        tipoResidencia: parametros?.tipoResidencia?.toString() || '', 
        qtdQuartos: parametros?.qtdQuartos?.toString() || '',
        qtdBanheiros: parametros?.qtdBanheiros?.toString() || '',
        qtdGaragens: parametros?.qtdGaragens?.toString() || '',
        precoMin: parametros?.precoMin?.toString() || '', 
        precoMax: parametros?.precoMax?.toString() || '', 
        finalidade: parametros?.finalidade || '', 
        cidade: parametros?.cidade || '', 
        bairro: parametros?.bairro || '', 
      });

   try {
      const response = await fetch(
         `${BASE_URL}/imoveis?${params.toString()}`
      );
      if (response.ok) {
         const data = await response.json();

         const imoveis: ModelImovelGet[] = data.content;
         const pageableInfo = {
            totalPaginas: data.totalPages,
            ultima: data.last,
         };
         const quantidadeElementos = data.totalElements;

         return {
            imoveis,
            pageableInfo,
            quantidadeElementos,
         };
      } else {
         console.error("Erro ao buscar os dados do imóvel");
      }
   } catch (error) {
      console.error("Erro ao buscar os dados do imóvel:", error);
   }
   throw new Error("Erro ao buscar usuarios");
};

export const buscarImovelPorId = async (
   id: string | number
): Promise<ModelImovelGet> => {
   const response = await fetch(`${BASE_URL}/imoveis/${id}`);

   const data = await response.json();

   return data as ModelImovelGet;
};
