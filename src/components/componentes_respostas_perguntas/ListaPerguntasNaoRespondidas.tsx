"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { buscarPerguntasNaoRespondidas } from "@/app/responder-perguntas/action";
import ModelPergunta from "@/models/ModelPergunta";
import { useNotification } from "@/context/NotificationContext";
import CardPergunta from "./CardPergunta";

export default function ListaPerguntasNaoRespondidas() {
   const { data: session } = useSession();
   const [questions, setQuestions] = useState<ModelPergunta[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { showNotification } = useNotification();

   useEffect(() => {
      console.log("Session status:", session ? "Disponível" : "Não disponível");
      console.log("Token disponível:", session?.accessToken ? "Sim" : "Não");
   }, [session]);

   useEffect(() => {
      async function loadQuestions() {
         if (session?.accessToken) {
            try {
               const result = await buscarPerguntasNaoRespondidas(
                  session.accessToken
               );
               if (result.success) {
                  setQuestions(result.data);
               } else {
                  showNotification(
                     result.error || "Erro ao carregar perguntas"
                  );
               }
            } catch (error) {
               console.error("Erro ao carregar perguntas:", error);
               showNotification("Erro ao carregar perguntas");
            } finally {
               setIsLoading(false);
            }
         }
      }

      loadQuestions();
   }, [session, showNotification]);

   if (isLoading) {
      return <div>Carregando perguntas...</div>;
   }

   if (questions.length === 0) {
      return <div>Nenhuma pergunta não respondida encontrada.</div>;
   }

   return (
      <div className="space-y-4">
         {questions.map((question) => (
            <CardPergunta
               key={question.id}
               id={question.id}
               tipoPergunta={question.tipoPergunta}
               email={question.email}
               titulo={question.titulo}
               mensagem={question.mensagem}
               data={question.data}
               perguntaRespondida={question.perguntaRespondida}
               resposta={question.resposta}
               idAdministrador={question.idAdministrador}
               idEditor={question.idEditor}
            />
         ))}
      </div>
   );
}
