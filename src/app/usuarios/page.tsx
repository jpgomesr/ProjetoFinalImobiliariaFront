"use client";

import BotaoPadrao from "@/components/BotaoPadrao";
import CardUsuario from "@/components/CardUsuario";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/Layout";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

const page = () => {
   const opcoesStatus = [{ status: "Ativo" }, { status: "Inativo" }];

   const [status, setStatus] = useState<string>("Ativo");
   const [tipoUsuario, setTipoUsuario] = useState<string>("Usuario");

   const tiposDeUsuarios = [
      { tipo: "USUARIO" },
      { tipo: "ADMINISTRADOR" },
      { tipo: "EDITOR" },
      { tipo: "CORRETOR" },
   ];

   const renderizarOpcoesTipoUsuario = () => {
      return tiposDeUsuarios.map((objeto, key) => (
         <option value={objeto.tipo} key={key}>
            {objeto.tipo}
         </option>
      ));
   };

   const renderizarOpcoesStatus = () => {
      return opcoesStatus.map((opcao, key) => (
         <option value={opcao.status} key={key}>
            {opcao.status}
         </option>
      ));
   };

   return (
      <Layout className="py-0">
         <div className="bg-begeClaroPadrao w-full flex flex-col items-center justify-center  py-6">
            <FundoBrancoPadrao
               titulo="Gerenciamento de usuários"
               className="w-full"
            >
               <div className="flex flex-wrap gap-3 w-full px-2">
                  <select
                     name="Status"
                     className="text-black border-black border px-2 py-1 rounded-md text-sm flex-1"
                     value={"Ativo"}
                     onChange={(e) => setStatus(e.target.value)}
                  >
                     <option value="" disabled>
                        Status
                     </option>
                     {renderizarOpcoesStatus()}
                  </select>
                  <input
                     className="border border-gray-500 rounded-md px-2 py-2 text-sm flex-[3_1_0] "
                     placeholder="Digite o nome do usuário"
                  ></input>
                  <select
                     className="text-black border-black border px-2 py-1 rounded-md text-sm flex-1"
                     name="tipo_usuario"
                     value={tipoUsuario}
                     onChange={(e) => setTipoUsuario(e.target.value)}
                  >
                     {renderizarOpcoesTipoUsuario()}
                  </select>
                  <button
                     className="flex items-center justify-center bg-havprincipal rounded-md text-white
                  text-sm py-1 px-2 flex-1"
                  >
                     Adicionar <PlusIcon className="w-4" />
                  </button>
               </div>
               <CardUsuario
                  nome="Carlos"
                  status="Ativo"
                  email="Carlos@gmail.com"
                  tipoConta="USUARIO"
               />
            </FundoBrancoPadrao>
         </div>
      </Layout>
   );
};

export default page;
