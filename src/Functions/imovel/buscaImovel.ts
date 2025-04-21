import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import {
   fetchComAutorizacao,
   useFetchComAutorizacaoComToken,
} from "@/hooks/FetchComAuthorization";
import { TipoImovelEnum } from "@/models/Enum/TipoImovelEnum";
import {
   ModelImovelGet,
   ModelImovelGetId,
   ImovelSemelhanteModel,
} from "@/models/ModelImovelGet";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
interface retornoGetImovel {
   quantidadeElementos: number;
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
      paginaAtual: number;
   };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface parametrosBuscaImovel {
   paginaAtual?: string;
   ativo?: string;
   descricao?: string;
   tamanhoMin?: string;
   tamanhoMax?: string;
   tipoResidencia?: string;
   qtdQuartos?: string;
   qtdBanheiros?: string;
   qtdGaragens?: string;
   precoMinimo?: string;
   precoMaximo?: string;
   finalidade?: string;
   cidade?: string;
   bairro?: string;
   destaque?: string;
   sort?: string;
   condicoesEspeciais?: string;
   revalidate?: number;
   idUsuario?: string;
   noUseSession?: string;
   cache?: RequestCache;
   buscarIndependenteAtivo?: boolean;
   buscarArquivados?: boolean;
   imovelDescTitulo?: string;
}

export const buscarTodosImoveis = async (
   parametros?: parametrosBuscaImovel
): Promise<retornoGetImovel> => {
   const params = new URLSearchParams({
      page: parametros?.paginaAtual?.toString() || "",
      ativo: parametros?.ativo?.toString() || "",
      descricao: parametros?.descricao || "",
      tamanhoMinimo: parametros?.tamanhoMin?.toString() || "",
      tamanhoMaximo: parametros?.tamanhoMax?.toString() || "",
      tipoResidencia: parametros?.tipoResidencia?.toString() || "",
      qtdQuartos: parametros?.qtdQuartos?.toString() || "",
      qtdBanheiros: parametros?.qtdBanheiros?.toString() || "",
      qtdGaragens: parametros?.qtdGaragens?.toString() || "",
      precoMinimo: parametros?.precoMinimo?.toString() || "",
      precoMaximo: parametros?.precoMaximo?.toString() || "",
      finalidade: parametros?.finalidade?.toUpperCase() || "",
      cidade: parametros?.cidade || "",
      bairro: parametros?.bairro || "",
      condicoesEspeciais:
         parametros?.condicoesEspeciais === "true" ? "true" : "false",
      destaque: parametros?.destaque === "true" ? "true" : "false",
      idUsuario: parametros?.idUsuario || "",
      sort: parametros?.sort || "", 
      buscarArquivados: parametros?.buscarArquivados === true ? "true" : "false",
      imovelDescTitulo: parametros?.imovelDescTitulo || "",
   });

   if (parametros?.buscarIndependenteAtivo) {
      params.set("ativo", "");
   }

   const session = await getServerSession(authOptions);

      const responseImovelRequest = await fetchComAutorizacao(
         `${BASE_URL}/imoveis?${params.toString()}`,
         {
            method: "GET",
            cache: parametros?.cache,
            headers: {
               "Content-Type": "application/json",
            },
            next: {
               revalidate: parametros?.revalidate || 0,
            },
         }
      );
      console.log("responseImovelRequest", responseImovelRequest.status);
      if(responseImovelRequest.status === 401 || responseImovelRequest.status === 403){
         console.log("Token expirado ou não autorizado");
         redirect('http://localhost:3000/api/auth/manual-sign-out')
      }  

      if (responseImovelRequest.ok) {
         const dataImovel = await responseImovelRequest.json();

         const imoveis: ModelImovelGet[] = dataImovel.content;

         if (session?.user) {
            const idsImoveisFavoritados = await buscarIdsImoveisFavoritados(
               session?.user?.id || "",
               session?.accessToken ?? ""
            );

            imoveis.forEach((imovel) => {
               imovel.favoritado = idsImoveisFavoritados.includes(imovel.id);
            });
         }

         const pageableInfo = {
            totalPaginas: dataImovel.totalPages,
            ultima: dataImovel.last,
            paginaAtual: dataImovel.pageable.pageNumber,
         };
         const quantidadeElementos = dataImovel.totalElements;

         return {
            imoveis,
            pageableInfo,
            quantidadeElementos,
         };
      } else {
         return {
            imoveis: [],
            pageableInfo: {
               totalPaginas: 0,
               ultima: true,
               paginaAtual: 0,
            },
            quantidadeElementos: 0,
         };
      }
};

