import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { TipoImovelEnum } from "@/models/Enum/TipoImovelEnum";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import { getServerSession } from "next-auth";
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
    revalidate?: number,
    idUsuario?: string
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
        idUsuario: parametros?.idUsuario || '',
        sort: parametros?.sort || ''
    });
      
    try {
        const responseImovelRequest = await fetch(
            `${BASE_URL}/imoveis?${params.toString()}`,
            {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
     
        if (responseImovelRequest.ok) {
            const dataImovel = await responseImovelRequest.json();

            const imoveis: ModelImovelGet[] = dataImovel.content;
            
            const pageableInfo = {
                totalPaginas: dataImovel.totalPages,
                ultima: dataImovel.last,
            };
            const quantidadeElementos = dataImovel.totalElements;

            return {
                imoveis,
                pageableInfo,
                quantidadeElementos,
            };
        } else {
            throw new Error("Erro ao buscar os dados do imóvel");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do imóvel:", error);
        return {
            imoveis: [],
            pageableInfo: {
                totalPaginas: 0,
                ultima: true
            },
            quantidadeElementos: 0
        };
    }
};

export const buscarImoveisFavoritos = async (
   userId: string,
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
        idUsuario: parametros?.idUsuario || '',
        sort: parametros?.sort || ''
      });
      
   try {
      const response = await fetch(
         `${BASE_URL}/usuarios/${userId}/favoritos?${params.toString()}`,
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
         console.error("Erro ao buscar os imóveis favoritos: " + response.status);
      }
   } catch (error) {
      console.error("Erro ao buscar os imóveis favoritos:", error);
   }
   throw new Error("Erro ao buscar imóveis favoritos");
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

export const buscarIdsImoveisFavoritados = async (userId: string) : Promise<number[]> => {
   
   const response = await fetch(`${BASE_URL}/usuarios/ids-imoveis-favoritados/${userId}`)

   const data = await response.json()
   return data as number[]
}