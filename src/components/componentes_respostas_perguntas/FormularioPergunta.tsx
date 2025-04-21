"use client";

import React, { useState } from "react";
import BotaoPadrao from "@/components/BotaoPadrao";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { useSession } from "next-auth/react";
import { useNotification } from "@/context/NotificationContext";

type TipoPerguntaEnum =
   | "LOGIN_OU_CADASTRO"
   | "PAGAMENTOS"
   | "PROMOCOES"
   | "OUTROS";

interface FormularioPerguntaProps {
   onSubmit: (pergunta: {
      tipoPergunta: TipoPerguntaEnum;
      email: string;
      titulo: string;
      mensagem: string;
   }) => void;
}

const FormularioPergunta = ({ onSubmit }: FormularioPerguntaProps) => {
   const { data: session } = useSession();
   const { showNotification } = useNotification();
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      tipoPergunta: "OUTROS" as TipoPerguntaEnum,
      email: "",
      titulo: "",
      mensagem: "",
   });

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!session?.accessToken) {
         showNotification(
            "Você precisa estar autenticado para enviar uma pergunta"
         );
         return;
      }

      console.log("Token disponível:", session.accessToken);
      console.log("Dados do formulário:", formData);

      setIsLoading(true);
      try {
         const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
         console.log("URL da requisição:", `${BASE_URL}/perguntas`);

         const response = await fetch(`${BASE_URL}/perguntas`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({
               tipoPergunta: formData.tipoPergunta,
               email: formData.email,
               titulo: formData.titulo,
               mensagem: formData.mensagem,
            }),
         });

         console.log("Status da resposta:", response.status);
         console.log("Headers da resposta:", response.headers);

         if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na resposta:", response.status, errorText);
            throw new Error(
               `Erro ao enviar pergunta: ${response.status} - ${errorText}`
            );
         }

         showNotification("Pergunta enviada com sucesso!");
         onSubmit(formData);
         setFormData({
            tipoPergunta: "OUTROS",
            email: "",
            titulo: "",
            mensagem: "",
         });
      } catch (error) {
         console.error("Erro detalhado:", error);
         let mensagemErro = "Erro ao enviar pergunta:\n";

         if (error instanceof Error) {
            mensagemErro += error.message;
         } else {
            mensagemErro += "Erro desconhecido na comunicação com o servidor";
         }

         if (!process.env.NEXT_PUBLIC_BASE_URL) {
            mensagemErro += "\nVariável de ambiente BASE_URL não está definida";
         }

         showNotification(mensagemErro);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label
               htmlFor="tipoPergunta"
               className="block text-sm font-medium text-gray-700"
            >
               Tipo de Pergunta
            </label>
            <select
               id="tipoPergunta"
               name="tipoPergunta"
               value={formData.tipoPergunta}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-havprincipal focus:ring-havprincipal sm:text-sm"
               required
            >
               <option value="LOGIN_OU_CADASTRO">Login ou Cadastro</option>
               <option value="PAGAMENTOS">Pagamentos</option>
               <option value="PROMOCOES">Promoções</option>
               <option value="OUTROS">Outros</option>
            </select>
         </div>

         <InputPadrao
            label="Email"
            htmlFor="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
         />

         <InputPadrao
            label="Título"
            htmlFor="titulo"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Digite o título da sua pergunta"
            required
         />

         <TextAreaPadrao
            label="Mensagem"
            htmlFor="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            placeholder="Digite sua pergunta"
            required
         />

         <div className="flex justify-end">
            <BotaoPadrao
               texto={isLoading ? "Enviando..." : "Enviar Pergunta"}
               type="submit"
               disabled={isLoading}
               className="bg-havprincipal text-white px-4 py-2"
            />
         </div>
      </form>
   );
};

export default FormularioPergunta;
