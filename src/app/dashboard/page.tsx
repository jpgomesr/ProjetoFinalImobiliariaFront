import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const page = async () => {
   const session = await getServerSession(authOptions);
   if (!session) {
      redirect("/");
   }
   console.log(session);
   return (
      <div className="p-4 bg-white rounded shadow">
         <h1 className="text-2xl font-bold mb-4">Painel de Controle</h1>
         <div className="space-y-2">
            <p>
               <strong>ID do Usuário:</strong>{" "}
               {session.user.id || "Não disponível"}
            </p>
            <p>
               <strong>Nome:</strong> {session.user.name || "Não disponível"}
            </p>
            <p>
               <strong>Email:</strong> {session.user.email || "Não disponível"}
            </p>
            <p>
               <strong>Função:</strong> {session.user.role || "Não disponível"}
            </p>
            <p>
               <strong>Foto:</strong>{" "}
               {session.user.image ? "Disponível" : "Não disponível"}
            </p>
            <div className="mt-4 p-2 bg-gray-100 rounded">
               <p className="font-semibold">Token de Acesso:</p>
               <p className="text-xs break-all mt-1">
                  {session.accessToken || "Não disponível"}
               </p>
            </div>
            <div className="mt-4 p-2 bg-gray-100 rounded">
               <p className="font-semibold">
                  Informações do Token Decodificado:
               </p>
               <div className="text-xs mt-1 space-y-1"></div>
            </div>
         </div>
      </div>
   );
};
export default page;
