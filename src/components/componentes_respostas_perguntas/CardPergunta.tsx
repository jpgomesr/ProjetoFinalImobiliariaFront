"use client";

import React, { useState, useEffect } from "react";
import BotaoPadrao from "@/components/BotaoPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { useSession } from "next-auth/react";
interface CardPerguntaProps {
   id: string;
   tipoPergunta: string;
   email: string;
   titulo: string;
   mensagem: string;
   data: string | Date;
   perguntaRespondida: boolean;
   resposta?: string;
   idAdministrador?: string;
   idEditor?: string;
}

const CardPergunta = ({
   id = "1",
   tipoPergunta,
   email,
   titulo,
   mensagem,
   data,
   perguntaRespondida = false,
   resposta,
   idAdministrador,
   idEditor,
}: CardPerguntaProps) => {
   const { data: session, status } = useSession();
   const token = session?.accessToken;
   const [isResponding, setIsResponding] = useState(false);
   const [respostaTexto, setRespostaTexto] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [respostaAtual, setRespostaAtual] = useState(resposta || "");
   const [perguntaRespondidaAtual, setPerguntaRespondidaAtual] =
      useState(perguntaRespondida);

   // Log para depuração
   useEffect(() => {
      console.log("Status da sessão:", status);
      console.log("Session:", session);
      console.log("Token disponível:", !!token);
   }, [session, status, token]);

   // Carrega os dados da pergunta quando o componente é montado
   useEffect(() => {
      const carregarDadosPergunta = async () => {
         try {
            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
            const url = `${BASE_URL}/perguntas/${id}`;

            console.log("Carregando dados da pergunta:", url);
            console.log("Token para carregar dados:", !!token);

            const response = await fetch(url, {
               headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
               },
            });

            if (!response.ok) {
               console.error(`Erro ao carregar dados: ${response.status}`);
               return;
            }

            const data = await response.json();
            console.log("Dados carregados:", data);

            // Atualiza os estados locais com os dados do servidor
            if (data.resposta) {
               setRespostaAtual(data.resposta);
               setPerguntaRespondidaAtual(true);
            }
         } catch (error) {
            console.error("Erro ao carregar dados da pergunta:", error);
         }
      };

      if (status === "authenticated") {
         carregarDadosPergunta();
      }
   }, [id, token, status]);

   const formatarData = (data: string | Date) => {
      if (!data) return "Data não informada";
      try {
         const dataObj = typeof data === "string" ? new Date(data) : data;
         return dataObj.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
         });
      } catch (error) {
         console.error("Erro ao formatar data:", error);
         return "Data inválida";
      }
   };

   const handleSubmit = async () => {
      if (!respostaTexto.trim()) return;
      if (!token) {
         console.error("Token não disponível para enviar resposta");
         alert("Erro: Você precisa estar autenticado para enviar uma resposta");
         return;
      }

      setIsLoading(true);
      try {
         const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
         const url = `${BASE_URL}/perguntas/${id}?resposta=${respostaTexto}`;
         console.log("Enviando resposta para:", url);
         console.log("Token:", token);

         const response = await fetch(url, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         });

         if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na resposta:", response.status, errorText);
            throw new Error(
               `Erro ao enviar resposta: ${response.status} - ${errorText}`
            );
         }

         // Atualiza o estado local
         setRespostaAtual(respostaTexto);
         setPerguntaRespondidaAtual(true);
         setIsResponding(false);
         setRespostaTexto("");
         window.location.reload(); // Recarrega a página para mostrar a resposta atualizada
      } catch (error) {
         console.error("Erro detalhado:", error);
         let mensagemErro = "Erro ao enviar resposta:\n";

         if (error instanceof Error) {
            mensagemErro += error.message;
         } else {
            mensagemErro += "Erro desconhecido na comunicação com o servidor";
         }

         if (!process.env.NEXT_PUBLIC_BASE_URL) {
            mensagemErro += "\nVariável de ambiente BASE_URL não está definida";
         }

         alert(mensagemErro);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
         <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
               <span>{tipoPergunta || "Não informado"}</span>
               <span>•</span>
               <span>{email || "Não informado"}</span>
               <span>•</span>
               <span>{formatarData(data)}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
               {titulo || "Não informado"}
            </h3>
         </div>
         <div className="text-gray-700 mb-4">
            <p className="line-clamp-3">{mensagem || "Não informado"}</p>
         </div>
         <div className="text-sm text-gray-500">
            {perguntaRespondidaAtual ? (
               <div>
                  <span className="font-medium text-gray-700">Resposta:</span>
                  <p className="mt-1 line-clamp-2">{respostaAtual}</p>
               </div>
            ) : isResponding ? (
               <div className="space-y-4">
                  <TextAreaPadrao
                     label=""
                     htmlFor="resposta"
                     placeholder="Digite sua resposta..."
                     value={respostaTexto}
                     onChange={(e) => setRespostaTexto(e.target.value)}
                  />
                  <div className="flex justify-between items-center w-full">
                     <BotaoPadrao
                        texto="Cancelar"
                        onClick={() => {
                           setIsResponding(false);
                           setRespostaTexto("");
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 text-sm"
                     />
                     <BotaoPadrao
                        texto={isLoading ? "Enviando..." : "Enviar"}
                        onClick={handleSubmit}
                        disabled={isLoading || !respostaTexto.trim() || !token}
                        className="bg-havprincipal text-white px-4 py-2 text-sm"
                     />
                  </div>
               </div>
            ) : (
               <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                     <span>Aguardando resposta</span>
                  </div>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                     <BotaoPadrao
                        texto="Responder"
                        onClick={() => setIsResponding(true)}
                        className="bg-havprincipal text-white px-4 py-2 text-sm"
                        disabled={!token}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default CardPergunta;
