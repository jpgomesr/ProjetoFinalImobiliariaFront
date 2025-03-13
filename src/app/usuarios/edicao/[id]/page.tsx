"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import SelectPadrao from "@/components/SelectPadrao";
import React, { useEffect, useState } from "react";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useRouter, useParams } from "next/navigation";
import ModelUsuario from "@/models/ModelUsuario";
import Switch from "@/components/ComponentesCrud/Switch";
import { UseErros } from "@/hooks/UseErros";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createUsuarioValidator } from "@/validators/Validators";
import { buscarUsuarioPorId } from "@/Functions/usuario/buscaUsuario";
import { useNotification } from "@/context/NotificationContext";
// Interface para os valores do formulário

const Page = () => {

   const { showNotification } = useNotification()
   const router = useRouter();
   let { id } = useParams();
   id = id ? Array.isArray(id) ? id[0] : id : undefined

   const [preview, setPreview] = useState<string>();
   const [alterarSenha, setAlterarSenha] = useState(false);

   const handleTrocaDeSenha = (ativo: boolean) => {
      setAlterarSenha(ativo);
      if (alterarSenha) {
         setValue("senha", "");
         setValue("confirmaSenha", "");
      }
   };

   const usuarioValidator = createUsuarioValidator(alterarSenha);
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

   useEffect(() => {
      console.log(errors);
   }, [errors]);

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const tiposDeUsuarios = ["USUARIO", "ADMINISTRADOR", "EDITOR", "CORRETOR"];
   const opcoesAtivoDesativo = ["Ativo", "Desativado"];


  
   const preencherInformacoesAtuaisDoUsuario = async () => {
      if(id){
         
         const usuario : ModelUsuario = await buscarUsuarioPorId(id.toString());

         setValue("nomeCompleto", usuario.nome);
         setValue("descricao", usuario.descricao);
         setValue("email", usuario.email);
         setValue("telefone", usuario.telefone);
         setValue("tipoUsuario", usuario.role);
         setValue("ativo", usuario.ativo ? "Ativo" : "Desativado");
         setPreview(usuario.foto);
      }
 

      
   };

   useEffect(() => {
      preencherInformacoesAtuaisDoUsuario();
   }, []);
   useEffect(() => {
      if (!alterarSenha) {
         resetField("senha");
         resetField("confirmaSenha");
      }
   }, [alterarSenha, resetField]);

   const onSubmit = async (data: usuarioValidatorSchema) => {
      try {
         const response = await UseFetchPostFormData(
            `${BASE_URL}/usuarios/${id}`,
            {
               nome: data.nomeCompleto,
               email: data.email,
               senha: alterarSenha ? data.senha : null,
               telefone: data.telefone,
               role: data.tipoUsuario,
               descricao: data.descricao,
               ativo: data.ativo === "Ativo",
            },
            "usuario",
            "novaImagem",
            data.imagemPerfil,
            "PUT"
         );

         if (!response.ok) {
            const responseData = await response.json();
            if (responseData.erros) {
               const errosFormatados = UseErros(responseData);
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
            throw new Error(responseData.mensagem || "Erro ao editar usuário.");
         }

         showNotification("Usuário editado com sucesso")
         clearErrors();
         router.push("/usuarios");
      } catch (error) {
         console.error("Erro ao editar o usuário:", error);
      }
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Edição de proprietario"
               className={`w-full ${
                  isSubmitting ? "opacity-40" : "opacity-100"
               }`}
            >
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6"
               >
                  <InputPadrao
                     htmlFor="nomeCompleto"
                     label="Nome completo"
                     type="text"
                     placeholder="Ex: Carlos"
                     {...register("nomeCompleto")}
                     mensagemErro={errors.nomeCompleto?.message}
                  />
                  <InputPadrao
                     htmlFor="email"
                     label="E-mail"
                     type="email"
                     placeholder="Ex: Carlos@gmail.com"
                     {...register("email")}
                     mensagemErro={errors.email?.message}
                  />
                  <div>
                     <p className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl">
                        Alterar Senha?
                     </p>

                     <Switch
                        handleAcao={handleTrocaDeSenha}
                        className="w-8 h-4 sm:w-12 sm:h-6 md:w-14 md:h-7 lg:w-16 lg:h-8"
                        value={alterarSenha}
                     />
                  </div>
                  <InputPadrao
                     htmlFor="senha"
                     label="Senha"
                     type="password"
                     placeholder="Ex: 123C@31s$"
                     {...register("senha")}
                     mensagemErro={errors.senha?.message}
                     disabled={!alterarSenha}
                  />
                  <InputPadrao
                     htmlFor="confirmaSenha"
                     label="Confirmar senha"
                     type="password"
                     placeholder="Digite a senha novamente"
                     {...register("confirmaSenha")}
                     mensagemErro={errors.confirmaSenha?.message}
                     disabled={!alterarSenha}
                  />
                  <InputPadrao
                     htmlFor="telefone"
                     label="Telefone"
                     type="text"
                     placeholder="Ex: 47912312121"
                     {...register("telefone")}
                     mensagemErro={errors.telefone?.message}
                  />
                  <TextAreaPadrao
                     htmlFor="descricao"
                     label="Descricao"
                     {...register("descricao")}
                     mensagemErro={errors.descricao?.message}
                  />
                  <div className="flex flex-col">
                     <label
                        htmlFor="tipo-usuario"
                        className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl"
                     >
                        Tipo usuario
                     </label>
                     <Controller
                        name="tipoUsuario"
                        control={control}
                        render={({ field }) => (
                           <SelectPadrao
                              opcoes={tiposDeUsuarios}
                              onChange={field.onChange}
                              placeholder="Tipo usuario"
                              selecionado={field.value}
                              className="w-2/4 lg:max-w-sm"
                           />
                        )}
                     />
                  </div>
                  <div className="flex flex-col">
                     <label
                        htmlFor="tipo-usuario"
                        className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl"
                     >
                        Status
                     </label>
                     <Controller
                        name="ativo"
                        control={control}
                        render={({ field }) => (
                           <SelectPadrao
                              opcoes={opcoesAtivoDesativo}
                              onChange={field.onChange}
                              placeholder="Ativo"
                              selecionado={field.value}
                              className="w-2/4 lg:max-w-sm"
                           />
                        )}
                     />
                  </div>
                  <Controller
                     name="imagemPerfil"
                     control={control}
                     render={({ field }) => (
                        <UploadImagem
                           onChange={(file: File | null) =>
                              field.onChange(file)
                           }
                           preview={preview}
                        />
                     )}
                  />
                  <div className="flex justify-center">
                     <BotaoPadrao
                        texto="Concluir"
                        className="border border-black"
                        disabled={isSubmitting}
                        type="submit"
                     />
                  </div>
               </form>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
