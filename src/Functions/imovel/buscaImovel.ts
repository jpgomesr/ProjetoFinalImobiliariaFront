import { ModelImovelGet } from "@/models/ModelImovelGet";

interface retornoGetImovel {

    quantidadeElementos : number,
    imoveis : ModelImovelGet[],
    pageableInfo : {
        totalPaginas : number, 
        ultima : boolean
    }

}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


export const buscarTodosImoveis = async (paginaAtual? : number) : Promise<retornoGetImovel> => { 


        try {
           const response = await fetch(
              `${BASE_URL}/imoveis?page=${paginaAtual}&ativo=true`
           );
           if (response.ok) {
              const data  = await response.json();

              const imoveis : ModelImovelGet[] = data.content
              const pageableInfo = {
                totalPaginas: data.totalPages,
                ultima: data.last,
              }
              const quantidadeElementos = data.totalElements

              return {
                imoveis,
                pageableInfo,
                quantidadeElementos
              }
           } else {
              console.error("Erro ao buscar os dados do imóvel");
           }
        } catch (error) {
           console.error("Erro ao buscar os dados do imóvel:", error);
        }
        throw new Error("Erro ao buscar usuarios")
     
}

export const buscarImovelPorId = async (id : string | number) : Promise<ModelImovelGet> => {


    const response = await fetch(`${BASE_URL}/imoveis/${id}`);

    const data = await response.json()

    return data as ModelImovelGet
}