"use client";

import BotaoPadrao from "@/components/BotaoPadrao";
import CardUsuario from "@/components/CardUsuario";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
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
        <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Gerenciamento de usuários"
               className="w-full"
            >
               <div className="grid grid-cols-1 gap-3 w-full
               md:grid-cols-[1fr_3fr_1fr_1fr]
               xl:grid-cols-[1fr_6fr_1fr_1fr]
               ">
                  <select
                     name="Status"
                     className="text-black border-black border px-2 py-1 rounded-md text-sm 
                     lg:text-base lg:py-2 lg:px-3
                     2xl:py-3 2xl:px-4
                     "
                     value={"Ativo"}
                     onChange={(e) => setStatus(e.target.value)}
                  >
                     <option value="" disabled hidden>
                        Status
                     </option>
                     {renderizarOpcoesStatus()}
                  </select>
                  <input
                     className="border border-gray-500 rounded-md px-2 py-2 text-sm  
                     lg:text-base lg:py-2 lg:px-3
                      2xl:py-3 2xl:px-4"
                     placeholder="Digite o nome do usuário"
                  ></input>
                  <select
                     className="text-black border-black border px-2 py-1 rounded-md text-sm 
                      lg:text-base lg:py-2 lg:px-3
                       2xl:py-3 2xl:px-4"
                     name="tipo_usuario"
                     value={tipoUsuario}
                     onChange={(e) => setTipoUsuario(e.target.value)}
                  >
                     {renderizarOpcoesTipoUsuario()}
                  </select>
                  <button
                     className="flex items-center justify-center bg-havprincipal rounded-md text-white
                  text-sm py-1 px-2
                  lg:text-base lg:py-2 lg:px-3
                  2xl:py-3 2xl:px-4"
                  >
                     Adicionar <PlusIcon className="w-4" />
                  </button>
               </div>
               <div className="grid grid-cols-1 gap-4 w-full
               md:mt-2
               lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4
               2xl:mt-6">
               <CardUsuario
                  id={1}
                  nome="Carlos"
                  status="Ativo"
                  email="Carlos@gmail.com"
                  tipoConta="USUARIO"
               />
               <CardUsuario
                  id={2}
                  nome="Carlos"
                  status="Ativo"
                  email="Carlos@gmail.com"
                  tipoConta="USUARIO"
               />
               </div>
             
            </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
