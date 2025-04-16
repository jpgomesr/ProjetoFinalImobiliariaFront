"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import ListText from "@/components/ListText";
import { useLanguage } from "@/context/LanguageContext";

const PerguntasFrequentesClient = () => {
   const searchParams = useSearchParams();
   const opcaoSelecionada = searchParams.get("opcao");
   const { t } = useLanguage();

   return (
      <FundoBrancoPadrao className="w-full" titulo={t("FrequentlyAskedQuestions.title")}>
         <Suspense fallback={<div>Carregando...</div>}>
            <div className="flex flex-col gap-4">
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question1")}
                  texto={t("FrequentlyAskedQuestions.answer1")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question2")}
                  texto={t("FrequentlyAskedQuestions.answer2")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question3")}
                  texto={t("FrequentlyAskedQuestions.answer3")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question4")}
                  texto={t("FrequentlyAskedQuestions.answer4")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question5")}
                  texto={t("FrequentlyAskedQuestions.answer5")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question6")}
                  texto={t("FrequentlyAskedQuestions.answer6")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question7")}
                  texto={t("FrequentlyAskedQuestions.answer7")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question8")}
                  texto={t("FrequentlyAskedQuestions.answer8")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question9")}
                  texto={t("FrequentlyAskedQuestions.answer9")}
                  divClassName="w-full"
                  bordaPreta
               />
               <ListText
                  titulo={t("FrequentlyAskedQuestions.question10")}
                  texto={t("FrequentlyAskedQuestions.answer10")}
                  divClassName="w-full"
                  bordaPreta
               />
            </div>
         </Suspense>
      </FundoBrancoPadrao>
   );
};

export default PerguntasFrequentesClient; 