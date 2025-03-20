"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import { useSearchParams } from "next/navigation";
import ListFiltroPadrao from "@/components/ListFIltroPadrao";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import InputsPergunta from "@/components/componentes_perguntas_frequentes/InputsPergunta";

const page = () => {
   const searchParams = useSearchParams();
   const opcaoSelecionada = searchParams.get("opcao");

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Perguntas Frequentes" className="w-full">
               <div className="flex flex-col gap-4">
                  <h1>Perguntas Frequentes</h1>
                  <p>
                     Aqui você pode ver as perguntas frequentes e responder
                     elas.
                  </p>
               </div>
               
            </FundoBrancoPadrao>
            <div className="flex my-4"></div>
            <FundoBrancoPadrao titulo="Faça uma pergunta" className="w-full">
               <ListFiltroPadrao
                  width="w-full"
                  opcoes={[
                     { id: "1", label: "Login ou Cadastro" },
                     { id: "2", label: "Pagamentos" },
                     { id: "3", label: "Promoções" },
                     { id: "4", label: "Outros" },
                  ]}
                  buttonHolder="Assunto"
                  value={opcaoSelecionada || ""}
                  url="/perguntas-frequentes"
                  nomeAributo="opcao"
               />
               {opcaoSelecionada === "1" && (
                  <div className="flex flex-col gap-4">
                     <InputsPergunta />
                     <TextAreaPadrao
                        label="Pergunta"
                        placeholder="Ex: Como faço para cadastrar-me no site?"
                        htmlFor="Pergunta"
                     />
                     <BotaoPadrao
                        texto="Enviar"
                        className=" bg-havprincipal text-white w-[10%] self-center"
                        onClick={() => {}}
                     />
                  </div>
               )}
               {opcaoSelecionada === "2" && (
                  <div className="flex flex-col gap-4">
                     <InputsPergunta />
                     <TextAreaPadrao
                        label="Pergunta"
                        placeholder="Ex: Aceita pix?"
                        htmlFor="Pergunta"
                     />
                     <BotaoPadrao
                        texto="Enviar"
                        className=" bg-havprincipal text-white w-[10%] self-center"
                        onClick={() => {}}
                     />
                  </div>
               )}
               {opcaoSelecionada === "3" && (
                  <div className="flex flex-col gap-4">
                     <InputsPergunta />
                     <TextAreaPadrao
                        label="Pergunta"
                        placeholder="Ex: Até quando a promoção estará disponível?"
                        htmlFor="Pergunta"
                     />
                     <BotaoPadrao
                        texto="Enviar"
                        className=" bg-havprincipal text-white w-[10%] self-center"
                        onClick={() => {}}
                     />
                  </div>
               )}
               {opcaoSelecionada === "4" && (
                  <div className="flex flex-col gap-4">
                     <InputsPergunta />
                     <TextAreaPadrao
                        label="Pergunta"
                        placeholder="Ex: Qual o dono da empresa?"
                        htmlFor="Pergunta"
                     />
                     <BotaoPadrao
                        texto="Enviar"
                        className=" bg-havprincipal text-white w-[10%] self-center"
                        onClick={() => {}}
                     />
                  </div>
               )}
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
