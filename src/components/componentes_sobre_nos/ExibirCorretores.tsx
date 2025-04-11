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

         let chatId;

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
            chatId = data.idChat;
         } else if (!response.ok) {
            throw new Error("Erro ao criar chat");
         } else {
            const data = await response.json();
            chatId = data.idChat;
         }

         // Navegação simples e direta - resolver problemas de STOMP
         // Vamos para a página de chat sem parâmetros primeiro, depois adicionamos
         // o ID do chat como parte da URL após uma segunda navegação

         // Usar replace em vez de push para evitar problemas de navegação com back button
         router.replace("/chat");

         // Aguardar um tempo maior para garantir que a página carregou completamente
         // e a conexão STOMP foi estabelecida antes de adicionar o parâmetro
         setTimeout(() => {
            // Usar replace em vez de push para evitar problemas de histórico
            router.replace(`/chat?chat=${chatId}`);
         }, 500);
      } catch (error) {
         console.error("Erro na operação de chat:", error);
         router.replace("/chat");
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
