import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export const UseFetchPostFormData = async (
   url: string,
   data: object,
   nomeObjeto: string,
   nomeArquivo : string,
   arquivo: File | null,
   method: string
) => {
   const formData = new FormData();
   const session = await getServerSession(authOptions);

   formData.append(
      nomeObjeto,
      new Blob([JSON.stringify(data)], { type: "application/json" })
   );

   if (arquivo) {
      formData.append(nomeArquivo, arquivo);
   }

   return await fetch(url, {
      method,
      body: formData,
      headers:{
         "Authorization" : `Bearrer ${session?.accessToken || ""}`
      }
   });
};
