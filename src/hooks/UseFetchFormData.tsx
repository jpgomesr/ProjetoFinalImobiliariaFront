export const UseFetchPostFormData = async (
   url: string,
   data: object,
   nomeObjeto: string,
   nomeArquivo : string,
   arquivo: File | null,
   method: string
) => {
   const formData = new FormData();

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
   });
};
