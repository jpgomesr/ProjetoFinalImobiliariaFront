"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ListFiltroPadrao from "@/components/ListFIltroPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import InputsPergunta from "@/components/componentes_perguntas_frequentes/InputsPergunta";
import ModelPergunta, { TipoPerguntaEnum } from "@/models/ModelPergunta";
import { enviarPergunta } from "@/app/perguntas-frequentes/action";
import { useNotification } from "@/context/NotificationContext";

interface FormPerguntasProps {
   onSuccess?: () => void;
}

interface ErroValidacao {
   campo: string;
   mensagem: string;
}

const FormPerguntas = ({ onSuccess }: FormPerguntasProps) => {
   const searchParams = useSearchParams();
   const opcaoSelecionada = searchParams.get(
      "opcao"
   ) as TipoPerguntaEnum | null;
   const { showNotification } = useNotification();

   const [pergunta, setPergunta] = useState<ModelPergunta>({
      tipoPergunta: "OUTROS",
      email: "",
      telefone: "",
      nome: "",
      mensagem: "",
   });

   const [erros, setErros] = useState<ErroValidacao[]>([]);

   useEffect(() => {
      if (opcaoSelecionada) {
         console.log("Opção selecionada:", opcaoSelecionada); // Log para debug
         setPergunta((prev) => ({ ...prev, tipoPergunta: opcaoSelecionada }));
      }
   }, [opcaoSelecionada]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErros([]);

      console.log("Pergunta antes de enviar:", pergunta); // Log para debug

      const resultado = await enviarPergunta(pergunta);

      if (resultado.success) {
         setPergunta({
            tipoPergunta: "OUTROS",
            email: "",
            telefone: "",
            nome: "",
            mensagem: "",
         });
         showNotification("Pergunta enviada com sucesso!");
         onSuccess?.();
      } else {
         if (resultado.erros) {
            setErros(resultado.erros);
            showNotification("Por favor, corrija os erros no formulário");
         } else {
            showNotification("Erro ao enviar pergunta");
         }
      }
   };

   return (
      <>
         <ListFiltroPadrao
            width="w-full"
            opcoes={[
               { id: "LOGIN_OU_CADASTRO", label: "Login ou Cadastro" },
               { id: "PAGAMENTOS", label: "Pagamentos" },
               { id: "PROMOCOES", label: "Promoções" },
               { id: "OUTROS", label: "Outros" },
            ]}
            buttonHolder="Assunto"
            value={opcaoSelecionada || ""}
            url="/perguntas-frequentes"
            nomeAributo="opcao"
            bordaPreta
         />
         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {opcaoSelecionada === "LOGIN_OU_CADASTRO" && (
               <div>
                  <InputsPergunta
                     placeholder="Ex: Como faço para cadastrar-me no site?"
                     pergunta={pergunta}
                     setPergunta={setPergunta}
                     erros={erros}
                     setErros={setErros}
                  />
               </div>
            )}
            {opcaoSelecionada === "PAGAMENTOS" && (
               <div>
                  <InputsPergunta
                     placeholder="Ex: Aceita pix?"
                     pergunta={pergunta}
                     setPergunta={setPergunta}
                     erros={erros}
                     setErros={setErros}
                  />
               </div>
            )}
            {opcaoSelecionada === "PROMOCOES" && (
               <div>
                  <InputsPergunta
                     placeholder="Ex: Até quando a promoção estará disponível?"
                     pergunta={pergunta}
                     setPergunta={setPergunta}
                     erros={erros}
                     setErros={setErros}
                  />
               </div>
            )}
            {opcaoSelecionada === "OUTROS" && (
               <div>
                  <InputsPergunta
                     placeholder="Ex: Qual o dono da empresa?"
                     pergunta={pergunta}
                     setPergunta={setPergunta}
                     erros={erros}
                     setErros={setErros}
                  />
               </div>
            )}
            <BotaoPadrao
               texto="Enviar"
               className="bg-havprincipal text-white w-[120px] sm:w-[120px] md:w-[120px] lg:w-[120px] xl:w-[120px] self-center whitespace-nowrap"
               type="submit"
            />
         </form>
      </>
   );
};

export default FormPerguntas;
