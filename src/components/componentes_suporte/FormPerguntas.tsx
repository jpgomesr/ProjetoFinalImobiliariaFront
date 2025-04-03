"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNotification } from "@/context/NotificationContext";
import { useSession } from "next-auth/react";
import { TipoPergunta } from "@/models/Enum/TipoPerguntaEnum";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";

const schema = z.object({
   titulo: z.string().min(1, "O título é obrigatório"),
   mensagem: z.string().min(1, "A mensagem é obrigatória"),
   tipoPergunta: z.nativeEnum(TipoPergunta, {
      required_error: "Selecione um tipo de pergunta",
   }),
   email: z.string().email("Email inválido").optional(),
});

type FormData = z.infer<typeof schema>;

const opcoesPergunta = [
   { id: TipoPergunta.LOGIN_OU_CADASTRO, label: "Login ou Cadastro" },
   { id: TipoPergunta.PAGAMENTOS, label: "Pagamentos" },
   { id: TipoPergunta.PROMOCOES, label: "Promoções" },
   { id: TipoPergunta.OUTROS, label: "Outros" },
];

const FormPerguntas = () => {
   const { data: session } = useSession();
   const { showNotification } = useNotification();
   const [tipoPergunta, setTipoPergunta] = useState<TipoPergunta>(
      TipoPergunta.OUTROS
   );
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      watch,
   } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         email: session?.user?.email || undefined,
         tipoPergunta: TipoPergunta.OUTROS,
      },
   });

   const onSubmit = async (data: FormData) => {
      try {
         setIsLoading(true);
         const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
         const response = await fetch(`${BASE_URL}/perguntas`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               titulo: data.titulo,
               mensagem: data.mensagem,
               tipoPergunta: data.tipoPergunta,
               email: session?.user?.email || data.email,
               data: new Date(),
               perguntaRespondida: false,
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao enviar pergunta");
         }

         showNotification("Pergunta enviada com sucesso!");
         reset({
            titulo: "",
            mensagem: "",
            tipoPergunta: TipoPergunta.OUTROS,
            email: session?.user?.email || undefined,
         });
         setTipoPergunta(TipoPergunta.OUTROS);
      } catch (error) {
         showNotification(
            error instanceof Error ? error.message : "Erro ao enviar pergunta"
         );
      } finally {
         setIsLoading(false);
      }
   };

   const handleTipoPerguntaChange = (tipo: TipoPergunta) => {
      setTipoPergunta(tipo);
      setValue("tipoPergunta", tipo);
   };

   const tipoPerguntaSelecionada = watch("tipoPergunta");

   return (
      <div className="w-full">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-wrap gap-2">
               {opcoesPergunta.map((opcao) => (
                  <BotaoPadrao
                     key={opcao.id}
                     type="button"
                     texto={opcao.label}
                     onClick={() => handleTipoPerguntaChange(opcao.id)}
                     className={`px-4 py-2 rounded-full text-sm transition-all ${
                        tipoPerguntaSelecionada === opcao.id
                           ? "bg-gray-200 font-medium"
                           : "bg-gray-100 hover:bg-gray-200"
                     }`}
                  />
               ))}
            </div>
            {errors.tipoPergunta && (
               <p className="text-red-500 text-sm">
                  {errors.tipoPergunta.message}
               </p>
            )}

            {!session && (
               <InputPadrao
                  type="email"
                  placeholder="Seu email"
                  {...register("email")}
                  mensagemErro={errors.email?.message}
               />
            )}

            <InputPadrao
               type="text"
               placeholder="Título da sua pergunta"
               {...register("titulo")}
               mensagemErro={errors.titulo?.message}
            />

            <TextAreaPadrao
               label=""
               htmlFor="mensagem"
               placeholder="Sua mensagem"
               {...register("mensagem")}
               mensagemErro={errors.mensagem?.message}
            />

            <div className="flex justify-center">
               <BotaoPadrao
                  type="submit"
                  texto={isLoading ? "Enviando..." : "Enviar"}
                  className={`bg-havprincipal text-white w-[120px] whitespace-nowrap ${
                     isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
               />
            </div>
         </form>
      </div>
   );
};

export default FormPerguntas;
