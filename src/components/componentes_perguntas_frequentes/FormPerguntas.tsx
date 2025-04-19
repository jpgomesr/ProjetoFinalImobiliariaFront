"use client";

import React, { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import { enviarPergunta } from "@/app/suporte/action";
import BotaoPadrao from "@/components/BotaoPadrao";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { useSession } from "next-auth/react";

const FormPerguntas = () => {
   const [opcaoSelecionada, setOpcaoSelecionada] =
      useState<TipoPergunta | null>(null);
   const [mensagem, setMensagem] = useState("");
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const { showNotification } = useNotification();
   const { data: session } = useSession();


   const opcoes = [
      {
         id: TipoPergunta.LOGIN_OU_CADASTRO,
         label: "Log-in, fraude e segurança",
      },
      { id: TipoPergunta.PAGAMENTOS, label: "Cobrança" },
      { id: TipoPergunta.PROMOCOES, label: "Assinatura Premium" },
      { id: TipoPergunta.OUTROS, label: "Outro" },
   ];

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!opcaoSelecionada || !mensagem || !email) {
         showNotification("Por favor, preencha todos os campos");
         return;
      }

      setIsLoading(true);
      try {
         const resultado = await enviarPergunta({
            tipoPergunta: opcaoSelecionada,
            mensagem,
            email,
            titulo: "Pergunta Frequentes",
            token: session?.accessToken || "",
         });

         if (resultado?.success) {
            showNotification("Pergunta enviada com sucesso!");
            setMensagem("");
            setEmail("");
            setOpcaoSelecionada(null);
         } else {
            showNotification("Erro ao enviar pergunta");
         }
      } catch (error) {
         showNotification("Erro ao enviar pergunta");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
         <div className="flex flex-wrap gap-2 justify-start">
            {opcoes.map((opcao) => (
               <BotaoPadrao
                  key={opcao.id}
                  texto={opcao.label}
                  onClick={() => setOpcaoSelecionada(opcao.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                     opcaoSelecionada === opcao.id
                        ? "bg-gray-200 font-medium"
                        : "bg-gray-100 hover:bg-gray-200"
                  }`}
               />
            ))}
         </div>

         {opcaoSelecionada && (
            <div className="transition-all duration-300 ease-in-out space-y-4 bg-white p-6 rounded-lg shadow-sm">
               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <InputPadrao
                     type="email"
                     placeholder="Seu e-mail"
                     value={email}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                     }
                     required
                  />
                  <TextAreaPadrao
                     label=""
                     htmlFor="mensagem"
                     placeholder={`Descreva sua dúvida sobre ${opcoes
                        .find((opc) => opc.id === opcaoSelecionada)
                        ?.label.toLowerCase()}`}
                     value={mensagem}
                     onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setMensagem(e.target.value)
                     }
                     required
                  />
                  <BotaoPadrao
                     texto={isLoading ? "Enviando..." : "Enviar Pergunta"}
                     type="submit"
                     disabled={isLoading}
                     className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                  />
               </form>
            </div>
         )}
      </div>
   );
};

export default FormPerguntas;
