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
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import ModelUsuario from "@/models/ModelUsuario";

const page = () => {
   const router = useRouter();

   const [usuario, setUsuario] = useState<ModelUsuario>();

   const [nomeCompleto, setNomeCompleto] = useState("");
   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [confirmaSenha, setConfirmaSenha] = useState("");
   const [telefone, setTelefone] = useState("");
   const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
   const [tipoUsuario, setTipoUsuario] = useState("USUARIO");
   const [descricao, setDescricao] = useState("");
   const [preview, setPreview] = useState<any>(undefined);
   const [erros, setErros] = useState<Record<string, string>>({});
   const [ativo, setAtivo] = useState<string>("Ativo");
   const [formularioDesativado, setFormularioDesativado] = useState<boolean>(false)

   const { id } = useParams();

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const tiposDeUsuarios = ["USUARIO", "ADMINISTRADOR", "EDITOR", "CORRETOR"];
   const opcoesAtivoDesativo = ["Ativo", "Desativado"];

   useEffect(() => {
      preencherInformacoesAtuaisDoUsuario();
   }, []);

   const handleChange = (setter: any, campo: string) => (value: string) => {
      setter(value);
      if (erros[campo]) {
         setErros({ ...erros, [campo]: "" });
      }
   };

   const transformarParaModel = (usuario: any) => {
      const usuarioModel = new ModelUsuario(
         usuario.id,
         usuario.role,
         usuario.nome,
         usuario.telefone,
         usuario.email,
         usuario.descricao,
         usuario.foto,
         usuario.ativo
      );
      return usuarioModel;
   };
   const buscarUsuarioCadastrado = async () => {
      const requisicao = await fetch(`${BASE_URL}/usuarios/${id}`);

      const data = await requisicao.json();

      return data;
   };

   const preencherInformacoesAtuaisDoUsuario = async () => {
      const informacoes = await buscarUsuarioCadastrado();

      const usuario = transformarParaModel(informacoes);

      setNomeCompleto(usuario.nome);
      setDescricao(usuario.descricao);
      setEmail(usuario.email);
      setTelefone(usuario.telefone);
      setTipoUsuario(usuario.role);
      setPreview(usuario.foto);
      setAtivo(usuario.ativo ? "Ativo" : "Desativado");
   };
   const editarUsuario = async () => {
      if (senha !== confirmaSenha) {
         setErros({ ...erros, confirmaSenha: "As senhas não coincidem" });
         return;
      }
      try {
         const response = await UseFetchPostFormData(
            `${BASE_URL}/usuarios/${id}`,
            {
               nome: nomeCompleto,
               email: email,
               senha: senha,
               telefone: telefone,
               role: tipoUsuario,
               descricao: descricao,
               ativo: ativo === "Ativo" ? true : false,
            },
            "usuario",
            "novaImagem",
            imagemPerfil,
            "PUT"
         );
         if (!response.ok) {
            const data = await response.json();

            if (data.erros) {
               const errosFormatados = data.erros.reduce(
                  (acc: any, erro: any) => {
                     acc[erro.campo] = erro.erro || "Erro desconhecido";
                     return acc;
                  },
                  {}
               );

               setErros(errosFormatados);
            }
             setFormularioDesativado(false)
            throw new Error(data.mensagem || "Erro ao criar usuário.");
         }
         setErros({}); // Limpa os erros ao cadastrar com sucesso
         router.push("/usuarios");
      } catch (error) {
         console.error("Erro ao editar o usuário:", error);
         setFormularioDesativado(false)

      }
   };
   const enviandoFormulario = (e: React.FormEvent) => {
      e.preventDefault();
      setFormularioDesativado(true)
      editarUsuario();

   };
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Edição de usuário" className={`w-full ${formularioDesativado ? "opacity-40" : "opacity-100"}`}>
               <form
                  onSubmit={(e) => enviandoFormulario(e)}
                  className={`flex flex-col gap-2 
            md:gap-3
            lg:gap-4
            xl:gap-5
            2xl:gap-6`}
               >
                  <InputPadrao
                     htmlFor="nome"
                     label="Nome completo"
                     required={true}
                     tipoInput="text"
                     placeholder="Ex:Carlos"
                     onChange={handleChange(setNomeCompleto, "nome")}
                     value={nomeCompleto}
                     maxLenght={100}
                     mensagemErro={erros["nome"]}
                     
                  />
                  <InputPadrao
                     htmlFor="email"
                     label="E-mail"
                     required={true}
                     tipoInput="email"
                     placeholder="Ex:Carlos@gmail.com"
                     onChange={handleChange(setEmail, "email")}
                     value={email}
                     maxLenght={100}
                     mensagemErro={erros["email"]}
                  />
                  <InputPadrao
                     htmlFor="senha"
                     label="Senha"
                     required={true}
                     tipoInput="password"
                     placeholder="Ex:123C@31s$"
                     onChange={handleChange(setSenha, "senha")}
                     minLength={8}
                     maxLenght={45}
                     mensagemErro={erros["senha"]}
                  />
                  <InputPadrao
                     htmlFor="senha"
                     label="Confirmar senha"
                     required={true}
                     tipoInput="password"
                     minLength={8}
                     maxLenght={45}
                     placeholder="Digite a senha novamente"
                     onChange={handleChange(setConfirmaSenha, "confirmaSenha")}
                     mensagemErro={erros["confirmaSenha"]}
                  />
                  <InputPadrao
                     htmlFor="telefone"
                     label="Telefone"
                     required={true}
                     minLength={11}
                     maxLenght={11}
                     tipoInput="text"
                     placeholder="Ex:47912312121"
                     onChange={handleChange(setTelefone, "telefone")}
                     value={telefone}
                     mensagemErro={erros["telefone"]}
                  />
                  <TextAreaPadrao
                     htmlFor="descricao"
                     label="Descricao"
                     onChange={handleChange(setDescricao, "descricao")}
                     value={descricao}
                     maxLength={500}
                     mensagemErro={erros["descricao"]}
                  />
                  <div className="flex flex-col">
                     <label
                        htmlFor="tipo-usuario"
                        className="opacity-90 text-xs
                     font-montserrat
                     md:text-sm
                     lg:text-base lg:rounded-lg
                     2xl:text-xl 2xl:rounded-xl"
                     >
                        Tipo usuario
                     </label>
                     <SelectPadrao
                        opcoes={tiposDeUsuarios}
                        onChange={setTipoUsuario}
                        placeholder="Tipo usuario"
                        selecionado={tipoUsuario}
                        className="w-2/4 lg:max-w-sm"
                     />
                  </div>
                  <div className="flex flex-col">
                     <label
                        htmlFor="tipo-usuario"
                        className="opacity-90 text-xs
                     font-montserrat
                     md:text-sm
                     lg:text-base lg:rounded-lg
                     2xl:text-xl 2xl:rounded-xl"
                     >
                        Status
                     </label>
                     <SelectPadrao
                        opcoes={opcoesAtivoDesativo}
                        onChange={setAtivo}
                        placeholder="Ativo"
                        selecionado={ativo}
                        className="w-2/4 lg:max-w-sm"
                     />
                  </div>

                     
                     <UploadImagem onChange={setImagemPerfil} preview={preview} />

                  <div className="flex justify-center">
                     <BotaoPadrao

                        texto="Concluir"
                        className="border border-black"
                        disable={formularioDesativado}
                     />
                  </div>
               </form>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
