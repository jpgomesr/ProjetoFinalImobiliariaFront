"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
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

const Page = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

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
      const response = await UseFetchPostFormData(
        `${BASE_URL}/usuarios`,
        {
          nome: data.nomeCompleto,
          email: data.email,
          senha: data.senha,
          telefone: data.telefone?.trim() === "" ? null : data.telefone,
          role: data.tipoUsuario,
          descricao: data.descricao,
          ativo: data.ativo === "Ativo",
        },
        "usuario",
        "file",
        data.imagemPerfil,
        "POST"
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

      showNotification("Usuário cadastrado com sucesso");
      clearErrors(); // Limpa os erros ao cadastrar com sucesso
      router.push("/usuarios");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  return (
    <Layout className="py-0">
      <SubLayoutPaginasCRUD>
        <FundoBrancoPadrao
          titulo="Cadastro de usuário"
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
              <Controller
                name="tipoUsuario"
                control={control}
                render={({ field }) => (
                  <List
                    title="Tipo usuario"
                    opcoes={tiposDeUsuarios}
                    mundandoValor={field.onChange}
                    placeholder="Tipo usuario"
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
                    title="status"
                    opcoes={opcoesStatus}
                    mundandoValor={field.onChange}
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
            <div className="flex justify-center">
              <BotaoPadrao
                texto="Concluir"
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

export default Page;