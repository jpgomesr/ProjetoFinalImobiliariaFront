"use client";

import React, { useState } from "react";
import Image from "next/image";
import FotoUsuarioDeslogado from "../FotoUsuarioDeslogado";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";

interface CardCorretorProps {
   corretores?: ModelExibirCorretor[];
}

const CorretoresContent = (props: CardCorretorProps) => {
   const session = useSession();
   const idUsuario = session.data?.user?.id;
   const router = useRouter();

   const handleCreateChat = async (corretor: ModelExibirCorretor) => {
      if (!idUsuario) {
         // Usar encodeURIComponent para garantir que a URL seja codificada corretamente
         const currentPath = encodeURIComponent(window.location.pathname);
         router.push(`/api/auth/signin?callbackUrl=${currentPath}`);
         return;
      }

      try {
         const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
         const endpoint = `/chat/${corretor.id}/${idUsuario}`;
         const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken}`,
         };

         // Tenta criar o chat primeiro
         const response = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers,
         });

         // Se o chat já existe (código 422), busca o chat existente
         if (response.status === 422) {
            const chatResponse = await fetch(`${baseUrl}${endpoint}`, {
               method: "GET",
               headers,
            });

            if (!chatResponse.ok) {
               throw new Error("Falha ao buscar chat existente");
            }

            const data = await chatResponse.json();
            // Navegue primeiro para a página do chat sem parâmetros
            // e depois para o chat específico para garantir inicialização correta
            await router.push("/chat");

            // Pequeno atraso para garantir que a página carregou e o ChatProvider foi inicializado
            setTimeout(() => {
               router.push(`/chat?chat=${data.idChat}`);
            }, 100);

            return;
         }

         // Se a criação falhou por outro motivo
         if (!response.ok) {
            throw new Error("Erro ao criar chat");
         }

         // Se a criação foi bem-sucedida
         const data = await response.json();

         // Navegue primeiro para a página do chat sem parâmetros
         // e depois para o chat específico para garantir inicialização correta
         await router.push("/chat");

         // Pequeno atraso para garantir que a página carregou e o ChatProvider foi inicializado
         setTimeout(() => {
            router.push(`/chat?chat=${data.idChat}`);
         }, 100);
      } catch (error) {
         console.error("Erro na operação de chat:", error);
         router.push("/chat");
      }
   };

   return (
      <div className="justify-center flex flex-row gap-4">
         {props.corretores?.map((corretor, i) => (
            <div
               key={i}
               className="flex-col rounded-full flex justify-center items-center cursor-pointer"
               onClick={() => handleCreateChat(corretor)}
            >
               {corretor.foto ? (
                  <Image
                     src={corretor.foto}
                     alt="Imagem corretor"
                     width={1920}
                     height={1080}
                     className="border-2 border-gray-400 flex justify-center items-center rounded-full h-16 w-16 lg:w-24 lg:h-24 2xl:w-28 2xl:h-28"
                  />
               ) : (
                  <FotoUsuarioDeslogado />
               )}
               <div className="text-havprincipal">
                  <strong> {corretor.nome} </strong>
               </div>
            </div>
         ))}
      </div>
   );
};

const ExibirCorretores = (props: CardCorretorProps) => {
   return (
      <SessionProvider>
         <CorretoresContent corretores={props.corretores} />
      </SessionProvider>
   );
};

export default ExibirCorretores;
