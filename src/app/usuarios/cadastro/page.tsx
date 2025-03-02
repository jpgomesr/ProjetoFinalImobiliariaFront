"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import SelectPadrao from "@/components/SelectPadrao";
import React, { useState } from "react";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import BotaoPadrao from "@/components/BotaoPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { useRouter } from "next/navigation";

const page = () => {
   const router = useRouter();

   const [nomeCompleto, setNomeCompleto] = useState("");
   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [confirmaSenha, setConfirmaSenha] = useState("");
   const [telefone, setTelefone] = useState("");
   const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
   const [tipoUsuario, setTipoUsuario] = useState("USUARIO");
   const [descricao, setDescricao] = useState("");
   const [erros, setErros] = useState<Record<string, string>>({});
   const [ativo, setAtivo] = useState<string>("Ativo");
   const opcoesAtivoDesativo = ["Ativo", "Desativado"];
   const [formularioDesativado, setFormularioDesativado] = useState<boolean>(false)
   
   

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   const tiposDeUsuarios = ["USUARIO", "ADMINISTRADOR", "EDITOR", "CORRETOR"];

   const criarUsuario = async () => {
      setFormularioDesativado(true)
      if (senha !== confirmaSenha) {
         setErros({ ...erros, confirmaSenha: "As senhas não coincidem" });
         return;
      }

      try {
         const response = await UseFetchPostFormData(
            `${BASE_URL}/usuarios`,
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
            "file",
            imagemPerfil,
            "POST"
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
         console.error("Erro ao criar usuário:", error);
         setFormularioDesativado(false)

      }
   };
   console.log(formularioDesativado)
   const handleChange = (setter: any, campo: string) => (value: string) => {
      setter(value);
      if (erros[campo]) {
         setErros({ ...erros, [campo]: "" });
      }
   };

   const enviandoFormulario = (e: React.FormEvent) => {
      e.preventDefault();
      criarUsuario();
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Cadastro de usuário" className={`w-full ${formularioDesativado ? "opacity-40" : "opacity-100"}`}>
               <form
                  onSubmit={(e) => enviandoFormulario(e)}
                  className="flex flex-col gap-2
            md:gap-3
            lg:gap-4
            xl:gap-5
            2xl:gap-6"
               >
                  <InputPadrao
                     htmlFor="nome"
                     label="Nome completo"
                     required={true}
                     tipoInput="text"
                     placeholder="Ex: Carlos"
                     onChange={handleChange(setNomeCompleto, "nome")}
                     mensagemErro={erros["nome"]}
                  />
                  <InputPadrao
                     htmlFor="email"
                     label="E-mail"
                     required={true}
                     tipoInput="email"
                     placeholder="Ex: Carlos@gmail.com"
                     onChange={handleChange(setEmail, "email")}
                     mensagemErro={erros["email"]}
                  />
                  <InputPadrao
                     htmlFor="senha"
                     label="Senha"
                     required={true}
                     tipoInput="password"
                     placeholder="Ex: 123C@31s$"
                     onChange={handleChange(setSenha, "senha")}
                     mensagemErro={erros["senha"]}
                  />
                  <InputPadrao
                     htmlFor="confirmaSenha"
                     label="Confirmar senha"
                     required={true}
                     tipoInput="password"
                     placeholder="Digite a senha novamente"
                     onChange={handleChange(setConfirmaSenha, "confirmaSenha")}
                     mensagemErro={erros["confirmaSenha"]}
                  />
                  <InputPadrao
                     htmlFor="telefone"
                     label="Telefone"
                     required={true}
                     tipoInput="text"
                     placeholder="Ex: 47912312121"
                     onChange={handleChange(setTelefone, "telefone")}
                     mensagemErro={erros["telefone"]}
                  />
                  <TextAreaPadrao
                     htmlFor="descricao"
                     label="Descricao"
                     onChange={handleChange(setDescricao, "descricao")}
                     value={descricao}
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
                  <UploadImagem onChange={setImagemPerfil} />
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
