"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from "@/context/NotificationContext";
import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import { enviarPergunta } from "@/app/suporte/action";
import BotaoPadrao from "@/components/BotaoPadrao";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";

// Schemas
const baseSchema = {
   tipoPergunta: z.nativeEnum(TipoPergunta, {
      required_error: "Selecione um tipo de pergunta",
   }),
   mensagem: z
      .string()
      .min(1, "Mensagem é obrigatória")
      .max(500, "Mensagem muito longa"),
};

const loggedInSchema = z.object(baseSchema);
const loggedOutSchema = z.object({
   ...baseSchema,
   email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

type LoggedInSchema = z.infer<typeof loggedInSchema>;
type LoggedOutSchema = z.infer<typeof loggedOutSchema>;

const FormPerguntas = () => {
   const { data: session, status } = useSession();
   const { showNotification } = useNotification();
   const isLoggedIn = status === "authenticated";

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      clearErrors,
      setValue,
      watch,
   } = useForm<LoggedOutSchema | LoggedInSchema>({
      resolver: zodResolver(isLoggedIn ? loggedInSchema : loggedOutSchema),
   });

   const opcoes = [
      {
         id: TipoPergunta.LOGIN_OU_CADASTRO,
         label: "Log-in, fraude e segurança",
      },
      { id: TipoPergunta.PAGAMENTOS, label: "Cobrança" },
      { id: TipoPergunta.PROMOCOES, label: "Assinatura Premium" },
      { id: TipoPergunta.OUTROS, label: "Outro" },
   ];

   const handleInputChange = (field: string) => {
      clearErrors(field as any);
   };

   const onSubmit = async (data: LoggedOutSchema | LoggedInSchema) => {
      try {
         const userEmail = isLoggedIn
            ? session?.user?.email
            : (data as LoggedOutSchema).email;

         if (!userEmail) {
            showNotification("Email inválido");
            return;
         }

         const perguntaData = {
            ...data,
            email: userEmail,
         };

         const resultado = await enviarPergunta(perguntaData);

         if (resultado?.success) {
            showNotification("Pergunta enviada com sucesso!");
            setValue("mensagem", "");
            setValue("tipoPergunta", TipoPergunta.OUTROS);
         } else {
            showNotification("Erro ao enviar pergunta");
         }
      } catch (error) {
         showNotification("Erro ao enviar pergunta");
      }
   };

   const tipoPerguntaSelecionada = watch("tipoPergunta");

   return (
      <div className="flex flex-col gap-6 w-full">
         <div className="flex flex-wrap gap-2">
            {opcoes.map((opcao) => (
               <BotaoPadrao
                  key={opcao.id}
                  texto={opcao.label}
                  onClick={() => {
                     setValue("tipoPergunta", opcao.id);
                     handleInputChange("tipoPergunta");
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                     tipoPerguntaSelecionada === opcao.id
                        ? "bg-gray-200 font-medium"
                        : "bg-gray-100 hover:bg-gray-200"
                  }`}
               />
            ))}
         </div>
         {errors.tipoPergunta && (
            <span className="text-red-500 text-xs">
               {errors.tipoPergunta.message}
            </span>
         )}

         {tipoPerguntaSelecionada && (
            <div className="transition-all duration-300 ease-in-out space-y-4">
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
               >
                  {!isLoggedIn && (
                     <InputPadrao
                        type="email"
                        placeholder="Seu e-mail"
                        {...register("email" as any)}
                        mensagemErro={(errors as any).email?.message}
                        onChange={() => handleInputChange("email")}
                     />
                  )}
                  <TextAreaPadrao
                     label=""
                     htmlFor="mensagem"
                     placeholder={`Descreva sua dúvida sobre ${opcoes
                        .find((opc) => opc.id === tipoPerguntaSelecionada)
                        ?.label.toLowerCase()}`}
                     {...register("mensagem")}
                     mensagemErro={errors.mensagem?.message}
                     onChange={() => handleInputChange("mensagem")}
                  />
                  <BotaoPadrao
                     texto={isSubmitting ? "Enviando..." : "Enviar"}
                     type="submit"
                     disabled={isSubmitting}
                     className="bg-havprincipal text-white w-[120px] whitespace-nowrap"
                  />
               </form>
            </div>
         )}
      </div>
   );
};

export default FormPerguntas;
