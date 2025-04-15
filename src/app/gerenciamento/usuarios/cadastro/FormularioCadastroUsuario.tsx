"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import SelectPadrao from "@/components/SelectPadrao";
import React from "react";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createUsuarioValidator } from "@/validators/Validators";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseErros } from "@/hooks/UseErros";
import { TipoUsuarioEnum } from "@/models/Enum/TipoUsuarioEnum";
import List from "@/components/List";
import { useNotification } from "@/context/NotificationContext";
import ModelUsuario from "@/models/ModelUsuario";
import { salvarUsuario } from "./action";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface FormularioCadastroUsuarioProps {
   token: string;
}

const FormularioCadastroUsuario = (props: FormularioCadastroUsuarioProps) => {
   const router = useRouter();
   const { showNotification } = useNotification();
   const { t } = useLanguage();

   const usuarioValidator = createUsuarioValidator();
   type usuarioValidatorSchema = z.infer<typeof usuarioValidator>;

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      setError,
      setFocus,
      clearErrors,
      resetField,
      control,
      formState: { errors, isSubmitting },
   } = useForm<usuarioValidatorSchema>({
      resolver: zodResolver(usuarioValidator),
      defaultValues: {
         nomeCompleto: "",
         email: "",
         senha: "",
         confirmaSenha: "",
         telefone: "",
         tipoUsuario: "USUARIO",
         descricao: "",
         ativo: "Ativo",
         imagemPerfil: null,
      },
   });

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const tiposDeUsuarios = [
      { id: TipoUsuarioEnum.USUARIO, label: "Usuário" },
      { id: TipoUsuarioEnum.CORRETOR, label: "Corretor" },
      { id: TipoUsuarioEnum.ADMINISTRADOR, label: "Administrador" },
      { id: TipoUsuarioEnum.EDITOR, label: "Editor" },
   ];
   const opcoesStatus = [
      { id: "Ativo", label: "Ativo" },
      { id: "Desativado", label: "Desativado" },
   ];

   const onSubmit = async (data: usuarioValidatorSchema) => {
      try {
         const objetoRequest = {
            usuario: {
               nome: data.nomeCompleto,
               email: data.email,
               senha: data.senha || "", // Substitui undefined por string vazia
               telefone: data.telefone || "", // Substitui null por string vazia
               role: data.tipoUsuario || "", // Substitui undefined por string vazia
               descricao: data.descricao || "", // Substitui undefined por string vazia
               ativo: data.ativo === "Ativo", // Converte para booleano
            },
            imagemPerfil: data.imagemPerfil || null, // Mantém null ou substitui por um valor padrão
            token: props.token,
         };

         const response = await salvarUsuario(objetoRequest);

         if (!response?.ok) {
            if (response.erros) {
               const errosFormatados = UseErros(response);
               Object.keys(errosFormatados).forEach((campo) => {
                  setError(campo as keyof usuarioValidatorSchema, {
                     type: "manual",
                     message: errosFormatados[campo],
                  });
               });
               const primeiroCampoComErro = Object.keys(
                  errosFormatados
               )[0] as keyof usuarioValidatorSchema;
               if (primeiroCampoComErro) {
                  setFocus(primeiroCampoComErro);
               }
            }
            throw new Error(response.mensagem || "Erro ao editar usuário.");
         }

         showNotification("Usuário cadastrado com sucesso");
         clearErrors(); // Limpa os erros ao cadastrar com sucesso
         router.push("/gerenciamento/usuarios"); // Redireciona para a lista de usuários
      } catch (error) {
         console.error("Erro ao criar usuário:", error);
         showNotification("Erro ao criar usuário. Tente novamente.");
      }
   };

   return (
      <FundoBrancoPadrao
         titulo="UserManagement.title"
         className={`w-full ${isSubmitting ? "opacity-40" : "opacity-100"}`}
         isTranslationKey={true}
      >
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6"
         >
            <InputPadrao
               htmlFor="nomeCompleto"
               label={t("perfil.name")}
               type="text"
               placeholder="Ex: João Silva"
               {...register("nomeCompleto")}
               mensagemErro={errors.nomeCompleto?.message}
            />
            <InputPadrao
               htmlFor="email"
               label={t("perfil.email")}
               type="email"
               placeholder="Ex: joao.silva@example.com"
               {...register("email")}
               mensagemErro={errors.email?.message}
            />
            <InputPadrao
               htmlFor="senha"
               label="Senha"
               type="password"
               placeholder="Ex: 123C@31s$"
               {...register("senha")}
               mensagemErro={errors.senha?.message}
            />
            <InputPadrao
               htmlFor="confirmaSenha"
               label="Confirmar senha"
               type="password"
               placeholder="Digite a senha novamente"
               {...register("confirmaSenha")}
               mensagemErro={errors.confirmaSenha?.message}
            />
            <InputPadrao
               htmlFor="telefone"
               label={t("perfil.phone")}
               type="text"
               placeholder="Ex: 47912345678"
               {...register("telefone")}
               mensagemErro={errors.telefone?.message}
            />
            <TextAreaPadrao
               htmlFor="descricao"
               label={t("property.description")}
               {...register("descricao")}
               mensagemErro={errors.descricao?.message}
            />
            <div className="flex flex-col">
               <Controller
                  name="tipoUsuario"
                  control={control}
                  render={({ field }) => (
                     <List
                        title={t("UserManagement.role")}
                        opcoes={tiposDeUsuarios}
                        mudandoValor={field.onChange}
                        placeholder={t("UserManagement.role")}
                        bordaPreta
                     />
                  )}
               />
            </div>
            <div className="flex flex-col">
               <Controller
                  name="ativo"
                  control={control}
                  render={({ field }) => (
                     <List
                        title={t("UserManagement.status")}
                        opcoes={opcoesStatus}
                        mudandoValor={field.onChange}
                        placeholder={t("UserManagement.buttonActive")}
                        bordaPreta
 
                     />
                  )}
               />
            </div>
            <Controller
               name="imagemPerfil"
               control={control}
               render={({ field }) => (
                  <UploadImagem
                     onChange={(file: File | null) => field.onChange(file)}
                  />
               )}
            />
            <div className="flex justify-center gap-2">
               <Link href="/gerenciamento/usuarios">
                  <BotaoPadrao
                     texto={t("common.cancel")}
                     disabled={isSubmitting}
                     type="button"
                  />
               </Link>
               <BotaoPadrao
                  texto={t("common.save")}
                  disabled={isSubmitting}
                  type="submit"
               />
            </div>
         </form>
      </FundoBrancoPadrao>
   );
};

export default FormularioCadastroUsuario;
