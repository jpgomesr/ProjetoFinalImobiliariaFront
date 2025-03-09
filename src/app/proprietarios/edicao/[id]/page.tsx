"use client"

import FundoBrancoPadrao from '@/components/ComponentesCrud/FundoBrancoPadrao';
import Layout from '@/components/layout/LayoutPadrao';
import SubLayoutPaginasCRUD from '@/components/layout/SubLayoutPaginasCRUD';
import React, { useEffect, useState } from 'react'
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseErros } from "@/hooks/UseErros";
import { proprietarioValidator } from '@/validators/Validators';
import InputPadrao from '@/components/InputPadrao';
import UploadImagem from '@/components/ComponentesCrud/UploadImagem';
import BotaoPadrao from '@/components/BotaoPadrao';
import SelectPadrao from '@/components/SelectPadrao';
import { useRouter, useParams } from "next/navigation";
import ModelProprietario from '@/models/ModelProprietario';
import { buscarProprietarioPorId } from '@/Functions/proprietario/buscaProprietario';
import { preencherCampos, restaurarCampos } from '@/Functions/requisicaoViaCep';



const page = () => {

      const router = useRouter();
      let  {id} = useParams()
      id = id ? Array.isArray(id) ? id[0] : id : undefined
       const [camposDesabilitados, setCamposDesabilitados] = useState({
          cidadeDesabilitada : true,
          bairroDesabilitado  : true,
          ruaDesabilitada  : true ,
          estadoDesabilitado : true
         })

      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const opcoesTipoResidencia = ["CASA", "APARTAMENTO"]
      const validator  = proprietarioValidator; 
      type validatorSchema = z.infer<typeof validator>;

      const [preview, setPreview] = useState<string>();
      const [proprietario, setProprietario] = useState<ModelProprietario>()

      useEffect(() => {
        preencherInformacoesProprietario()
    }, [])

  

      const preencherInformacoesProprietario =  async () => {
 
            if(id) {
                const proprietarioRequisicao : ModelProprietario = await buscarProprietarioPorId(id);

                if(proprietarioRequisicao){
                    console.log(proprietarioRequisicao)
                    setValue("nome", proprietarioRequisicao.nome);
                    setValue("celular", proprietarioRequisicao.celular);
                    setValue("telefone", proprietarioRequisicao.telefone);
                    setValue("cpf", proprietarioRequisicao.cpf);
                    setValue("email", proprietarioRequisicao.email);
                    setValue("bairro", proprietarioRequisicao.endereco.bairro);
                    setValue("cidade", proprietarioRequisicao.endereco.cidade);
                    setValue("estado", proprietarioRequisicao.endereco.estado);
                    setValue("rua", proprietarioRequisicao.endereco.rua);
                    setValue("cep", proprietarioRequisicao.endereco.cep);
                    setValue("tipoResidencia", proprietarioRequisicao.endereco.tipoResidencia);
                    setValue("numeroCasaPredio", proprietarioRequisicao.endereco.numeroCasaPredio);
                    setValue("numeroApartamento", proprietarioRequisicao.endereco.numeroApartamento);
                    setPreview(proprietarioRequisicao.imagemUrl)
                }
                setProprietario(proprietarioRequisicao)
              


            }
      }




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
      tipoResidencia: "CASA",
      numeroCasaPredio: 0,
      numeroApartamento: undefined, 
    },
  });

  useEffect(() => {
    if (watch("cep")?.length === 8) {
      const editando = true;
      preencherCampos(watch("cep"), setCamposDesabilitados, setValue,editando)
    }
    else{
      restaurarCampos(setCamposDesabilitados, setValue)
    }
   }, [watch("cep")]);



 const onSubmit = async (data: validatorSchema) => {
     try {
       const response = await UseFetchPostFormData(
         `${BASE_URL}/proprietarios/${id}`,
         {
            nome: data.nome,
            celular: data.celular,
            telefone: data.telefone,
            email: data.email,
            cpf: data.cpf,
            enderecoPutDTO : {
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            rua: data.rua,
            cep: data.cep,
            tipoResidencia: data.tipoResidencia,
            numeroCasaPredio: data.numeroCasaPredio,
            numeroApartamento: data.numeroApartamento, 
        }
         },
         "proprietario",
         "foto",
         data.imagemPerfil,
         "PUT"
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
         throw new Error(responseData.mensagem || "Erro ao editar proprietario.");
      }
 
       clearErrors(); // Limpa os erros ao cadastrar com sucesso
       router.push("/proprietarios");
     } catch (error) {
       console.error("Erro ao editar proprietario", error);
     }
   };



    return (
        <Layout className="py-0">
          <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
              titulo="Edição de proprietario"
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
            <SelectPadrao
              opcoes={opcoesTipoResidencia}
              onChange={field.onChange}
              placeholder="Selecione o tipo de residência"
              selecionado={field.value}
              className="w-2/4 lg:max-w-sm"
            />
          )}
        />
        {errors.tipoResidencia && (
          <span className="text-red-500 text-sm">{errors.tipoResidencia.message}</span>
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

      <InputPadrao
        htmlFor="numeroApartamento"
        label="Número do Apartamento"
        type="number"
        placeholder="Ex: 456"
        {...register("numeroApartamento", { valueAsNumber: true })}
        mensagemErro={errors.numeroApartamento?.message}
      />
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

}

export default page