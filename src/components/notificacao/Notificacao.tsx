"use client";

import { Bell, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
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
         );

         if (!response.ok) {
            throw new Error(`Erro ao buscar notificações: ${response.status}`);
         }

         const data = await response.json();
         setNotificacoes(data);
      } catch (error) {
         console.error("Erro ao buscar notificações:", error);
      }
   }, [id, token]);

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
      }, 10000);

      return () => clearInterval(polling);
   }, [id, token]);

   const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
   };

   const handleLerNotificacao = async (id: number) => {
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

         // Atualiza apenas a notificação específica como lida
         setNotificacoes((prevNotificacoes) =>
            prevNotificacoes.map((notificacao) =>
               notificacao.id === id
                  ? { ...notificacao, lido: true }
                  : notificacao
            )
         );
      } catch (error) {
         console.error("Erro ao ler notificação:", error);
      }
   };

   const handleRemoverNotificacao = async (id: number) => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/notificacao/remover/${id}`,
            {
               method: "DELETE",
            }
         );

         if (!response.ok) {
            throw new Error(`Erro ao remover notificação: ${response.status}`);
         }

         setNotificacoes((prevNotificacoes) =>
            prevNotificacoes.filter((notificacao) => notificacao.id !== id)
         );
      } catch (error) {
         console.error("Erro ao remover notificação:", error);
      }
   };

   return (
      <div className="relative">
         <button onClick={handleClick} className="relative">
            <Bell className="md:w-7 md:h-7 2xl:w-8 2xl:h-8 text-white relative z-50" />
            {Array.isArray(notificacoes) &&
               notificacoes.some((notificacao) => !notificacao.lido) && (
                  <span className="absolute -top-[2px] -right-[2px] bg-red-500 rounded-full w-3 h-3"></span>
               )}
         </button>
         {isOpen && (
            <div
               className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 max-h-96 
               overflow-y-auto hide-scrollbar md:w-72"
            >
               <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-50">
                  <h2 className="text-lg font-semibold text-gray-800">
                     Notificações
                  </h2>
               </div>
               {Array.isArray(notificacoes) && notificacoes.length > 0 ? (
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
                              className="p-3 hover:bg-gray-50 transition-colors relative text-left cursor-pointer"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleLerNotificacao(notificacao.id);
                              }}
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
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleRemoverNotificacao(notificacao.id);
                                    }}
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
         )}
      </div>
   );
};

const Notificacao = () => {
   return (
      <SessionProvider>
         <NotificacaoContent />
      </SessionProvider>
   );
};

export default Notificacao;
