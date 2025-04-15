"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React, { useEffect, useState } from "react";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseErros } from "@/hooks/UseErros";
import { proprietarioValidator } from "@/validators/Validators";
import InputPadrao from "@/components/InputPadrao";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import SelectPadrao from "@/components/SelectPadrao";
import { useRouter, useParams } from "next/navigation";
import ModelProprietario from "@/models/ModelProprietario";
import { buscarProprietarioPorId } from "@/Functions/proprietario/buscaProprietario";
import { preencherCampos, restaurarCampos } from "@/Functions/requisicaoViaCep";
import List from "@/components/List";
import { useNotification } from "@/context/NotificationContext";
import Erro404 from "@/components/Erro404";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface FormProps {
   proprietario: ModelProprietario;
   token: string;
}

const Formulario = ({ proprietario, token }: FormProps) => {
   const { showNotification } = useNotification();
   const router = useRouter();
   const { t } = useLanguage();

   const [camposDesabilitados, setCamposDesabilitados] = useState({
      cidadeDesabilitada: true,
      bairroDesabilitado: true,
      ruaDesabilitada: true,
      estadoDesabilitado: true,
   });

   const opcoesStatus = [
      { id: "Ativo", label: "Ativo" },
      { id: "Desativado", label: "Desativado" },
   ];
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const opcoesTipoResidencia = [
      { id: "CASA", label: "Casa" },
      { id: "APARTAMENTO", label: "Apartamento" },
   ];
   const validator = proprietarioValidator;
   type validatorSchema = z.infer<typeof validator>;

   const [preview, setPreview] = useState<string>();

   const [loading, setLoading] = useState(true);
   const [erro404, setErro404] = useState(false);

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
   } = useForm({
      resolver: zodResolver(validator),
      defaultValues: {
         nome: "",
         celular: "",
         telefone: "",
         email: "",
         cpf: "",
         imagemPerfil: null,
         bairro: "",
         cidade: "",
         estado: "",
         rua: "",
         cep: "",
         ativo: "Ativo",
         tipoResidencia: "CASA",
         numeroCasaPredio: 0,
         numeroApartamento: null,
      },
   });

   const buscarProprietario = async () => {
      if (!proprietario.id) {
         setErro404(true);
         setLoading(false);
         return;
      }

      try {
         setValue("nome", proprietario.nome);
         setValue("celular", proprietario.celular);
         setValue("telefone", proprietario.telefone);
         setValue("cpf", proprietario.cpf);
         setValue("email", proprietario.email);
         setValue("bairro", proprietario.endereco.bairro);
         setValue("cidade", proprietario.endereco.cidade);
         setValue("estado", proprietario.endereco.estado);
         setValue("rua", proprietario.endereco.rua);
         setValue("cep", proprietario.endereco.cep);
         setValue("tipoResidencia", proprietario.endereco.tipoResidencia);
         setValue("numeroCasaPredio", proprietario.endereco.numeroCasaPredio);
         setValue("numeroApartamento", proprietario.endereco.numeroApartamento);
         setPreview(proprietario.imagemUrl);
      } catch (error) {
         console.error("Erro ao buscar proprietário:", error);
         setErro404(true);
      } finally {
         setLoading(false);
      }
   };
   useEffect(() => {
      buscarProprietario();
   }, []);

   useEffect(() => {
      if (watch("cep")?.length === 8) {
         const editando = true;
         preencherCampos(
            watch("cep"),
            setCamposDesabilitados,
            setValue,
            editando
         );
      } else {
         restaurarCampos(setCamposDesabilitados, setValue);
      }
   }, [watch("cep")]);

   const onSubmit = async (data: validatorSchema) => {
      try {
         const response = await UseFetchPostFormData(
            `${BASE_URL}/proprietarios/${proprietario.id}`,
            {
               nome: data.nome,
               celular: data.celular,
               telefone: data.telefone,
               email: data.email,
               cpf: data.cpf,
               ativo: data.ativo === "Ativo",
               enderecoPutDTO: {
                  bairro: data.bairro,
                  cidade: data.cidade,
                  estado: data.estado,
                  rua: data.rua,
                  cep: data.cep,
                  tipoResidencia: data.tipoResidencia,
                  numeroCasaPredio: data.numeroCasaPredio,
                  numeroApartamento: data.numeroApartamento,
               },
            },
            "proprietario",
            "foto",
            data.imagemPerfil,
            "PUT",
            token
         );

         if (!response.ok) {
            const responseData = await response.json();
            if (responseData.erros) {
               const errosFormatados = UseErros(responseData);
               Object.keys(errosFormatados).forEach((campo) => {
                  setError(campo as keyof validatorSchema, {
                     type: "manual",
                     message: errosFormatados[campo],
                  });
               });
               const primeiroCampoComErro = Object.keys(
                  errosFormatados
               )[0] as keyof validatorSchema;
               if (primeiroCampoComErro) {
                  setFocus(primeiroCampoComErro);
               }
            }
            throw new Error(
               responseData.mensagem || "Erro ao editar proprietário."
            );
         }

         showNotification("Proprietário editado com sucesso!");
         clearErrors(); // Limpa os erros ao cadastrar com sucesso
         router.push("/gerenciamento/proprietarios");
      } catch (error) {
         console.error("Erro ao editar proprietario", error);
      }
   };

   useEffect(() => {
      if (watch("tipoResidencia") === "CASA") {
         setValue("numeroApartamento", null);
      }
   }, [watch("tipoResidencia")]);

   if (erro404) {
      return <Erro404 />; // Exibe a página de erro 404
   }

   if (loading) {
      return <div>Carregando...</div>; // Exibe um indicador de carregamento
   }

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className={`space-y-4 ${isSubmitting ? "opacity-40" : "opacity-100"}`}
      >
         {/* Campo Nome */}
         <InputPadrao
            htmlFor="nome"
            label={t("perfil.name")}
            type="text"
            placeholder="Ex: João Silva"
            {...register("nome")}
            mensagemErro={errors.nome?.message}
         />

         {/* Campo Celular */}
         <InputPadrao
            htmlFor="celular"
            label={t("perfil.phone")}
            type="text"
            placeholder="Ex: 47912345678"
            {...register("celular")}
            mensagemErro={errors.celular?.message}
         />

         {/* Campo Telefone */}
         <InputPadrao
            htmlFor="telefone"
            label={t("perfil.phone")}
            type="text"
            placeholder="Ex: 47912312121"
            {...register("telefone")}
            mensagemErro={errors.telefone?.message}
         />

         {/* Campo Email */}
         <InputPadrao
            htmlFor="email"
            label={t("perfil.email")}
            type="email"
            placeholder="Ex: joao.silva@example.com"
            {...register("email")}
            mensagemErro={errors.email?.message}
         />

         {/* Campo CPF */}
         <InputPadrao
            htmlFor="cpf"
            label="CPF"
            type="text"
            placeholder="Ex: 12345678901"
            {...register("cpf")}
            mensagemErro={errors.cpf?.message}
         />
         <InputPadrao
            htmlFor="cep"
            label="CEP"
            type="text"
            placeholder="Ex: 12345678"
            {...register("cep")}
            mensagemErro={errors.cep?.message}
            maxLength={8}
         />
         <InputPadrao
            htmlFor="estado"
            label="Estado"
            type="text"
            placeholder="Ex: SP"
            {...register("estado")}
            mensagemErro={errors.estado?.message}
            disabled={camposDesabilitados.estadoDesabilitado}
         />
         <InputPadrao
            htmlFor="cidade"
            label="Cidade"
            type="text"
            placeholder="Ex: São Paulo"
            {...register("cidade")}
            mensagemErro={errors.cidade?.message}
            disabled={camposDesabilitados.cidadeDesabilitada}
         />

         <InputPadrao
            htmlFor="bairro"
            label="Bairro"
            type="text"
            placeholder="Ex: Centro"
            {...register("bairro")}
            mensagemErro={errors.bairro?.message}
            disabled={camposDesabilitados.bairroDesabilitado}
         />
         <InputPadrao
            htmlFor="rua"
            label="Rua"
            type="text"
            placeholder="Ex: Rua das Flores"
            {...register("rua")}
            mensagemErro={errors.rua?.message}
            disabled={camposDesabilitados.ruaDesabilitada}
         />

         <div className="flex flex-col">
            <label
               htmlFor="tipoResidencia"
               className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl"
            >
               Tipo de Residência
            </label>
            <Controller
               name="tipoResidencia"
               control={control}
               render={({ field }) => (
                  <List
                     opcoes={opcoesTipoResidencia}
                     mudandoValor={field.onChange}
                     value={watch("tipoResidencia")}
                     placeholder="Selecione o tipo de residência"
                     
                  />
               )}
            />
            {errors.tipoResidencia && (
               <span className="text-red-500 text-sm">
                  {errors.tipoResidencia.message}
               </span>
            )}
         </div>

         <InputPadrao
            htmlFor="numeroCasaPredio"
            label="Número da Casa/Prédio"
            type="text"
            placeholder="Ex: 123"
            {...register("numeroCasaPredio", { valueAsNumber: true })}
            mensagemErro={errors.numeroCasaPredio?.message}
         />
         {watch("tipoResidencia") === "APARTAMENTO" && (
            <InputPadrao
               htmlFor="numeroApartamento"
               label="Número do Apartamento"
               type="number"
               placeholder="Ex: 456"
               {...register("numeroApartamento", {
                  valueAsNumber: true,
                  validate: (value) => {
                     if (watch("tipoResidencia") === "APARTAMENTO" && !value) {
                        return "O número do apartamento é obrigatório";
                     }
                     return true;
                  },
               })}
               mensagemErro={errors.numeroApartamento?.message}
            />
         )}
         <div className="flex flex-col">
            <Controller
               name="ativo"
               control={control}
               render={({ field }) => (
                  <List
                     title="Status"
                     opcoes={opcoesStatus}
                     mudandoValor={field.onChange}
                     placeholder="Ativo"
                     
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
                  preview={preview}
               />
            )}
         />

         {/* Botão de Envio */}
         <div className="flex justify-end gap-4">
            <Link href="/gerenciamento/proprietarios">
               <BotaoPadrao type="button" texto={t("common.cancel")} />
            </Link>
            <BotaoPadrao type="submit" texto={t("common.save")} />
         </div>
      </form>
   );
};

export default Formulario;
