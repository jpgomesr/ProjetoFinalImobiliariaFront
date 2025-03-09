import ModelProprietario from "@/models/ModelProprietario";
import ModelProprietarioListagem from "@/models/ModelProprietarioListagem";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const buscarProprietarios = async () : Promise<ModelProprietarioListagem[]> => {


    const response = await fetch(
        `${BASE_URL}/proprietarios`
     );

    const data = await response.json();

    return data.content as ModelProprietarioListagem[]
}
export const buscarProprietarioPorId = async (id : number) : Promise<ModelProprietario> => {


    const response = await fetch(
        `${BASE_URL}/proprietarios/${id}`
     );

     const data = await response.json();

     return data.content as ModelProprietario
}