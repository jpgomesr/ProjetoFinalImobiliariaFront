import ModelProprietario from "@/models/ModelProprietario";
import ModelProprietarioListagem from "@/models/ModelProprietarioListagem";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

interface retornoListaProprietario {
    proprietariosRenderizados : ModelProprietarioListagem[] | undefined,
    conteudoCompleto : object
}

export const buscarProprietarios = async (numeroPagina? : number, nome? : string, tamanhoPagina?: number) : Promise<retornoListaProprietario> => {


    const response = await fetch(
        `${BASE_URL}/proprietarios?nome=${nome ? nome : ""}&page=${numeroPagina}&size=${tamanhoPagina}`
     );

    const data = await response.json();

    return {
        proprietariosRenderizados : data.content as ModelProprietarioListagem[],
        conteudoCompleto : data
    } 

}
export const buscarProprietarioPorId = async (id : string) : Promise<ModelProprietario> => {


    const response = await fetch(
        `${BASE_URL}/proprietarios/${id}`
     );

     const data = await response.json();



     return data as ModelProprietario
}