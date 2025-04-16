"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseErros } from "@/hooks/UseErros";
import { proprietarioValidator } from "@/validators/Validators";
import InputPadrao from "@/components/InputPadrao";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import { useRouter } from "next/navigation";
import { preencherCampos, restaurarCampos } from "@/Functions/requisicaoViaCep";
import List from "@/components/List";
import { useNotification } from "@/context/NotificationContext";
import { salvarProprietario } from "./action";
import Link from "next/link";

interface FormularioCadastroProprietarioProps {
   token: string;
}
const FormularioCadastroProprietario = ({ token }: FormularioCadastroProprietarioProps) => {
   const router = useRouter();
   const { showNotification } = useNotification();

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const opcoesTipoResidencia = [
      { id: "CASA", label: "Casa" },
      { id: "APARTAMENTO", label: "Apartamento" },
   ];

   const validator = proprietarioValidator;
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

   type validatorSchema = z.infer<typeof validator>;

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      setError,
      setFocus,
      clearErrors,
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
         tipoResidencia: "CASA",
         numeroCasaPredio: 0,
         numeroApartamento: null,
         ativo: "Ativo",
      },
   });

   useEffect(() => {
      if (watch("tipoResidencia") === "CASA") {
         setValue("numeroApartamento", null);
      } else {
         setValue("numeroApartamento", NaN);
      }
   }, [watch("tipoResidencia")]);

   useEffect(() => {
      if (watch("cep")?.length === 8) {
         preencherCampos(watch("cep"), setCamposDesabilitados, setValue);
      } else {
         restaurarCampos(setCamposDesabilitados, setValue);
      }
   }, [watch("cep")]);

   const onSubmit = async (data: validatorSchema) => {
      try {
         const objetoRequisicao = {
            proprietario: {
               nome: data.nome || "",
               celular: data.celular || "",
               telefone: data.telefone || "",
               email: data.email || "",
               cpf: data.cpf || "",
               ativo: data.ativo === "Ativo",
               enderecoPostDTO: {
                  bairro: data.bairro,
                  cidade: data.cidade,
                  estado: data.estado,
                  rua: data.rua,
                  cep: data.cep,
                  tipoResidencia: data.tipoResidencia,
                  numeroCasaPredio: data.numeroCasaPredio.toString(),
                  numeroApartamento: data.numeroApartamento?.toString() || "",
               },
            }, 
            imagemPerfil: data.imagemPerfil,
            token: token,
         };

         const response = await salvarProprietario(objetoRequisicao,);

         if (!response.ok) {
            const responseData = await response;
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
               responseData.mensagem || "Erro ao criar o proprietário."
            );
         }

         showNotification("Proprietário cadastrado com sucesso");
         clearErrors(); // Limpa os erros ao cadastrar com sucesso
         router.push("/gerenciamento/proprietarios");
      } catch (error) {
         console.error("Erro ao criar proprietário:", error);
         showNotification("Erro ao criar proprietário. Tente novamente.");
      }
   };

   return (
      <FundoBrancoPadrao
         titulo="Cadastro de proprietário"
         className={`w-full ${isSubmitting ? "opacity-40" : "opacity-100"}`}
      >
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <InputPadrao
               htmlFor="nome"
               label="Nome"
               type="text"
               placeholder="Ex: João Silva"
               {...register("nome")}
               mensagemErro={errors.nome?.message}
            />

            {/* Campo Celular */}
            <InputPadrao
               htmlFor="celular"
               label="Celular"
               type="text"
               placeholder="Ex: 47912345678"
               {...register("celular")}
               mensagemErro={errors.celular?.message}
            />

            {/* Campo Telefone */}
            <InputPadrao
               htmlFor="telefone"
               label="Telefone"
               type="text"
               placeholder="Ex: 47912312121"
               {...register("telefone")}
               mensagemErro={errors.telefone?.message}
            />

            {/* Campo Email */}
            <InputPadrao
               htmlFor="email"
               label="Email"
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

            {/* Campo Estado */}
            <InputPadrao
               htmlFor="estado"
               label="Estado"
               type="text"
               placeholder="Ex: SP"
               {...register("estado")}
               mensagemErro={errors.estado?.message}
               disabled={camposDesabilitados.estadoDesabilitado}
            />

            {/* Campo Cidade */}
            <InputPadrao
               htmlFor="cidade"
               label="Cidade"
               type="text"
               placeholder="Ex: São Paulo"
               {...register("cidade")}
               mensagemErro={errors.cidade?.message}
               disabled={camposDesabilitados.cidadeDesabilitada}
            />

            {/* Campo Bairro */}
            <InputPadrao
               htmlFor="bairro"
               label="Bairro"
               type="text"
               placeholder="Ex: Centro"
               {...register("bairro")}
               mensagemErro={errors.bairro?.message}
               disabled={camposDesabilitados.bairroDesabilitado}
            />

            {/* Campo Rua */}
            <InputPadrao
               htmlFor="rua"
               label="Rua"
               type="text"
               placeholder="Ex: Rua das Flores"
               {...register("rua")}
               mensagemErro={errors.rua?.message}
               disabled={camposDesabilitados.ruaDesabilitada}
            />

            {/* Campo Tipo de Residência */}
            <div className="flex flex-col lg:gap-1 2xl:gap-2">
               <label
                  htmlFor="tipoResidencia"
                  className="opacity-90 text-xs font-montserrat  md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl"
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
                  />
               )}
            />

            {/* Botão de Envio */}
            <div className="flex justify-center gap-2">
               <Link href="/gerenciamento/proprietarios">
                  <BotaoPadrao
                     texto="Voltar"
                     disabled={isSubmitting}
                     type="button"
                  />
               </Link>
               <BotaoPadrao
                  texto={isSubmitting ? "Concluindo..." : "Concluir"}
                  disabled={isSubmitting}
                  type="submit"
               />
            
            </div>
         </form>
      </FundoBrancoPadrao>
   );
};

export default FormularioCadastroProprietario;
