import { redirect } from "next/navigation";
import { useFetchComAutorizacaoComToken } from "./FetchComAuthorization";

export const UseFetchPostFormData = async (
   url: string,
   data: object,
   nomeObjeto: string,
   nomeArquivo : string,
   arquivo: File | null,
   method: string,
   token: string
) => {
   const formData = new FormData();;

   formData.append(
      nomeObjeto,
      new Blob([JSON.stringify(data)], { type: "application/json" })
   );

   if (arquivo) {
      formData.append(nomeArquivo, arquivo);
   }

   const response = await useFetchComAutorizacaoComToken(url, {
      method,
      body: formData,
     
   }, token);

 

   return response;
};
