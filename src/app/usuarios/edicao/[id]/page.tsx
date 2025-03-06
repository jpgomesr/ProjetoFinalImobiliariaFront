"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import SelectPadrao from "@/components/SelectPadrao";
import React, { useEffect } from "react";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useRouter, useParams } from "next/navigation";
import ModelUsuario from "@/models/ModelUsuario";
import Switch from "@/components/ComponentesCrud/Switch";
import { UseErros } from "@/hooks/UseErros";
import { useForm, Controller } from "react-hook-form";

// Interface para os valores do formulário
interface FormValues {
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmaSenha: string;
  telefone: string;
  tipoUsuario: string;
  descricao: string;
  ativo: string;
  imagemPerfil: File | null;
  alterarSenha: boolean;
  preview : string | undefined;
}

const Page = () => {
  const router = useRouter();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
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
      alterarSenha: false,
      preview: undefined
    },
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const tiposDeUsuarios = ["USUARIO", "ADMINISTRADOR", "EDITOR", "CORRETOR"];
  const opcoesAtivoDesativo = ["Ativo", "Desativado"];

  const transformarParaModel = (usuario: any): ModelUsuario => {
    return new ModelUsuario(
      usuario.id,
      usuario.role,
      usuario.nome,
      usuario.telefone,
      usuario.email,
      usuario.descricao,
      usuario.foto,
      usuario.ativo
    );
  };

  const buscarUsuarioCadastrado = async () => {
    const requisicao = await fetch(`${BASE_URL}/usuarios/${id}`);
    const data = await requisicao.json();
    return data;
  };

  const preencherInformacoesAtuaisDoUsuario = async () => {
    const informacoes = await buscarUsuarioCadastrado();
    const usuario = transformarParaModel(informacoes);

    setValue("nomeCompleto", usuario.nome);
    setValue("descricao", usuario.descricao);
    setValue("email", usuario.email);
    setValue("telefone", usuario.telefone);
    setValue("tipoUsuario", usuario.role);
    setValue("ativo", usuario.ativo ? "Ativo" : "Desativado");
    setValue("preview", usuario.foto)
  };

  useEffect(() => {
    preencherInformacoesAtuaisDoUsuario();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (data.senha !== data.confirmaSenha) {
      setError("confirmaSenha", {
        type: "manual",
        message: "As senhas não coincidem",
      });
      return;
    }

    try {
      const response = await UseFetchPostFormData(
        `${BASE_URL}/usuarios/${id}`,
        {
          nome: data.nomeCompleto,
          email: data.email,
          senha: data.alterarSenha ? data.senha : null,
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
            setError(campo as keyof FormValues, {
              type: "manual",
              message: errosFormatados[campo],
            });
          });
        }
        throw new Error(responseData.mensagem || "Erro ao editar usuário.");
      }

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
          titulo="Edição de usuário"
          className={`w-full ${isSubmitting ? "opacity-40" : "opacity-100"}`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6"
          >
            <InputPadrao
              htmlFor="nomeCompleto"
              label="Nome completo"
              required={true}
              type="text"
              placeholder="Ex: Carlos"
              {...register("nomeCompleto", { required: "Nome é obrigatório" })}
              mensagemErro={errors.nomeCompleto?.message}
            />
            <InputPadrao
              htmlFor="email"
              label="E-mail"
              required={true}
              type="email"
              placeholder="Ex: Carlos@gmail.com"
              {...register("email", { required: "E-mail é obrigatório" })}
              mensagemErro={errors.email?.message}
            />
            <div>
              <p className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl">
                Alterar Senha?
              </p>
              <Controller
                name="alterarSenha"
                control={control}
                render={({ field }) => (
                  <Switch
                    handleAcao={(checked: boolean) => {
                      field.onChange(checked);
                      if (!checked) {
                        setValue("senha", "");
                        setValue("confirmaSenha", "");
                      }
                    }}
                    className="w-8 h-4 sm:w-12 sm:h-6 md:w-14 md:h-7 lg:w-16 lg:h-8"
                  />
                )}
              />
            </div>
            <InputPadrao
              htmlFor="senha"
              label="Senha"
              required={true}
              type="password"
              placeholder="Ex: 123C@31s$"
              {...register("senha", {
                required: watch("alterarSenha") ? "Senha é obrigatória" : false,
                minLength: {
                  value: 8,
                  message: "A senha deve ter no mínimo 8 caracteres",
                },
                maxLength: {
                  value: 45,
                  message: "A senha deve ter no máximo 45 caracteres",
                },
              })}
              mensagemErro={errors.senha?.message}
              disabled={!watch("alterarSenha")}
            />
            <InputPadrao
              htmlFor="confirmaSenha"
              label="Confirmar senha"
              required={true}
              type="password"
              placeholder="Digite a senha novamente"
              {...register("confirmaSenha", {
                required: watch("alterarSenha") ? "Confirmação de senha é obrigatória" : false,
                minLength: {
                  value: 8,
                  message: "A senha deve ter no mínimo 8 caracteres",
                },
                maxLength: {
                  value: 45,
                  message: "A senha deve ter no máximo 45 caracteres",
                },
              })}
              mensagemErro={errors.confirmaSenha?.message}
              disabled={!watch("alterarSenha")}
            />
            <InputPadrao
              htmlFor="telefone"
              label="Telefone"
              required={true}
              type="text"
              placeholder="Ex: 47912312121"
              {...register("telefone", {
                required: "Telefone é obrigatório",
                minLength: {
                  value: 11,
                  message: "O telefone deve ter 11 caracteres",
                },
                maxLength: {
                  value: 11,
                  message: "O telefone deve ter 11 caracteres",
                },
              })}
              mensagemErro={errors.telefone?.message}
            />
            <TextAreaPadrao
              htmlFor="descricao"
              label="Descricao"
              {...register("descricao", {
                maxLength: {
                  value: 500,
                  message: "A descrição deve ter no máximo 500 caracteres",
                },
              })}
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
                  onChange={(file: File | null) => field.onChange(file)}
                  preview={watch("preview")}
                />
              )}
            />
            <div className="flex justify-center">
              <BotaoPadrao
                texto="Concluir"
                className="border border-black"
                disable={isSubmitting}
              />
            </div>
          </form>
        </FundoBrancoPadrao>
      </SubLayoutPaginasCRUD>
    </Layout>
  );
};

export default Page;