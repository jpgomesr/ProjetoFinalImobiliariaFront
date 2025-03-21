"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React, { useEffect, useState } from "react";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useForm, Controller } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseErros } from "@/hooks/UseErros";
import { proprietarioValidator } from "@/validators/Validators";
import { TipoImovelEnum } from "@/models/Enum/TipoImovelEnum";
import InputPadrao from "@/components/InputPadrao";
import uploadImagem from "@/components/ComponentesCrud/UploadImagem";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import SelectPadrao from "@/components/SelectPadrao";
import { useRouter } from "next/navigation";
import RespostaViaCepModel from "@/models/ResposataViaCepModel";
import { preencherCampos, restaurarCampos } from "@/Functions/requisicaoViaCep";
import List from "@/components/List";
import { useNotification } from "@/context/NotificationContext";
import { salvarProprietario } from "./action";

const page = () => {
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

   useEffect(() => {}, []);

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
         proprietario : {
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
            }
         },
         imagemPerfil : data.imagemPerfil
      }
      
      const response = await salvarProprietario(objetoRequisicao)
         

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
               responseData.mensagem || "Erro ao criar o usuario."
            );
         }

         showNotification("Usuário cadastrado com sucesso");
         clearErrors(); // Limpa os erros ao cadastrar com sucesso
         router.push("/gerenciamento/proprietarios");
      } catch (error) {
         console.error("Erro ao criar usuário:", error);
      }
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Cadastro de proprietario"
               className={`w-full ${
                  isSubmitting ? "opacity-40" : "opacity-100"
               }`}
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

                  {/* Campo CEP */}

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
                              bordaPreta
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
                           onChange={(file: File | null) =>
                              field.onChange(file)
                           }
                        />
                     )}
                  />

                  {/* Botão de Envio */}
                  <div className="flex justify-center">
                     <BotaoPadrao
                        texto={isSubmitting ? "Enviando..." : "Enviar"}
                        className="border border-black"
                        disabled={isSubmitting}
                     />
                  </div>
               </form>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
