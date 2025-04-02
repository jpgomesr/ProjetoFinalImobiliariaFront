import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

// Versão para Server Components
export const fetchComAutorizacao = async (
   url: string | URL,
   init?: RequestInit
) => {
   const session = await getServerSession(authOptions);

   return await fetch(url, {
      ...init,
      headers: {
         ...(session?.accessToken ? { 'Authorization': `Bearer ${session.accessToken}` } : {})
      },
   });
};

export const useFetchComAutorizacaoComToken = async(   url: string | URL,
   init?: RequestInit, token? : string) => {
     
      return await fetch(url, {
         ...init,
         headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
         },
      });

   }