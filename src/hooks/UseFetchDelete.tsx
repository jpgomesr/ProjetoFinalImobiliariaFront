

export const UseFetchDelete = async (url: string, token: string) => {
   return await fetch(url, {
      method: "DELETE",
      headers:{
         "Authorization" : `Bearrer ${token}`
      }
   });
};
