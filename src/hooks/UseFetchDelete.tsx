export const UseFetchDelete = async (url: string) => {
   console.log(url);

   return await fetch(url, {
      method: "DELETE",
   });
};
