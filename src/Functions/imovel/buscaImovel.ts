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
    paginaAtual?: string,
    ativo?: string,
    descricao?: string,
    tamanhoMin?: string,
    tamanhoMax?: string,
    tipoResidencia?: string,
    qtdQuartos?: string,
    qtdBanheiros?: string,
    qtdGaragens?: string,
    precoMinimo?: string,
    precoMaximo?: string,
    finalidade?: string,
    cidade?: string,
    bairro?: string,
    destaque?: string,
    sort?: string,
    condicoesEspeciais?: string,
    revalidate?: number
}


export const buscarTodosImoveis = async (
   parametros? : parametrosBuscaImovel
): Promise<retornoGetImovel> => {
    const params = new URLSearchParams({
        page: parametros?.paginaAtual?.toString() || '', 
        ativo: parametros?.ativo?.toString() || "true",
        descricao: parametros?.descricao || '',
        tamanhoMinimo: parametros?.tamanhoMin?.toString() || '',
        tamanhoMaximo: parametros?.tamanhoMax?.toString() || '',
        tipoResidencia: parametros?.tipoResidencia?.toString() || '', 
        qtdQuartos: parametros?.qtdQuartos?.toString() || '',
        qtdBanheiros: parametros?.qtdBanheiros?.toString() || '',
        qtdGaragens: parametros?.qtdGaragens?.toString() || '',
        precoMinimo: parametros?.precoMinimo?.toString() || '', 
        precoMaximo: parametros?.precoMaximo?.toString() || '', 
        finalidade: parametros?.finalidade?.toUpperCase() || '', 
        cidade: parametros?.cidade || '', 
        bairro: parametros?.bairro || '',
        condicoesEspeciais: parametros?.condicoesEspeciais === 'true' ? 'true' : 'false',
        destaque: parametros?.destaque === 'true' ? 'true' : 'false',
        sort: parametros?.sort || ''
      });
      
   try {
      const response = await fetch(
         `${BASE_URL}/imoveis?${params.toString()}`,
         {
            next: parametros?.revalidate ? { revalidate: parametros.revalidate } : undefined
         }
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
         console.error("Erro ao buscar os dados do imóvel" + response.status);
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

export const buscarIdsImoveis = async () : Promise<number[]> => {

   const response = await fetch(`${BASE_URL}/imoveis/ids-imoveis`)

   const data = await response.json()

   return data as number[]
}
