'use server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import ModelExibirCorretor from "@/models/ModelExibirCorretor";



export async function renderizarUsuariosApi(BASE_URL: string) {
    const response = await fetch(
       `${BASE_URL}/usuarios/corretorApresentacao/CORRETOR`
    );

    const data = (await response.json()) as ModelExibirCorretor[];

    setCorretores(data);
 };


