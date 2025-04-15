import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { redirect} from "next/navigation";

// Versão para Server Components
export const fetchComAutorizacao = async (
   url: string | URL,
   init?: RequestInit
) => {
   const session = await getServerSession(authOptions);

    const response = await fetch(url, {
      ...init,
      headers: {
         ...(session?.accessToken ? { 'Authorization': `Bearer ${session.accessToken}` } : {})
      },
   });
      if(response.status === 401 || response.status === 403){
         console.log('to chegando aqui')
         redirect('/logout')
      }
      

   return response;
   };

export const useFetchComAutorizacaoComToken = async(   url: string | URL,
   init?: RequestInit, token? : string) => {

      "use client"
     

     const response = await fetch(url, {
         ...init,
         headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...init?.headers
         },
      });


      return response;  
}

