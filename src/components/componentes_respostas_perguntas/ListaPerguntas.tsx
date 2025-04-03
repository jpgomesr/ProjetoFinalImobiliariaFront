"use client";

import React, { useEffect, useState } from "react";
import { buscarPerguntas } from "@/app/respostas-perguntas/action";
import ModelPergunta from "@/models/ModelPergunta";
import { useNotification } from "@/context/NotificationContext";
import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import CardPergunta from "./CardPergunta";

const ListaPerguntas = () => {
   const [questions, setQuestions] = useState<ModelPergunta[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { showNotification } = useNotification();

   useEffect(() => {
      const carregarPerguntas = async () => {
         try {
            setIsLoading(true);
            const resultado = await buscarPerguntas();

            if (resultado?.success) {
               setQuestions(resultado.data || []);
            } else {
               showNotification("Erro ao carregar perguntas");
            }
         } catch (error) {
            showNotification("Erro ao carregar perguntas");
         } finally {
            setIsLoading(false);
         }
      };

      carregarPerguntas();
   }, []);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
         {isLoading ? (
            <div className="col-span-2 text-center">Carregando...</div>
         ) : questions.length === 0 ? (
            <div className="col-span-2 text-center">
               Nenhuma pergunta encontrada
            </div>
         ) : (
            questions.map((question, key) => (
               <CardPergunta
                  key={key}
                  tipoPergunta={
                     question.tipoPergunta === "LOGIN_OU_CADASTRO"
                        ? "Login ou Cadastro"
                        : question.tipoPergunta === "PAGAMENTOS"
                        ? "Pagamentos"
                        : question.tipoPergunta === "PROMOCOES"
                        ? "Promoções"
                        : "Outros"
                  }
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

export default ListaPerguntas;
