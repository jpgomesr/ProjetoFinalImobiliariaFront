import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization"


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const adicionarImovelFavorito = async (imovelId: number, token: string) => {
   const response = await useFetchComAutorizacaoComToken(`${BASE_URL}/usuarios/favoritos?idImovel=${imovelId}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }
   }, token)

}

export const removerImovelFavorito = async (imovelId: number, token: string) => {
   const response = await useFetchComAutorizacaoComToken(`${BASE_URL}/usuarios/favoritos?idImovel=${imovelId}`, {
      method: 'DELETE'
   }, token)
}




