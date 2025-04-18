"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
   const searchParams = useSearchParams();
   const error = searchParams.get("error");
   const errorDescription = searchParams.get("error_description");

   console.log("Erro completo:", {
      error,
      errorDescription,
      allParams: Object.fromEntries([...searchParams.entries()]),
   });

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-havprincipal mb-2">
                  Erro na Autenticação
               </h2>
               <div className="text-gray-600 mb-4 space-y-2">
                  <p className="font-semibold">Tipo do erro: {error}</p>
                  {errorDescription && (
                     <p className="text-sm">Descrição: {errorDescription}</p>
                  )}
                  <pre className="text-left text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                     {JSON.stringify(
                        Object.fromEntries([...searchParams.entries()]),
                        null,
                        2
                     )}
                  </pre>
               </div>
               <Link
                  href="/autenticacao/login"
                  className="inline-block bg-havprincipal text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
               >
                  Voltar para o Login
               </Link>
            </div>
         </div>
      </div>
   );
}
