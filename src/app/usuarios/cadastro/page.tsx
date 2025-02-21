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

const page = () => {
   const [nomeCompleto, setNomeCompleto] = useState("");
   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [confirmaSenha, setConfirmaSenha] = useState("");
   const [telefone, setTelefone] = useState("");
   const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
   const [tipoUsuario, setTipoUsuario] = useState("USUARIO");
   const [descricao, setDescricao] = useState("");
   console.log(nomeCompleto);

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   const tiposDeUsuarios = ["USUARIO", "ADMINISTRADOR", "EDITOR", "CORRETOR"];

   const criarUsuario = async () => {
      const data = await fetch(`${BASE_URL}/usuarios`, {
         method: "POST",
         headers: {
            "Content-type": "application/json",
         },
         body: JSON.stringify({
            nome: nomeCompleto,
            email: email,
            senha: senha,
            telefone: telefone,
            role: tipoUsuario,
            descricao: descricao,
         }),
      });
      const response = await data;

      console.log(response);
   };
   const enviandoFormulario = (e: React.FormEvent) => {
      e.preventDefault();
      criarUsuario();
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Cadastro de usuário" className="w-full">
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
                     placeholder="Ex:Carlos"
                     onChange={setNomeCompleto}
                  />
                  <InputPadrao
                     htmlFor="email"
                     label="E-mail"
                     required={true}
                     tipoInput="text"
                     placeholder="Ex:Carlos@gmail.com"
                     onChange={setEmail}
                  />
                  <InputPadrao
                     htmlFor="senha"
                     label="Senha"
                     required={true}
                     tipoInput="password"
                     placeholder="Ex:123C@31s$"
                     onChange={setSenha}
                  />
                  <InputPadrao
                     htmlFor="senha"
                     label="Confirmar senha "
                     required={true}
                     tipoInput="password"
                     placeholder="Digite a senha novamente"
                     onChange={setConfirmaSenha}
                  />
                  <InputPadrao
                     htmlFor="telefone"
                     label="Telefone"
                     required={true}
                     tipoInput="text"
                     placeholder="Ex:47912312121"
                     onChange={setTelefone}
                  />
                  <TextAreaPadrao
                     htmlFor="descricao"
                     label="Descricao"
                     onChange={setDescricao}
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
                  <UploadImagem />
                  <div className="flex justify-center">
                     <BotaoPadrao
                        texto="Concluir"
                        className="border border-black"
                     />
                  </div>
               </form>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
