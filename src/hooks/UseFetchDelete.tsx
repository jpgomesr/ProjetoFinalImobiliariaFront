export const UseFetchDelete = async (url: string) => {
   return await fetch(url, {
      method: "DELETE",
   });
};
