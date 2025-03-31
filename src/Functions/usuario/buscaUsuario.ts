import ModelUsuario from "@/models/ModelUsuario";
import ModelUsuarioListagem from "@/models/ModelUsuarioListagem";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

interface retornoListaUsuarios {
    usuariosRenderizados : ModelUsuarioListagem[] | undefined,
    conteudoCompleto : {
        totalPages : number,
        last : boolean
    }
}

export const listarUsuarios =  async (numeroPagina:number, tipoUsuario?:string, status? : boolean, nomePesquisa?:string,tamanhoPagina? : number)  : Promise<retornoListaUsuarios> => {

    const response = await fetch(
        `${BASE_URL}/usuarios?role=${tipoUsuario}&ativo=${
           status}&nome=${nomePesquisa}&page=${numeroPagina}&size=${tamanhoPagina}`
     );

    const data = await response.json();

    return {
        usuariosRenderizados : data.content as ModelUsuarioListagem[], 
        conteudoCompleto : data
    }
}
export const buscarUsuarioPorId = async (id : string) => {

    const response = await fetch(`${BASE_URL}/usuarios/${id}`);

    const data = await response.json();

    return data as ModelUsuario

}
export const buscarIdsUsuarios = async () : Promise<number[]>=> {


    const response = await fetch(`${BASE_URL}/usuarios/lista-id-usuarios`)


    const data = await response.json();

    console.log("data" + data)

    return data as number[]

}


export const buscarTodosUsuarios = async () : Promise<ModelUsuarioListagem[]> => {
    const response = await fetch(`${BASE_URL}/usuarios/total`);
    const data = await response.json();
    return data as ModelUsuarioListagem[];
}