// export const buscarImoveisFavoritos = async (
//    userId: string,
//    parametros?: parametrosBuscaImovel
// ): Promise<retornoGetImovel> => {
//    const params = new URLSearchParams({
//       page: parametros?.paginaAtual?.toString() || "",
//       ativo: parametros?.ativo?.toString() || "true",
//       descricao: parametros?.descricao || "",
//       tamanhoMinimo: parametros?.tamanhoMin?.toString() || "",
//       tamanhoMaximo: parametros?.tamanhoMax?.toString() || "",
//       tipoResidencia: parametros?.tipoResidencia?.toString() || "",
//       qtdQuartos: parametros?.qtdQuartos?.toString() || "",
//       qtdBanheiros: parametros?.qtdBanheiros?.toString() || "",
//       qtdGaragens: parametros?.qtdGaragens?.toString() || "",
//       precoMinimo: parametros?.precoMinimo?.toString() || "",
//       precoMaximo: parametros?.precoMaximo?.toString() || "",
//       finalidade: parametros?.finalidade?.toUpperCase() || "",
//       cidade: parametros?.cidade || "",
//       bairro: parametros?.bairro || "",
//       condicoesEspeciais:
//          parametros?.condicoesEspeciais === "true" ? "true" : "false",
//       destaque: parametros?.destaque === "true" ? "true" : "false",
//       idUsuario: parametros?.idUsuario || "",
//       sort: parametros?.sort || "",
//    });

//    try {
//       const response = await fetch(
//          `${BASE_URL}/usuarios/${userId}/favoritos?${params.toString()}`,
//          {
//             next: parametros?.revalidate
//                ? { revalidate: parametros.revalidate }
//                : undefined,
//          }
//       );
//       if (response.ok) {
//          const data = await response.json();

//          const imoveis: ModelImovelGet[] = data.content;

//          const pageableInfo = {
//             totalPaginas: data.totalPages,
//             ultima: data.last,
//          };
//          const quantidadeElementos = data.totalElements;

//          console.log("Imóveis favoritos encontrados:", imoveis);
//          console.log("Quantidade de imóveis favoritos:", quantidadeElementos);

//          return {
//             imoveis,
//             pageableInfo: {
//                ...pageableInfo,
//                paginaAtual: parseInt(params.paginaAtual),
//             },
//             quantidadeElementos,
//          };
//       } else {
//          console.error(
//             "Erro ao buscar os imóveis favoritos: " + response.status
//          );
//       }
//    } catch (error) {
//       console.error("Erro ao buscar os imóveis favoritos:", error);
//    }
//    throw new Error("Erro ao buscar imóveis favoritos");
// };

export const buscarImovelPorId = async (
   id: string | number
): Promise<ModelImovelGet> => {
   const response = await fetch(`${BASE_URL}/imoveis/${id}`);

   const data = await response.json();

   return data as ModelImovelGet;
};
export const buscarImovelPorIdPaginaImovel = async (
   id: string | number,
   revalidate?: number
): Promise<ModelImovelGetId> => {
   const response = await fetch(`${BASE_URL}/imoveis/${id}`, {
      next: revalidate ? { revalidate: revalidate } : undefined,
   });

   const imovel = (await response.json()) as ModelImovelGetId;

   const session = await getServerSession(authOptions);

   if (session?.user) {
      const idsImoveisFavoritados = await buscarIdsImoveisFavoritados(
         session?.user?.id || "",
         session?.accessToken ?? ""
      );

      imovel.favoritado = idsImoveisFavoritados.includes(imovel.id);
   }

   return imovel as ModelImovelGetId;
};

export const buscarIdsImoveis = async (): Promise<number[]> => {
   const response = await fetch(`${BASE_URL}/imoveis/ids-imoveis`);

   const data = await response.json();
   return data as number[];
};

export const buscarIdsImoveisFavoritados = async (
   userId: string,
   token: string
): Promise<number[]> => {
   const response = await useFetchComAutorizacaoComToken(
      `${BASE_URL}/usuarios/ids-imoveis-favoritados`,
      {
         method: "GET",
      },
      token
   );

   const data = await response.json();
   return data as number[];
};

export const buscarImoveisSemelhantes = async (
   imovel: ModelImovelGetId,
   revalidate?: number
) => {
   try {
      const { imoveis } = await buscarTodosImoveis({
         ativo: "true",
         precoMaximo: (imovel.preco * 1.2).toString(),
         precoMinimo: (imovel.preco * 0.8).toString(),
         qtdBanheiros: imovel.qtdBanheiros.toString(),
         qtdQuartos: imovel.qtdQuartos.toString(),
         cidade: imovel.endereco.cidade,
         bairro: imovel.endereco.bairro,
         revalidate: revalidate,
         noUseSession: "true",
         cache: "force-cache",
      });
      if (imoveis.length === 0) {
         return [];
      }

      const imoveisSemelhantes = imoveis.filter(
         (imovelFiltrado) => imovelFiltrado.id !== imovel.id
      );

      return imoveisSemelhantes as ModelImovelGet[];
   } catch (error) {
      console.error("Erro ao buscar imóveis semelhantes:", error);
   }
};
