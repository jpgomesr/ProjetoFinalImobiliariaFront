"use client";

import CardPergunta from "@/components/componentes_respostas_perguntas/CardPergunta";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React, { useEffect, useState } from "react";
import { buscarPerguntas } from "./action";
import ModelPergunta from "@/models/ModelPergunta";
import { useNotification } from "@/context/NotificationContext";
import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";

const Page = () => {
   const [questions, setQuestions] = useState<ModelPergunta[] | undefined>([]);
   const { showNotification } = useNotification();

   useEffect(() => {
      const carregarPerguntas = async () => {
         const resultado = await buscarPerguntas();

         if (resultado) {
            setQuestions(resultado.data);
         } else {
            showNotification("Erro ao carregar perguntas");
         }
      };

      carregarPerguntas();
   }, [showNotification]);

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Perguntas" className="w-full">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
                  {Array.isArray(questions) &&
                     questions.map((question, key) => (
                        <CardPergunta
                           key={key}
                           tipoPergunta={
                              TipoPergunta[
                                 question.tipoPergunta as keyof typeof TipoPergunta
                              ]
                           }
                           email={question.email}
                           mensagem={question.mensagem}
                        />
                     ))}
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
