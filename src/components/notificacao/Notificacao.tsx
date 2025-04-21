"use client";

import { Bell, X } from "lucide-react";
import { useSession, SessionProvider } from "next-auth/react";
import React, { useState, useEffect, useCallback } from "react";
import { ModelNotificacao } from "@/models/ModelNotificacao";

const NotificacaoContent = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [notificacoes, setNotificacoes] = useState<ModelNotificacao[]>([]);

   const { data: session } = useSession();
   const token = session?.accessToken ? (session.accessToken as string) : "";
   const id = session?.user?.id ?? "";

   const fetchNotificacoes = useCallback(async () => {
      if (!id || !token) return;

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/notificacao/list/${id}`
            // ,{
            //    headers: {
            //       Authorization: `Bearer ${token}`,
            //    },
            // }
         );

         if (!response.ok) {
            throw new Error(`Erro ao buscar notificações: ${response.status}`);
         }

         const data = await response.json();

         console.log(data);
         setNotificacoes(data);
      } catch (error) {
         console.error("Erro ao buscar notificações:", error);
      }
   }, [id, token, notificacoes.length]);

   useEffect(() => {
      if (id && token) {
         fetchNotificacoes();
      }
   }, [id, token, fetchNotificacoes]);

   useEffect(() => {
      if (!id || !token) return;

      const polling = setInterval(async () => {
         try {
            const response = await fetch(
               `${process.env.NEXT_PUBLIC_BASE_URL}/notificacao/${id}`
               // ,{
               //    headers: {
               //       Authorization: `Bearer ${token}`,
               //    },
               // }
            );

            if (!response.ok) {
               throw new Error(
                  `Erro ao buscar notificações: ${response.status}`
               );
            }

            const data: ModelNotificacao[] = await response.json();
            if (data.length > 0) {
               setNotificacoes((prev) => [...data, ...prev]);
            }
         } catch (error) {
            console.error("Erro ao buscar notificações:", error);
         }
      }, 10000); // Polling a cada 10 segundos

      return () => clearInterval(polling);
   }, [id, token]);

   const handleClick = () => {
      setIsOpen(!isOpen);
   };

   const handleLerNotificacao = async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/notificacao/ler/${id}`,
            {
               method: "POST",
            }
         );

         if (!response.ok) {
            throw new Error(`Erro ao ler notificação: ${response.status}`);
         }

         const data = await response.json();
         console.log(data);
         setNotificacoes(data);
      } catch (error) {
         console.error("Erro ao ler notificação:", error);
      }
   };

   return (
      <button onClick={handleClick} className="relative">
         <Bell
            className="md:w-7 md:h-7 2xl:w-8 2xl:h-8 text-white relative z-50"
            onClick={handleLerNotificacao}
         />
         {notificacoes.some((notificacao) => !notificacao.lido) && (
            <span className="absolute -top-[2px] -right-[2px] bg-red-500 rounded-full w-3 h-3"></span>
         )}
         {isOpen && (
            <>
               <div className="fixed inset-0 z-40 bg-black opacity-50 cursor-default" />
               <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto hide-scrollbar 
               md:w-72">
                  <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-50">
                     <h2 className="text-lg font-semibold text-gray-800">
                        Notificações
                     </h2>
                  </div>
                  {notificacoes.length > 0 ? (
                     <div className="divide-y divide-gray-100 overflow-hidden">
                        {notificacoes
                           .sort(
                              (a, b) =>
                                 new Date(b.dataCriacao).getTime() -
                                 new Date(a.dataCriacao).getTime()
                           )
                           .map((notificacao, key) => (
                              <div
                                 key={key}
                                 className="p-3 hover:bg-gray-50 transition-colors relative text-left"
                              >
                                 <h3 className="text-sm font-medium text-gray-800 truncate">
                                    {notificacao.titulo}
                                 </h3>
                                 <p className="text-xs text-gray-600 mt-1 truncate">
                                    {notificacao.descricao}
                                 </p>
                                 {notificacao.lido === false ? (
                                    <span className="absolute top-1 right-1 bg-red-500 rounded-full w-3 h-3"></span>
                                 ) : (
                                    <X
                                       className="w-4 h-4 text-black absolute top-1 right-1"
                                       onClick={handleLerNotificacao}
                                    />
                                 )}
                                 <p className="text-xs text-gray-400 mt-1 text-right italic text-[10px]">
                                    {new Date(
                                       notificacao.dataCriacao
                                    ).toLocaleString()}
                                 </p>
                              </div>
                           ))}
                     </div>
                  ) : (
                     <div className="p-4 text-center text-gray-500">
                        Nenhuma notificação disponível
                     </div>
                  )}
               </div>
            </>
         )}
      </button>
   );
};

const Notificacao = () => (
   <SessionProvider>
      <NotificacaoContent />
   </SessionProvider>
);

export default Notificacao;
