"use client";

import React, { useEffect, useState } from "react";
import { buscarPerguntasRespondidas } from "@/app/perguntas-respondidas/action";
import ModelPergunta from "@/models/ModelPergunta";
import { useNotification } from "@/context/NotificationContext";
import CardPerguntaRespondida from "./CardPerguntaRespondida";

const ListaPerguntasRespondidas = () => {
   const [questions, setQuestions] = useState<ModelPergunta[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { showNotification } = useNotification();

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

      carregarPerguntas();
   }, []);

   return (
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
         {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
         ) : questions.length === 0 ? (
            <div className="text-center py-4">
               Nenhuma pergunta respondida encontrada
            </div>
         ) : (
            questions.map((question, key) => (
               <CardPerguntaRespondida
                  key={key}
                  id={question.id}
                  tipoPergunta={
                     question.tipoPergunta === "LOGIN_OU_CADASTRO"
                        ? "Login ou Cadastro"
                        : question.tipoPergunta === "PAGAMENTOS"
                        ? "Pagamentos"
                        : question.tipoPergunta === "PROMOCOES"
                        ? "Promoções"
                        : "Outros"
                  }
                  titulo={question.titulo}
                  email={question.email}
                  mensagem={question.mensagem}
                  data={question.data}
                  perguntaRespondida={question.perguntaRespondida}
                  resposta={question.resposta}
                  idAdministrador={question.idAdministrador}
                  idEditor={question.idEditor}
               />
            ))
         )}
      </div>
   );
};

export default ListaPerguntasRespondidas;
