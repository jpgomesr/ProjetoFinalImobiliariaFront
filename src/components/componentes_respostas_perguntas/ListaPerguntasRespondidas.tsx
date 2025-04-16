"use client";

import React, { useEffect, useState } from "react";
import { buscarPerguntasRespondidas } from "@/app/responder-perguntas/action";
import ModelPergunta from "@/models/ModelPergunta";
import { useNotification } from "@/context/NotificationContext";
import CardPergunta from "./CardPergunta";
import { useSession } from "next-auth/react";

const ListaPerguntasRespondidas = () => {
   const [questions, setQuestions] = useState<ModelPergunta[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { showNotification } = useNotification();
   const { data: session, status } = useSession();

   useEffect(() => {
      const carregarPerguntas = async () => {
         try {
            setIsLoading(true);
            const resultado = await buscarPerguntasRespondidas();
            if (resultado?.success) {
               setQuestions(resultado.data || []);
            } else {
               showNotification("Erro ao carregar perguntas respondidas");
            }
         } catch (error) {
            showNotification("Erro ao carregar perguntas respondidas");
         } finally {
            setIsLoading(false);
         }
      };

      if (status === "authenticated") {
         carregarPerguntas();
      }
   }, [status, showNotification]);

   if (isLoading) return <div className="text-center py-4">Carregando...</div>;
   if (questions.length === 0)
      return (
         <div className="text-center py-4">
            Nenhuma pergunta respondida encontrada
         </div>
      );

   return (
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
         {questions.map((question, key) => (
            <CardPergunta
               key={key}
               id={question.id}
               tipoPergunta={question.tipoPergunta}
               titulo={question.titulo}
               email={question.email}
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
};

export default ListaPerguntasRespondidas;
