
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const adicionarImovelFavorito = async (imovelId: number, idUsuario: string) => {
   const response = await fetch(`${BASE_URL}/usuarios/favoritos?idImovel=${imovelId}&idUsuario=${idUsuario}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }
   })

}

export const removerImovelFavorito = async (imovelId: number, idUsuario: string) => {
   const response = await fetch(`${BASE_URL}/usuarios/favoritos?idImovel=${imovelId}&idUsuario=${idUsuario}`, {
      method: 'DELETE'
   })
}




