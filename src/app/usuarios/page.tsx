"use client";

import { UseFetchDelete } from "@/hooks/UseFetchDelete";
import CardUsuario from "@/components/CardUsuario";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import ModelUsuario from "@/models/ModelUsuario";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
   const opcoesStatus = [{ status: "Ativo" }, { status: "Inativo" }];
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const [status, setStatus] = useState<string>("Ativo");
   const [tipoUsuario, setTipoUsuario] = useState<string>("Usuario");
   const [usuarios, setUsuarios] = useState<ModelUsuario[]>();
   const [revalidarQuery, setRevalidarQuery] = useState<boolean>(false);

   useEffect(() => {
      renderizarUsuariosApi();
   }, [revalidarQuery]);

   const renderizarUsuariosApi = async () => {
      const response = await fetch(`${BASE_URL}/usuarios`);

      const data = await response.json();

      setUsuarios(transformarParaModel(data));
   };
   const deletarUsuario = async (id: number) => {
      const response = await UseFetchDelete(`${BASE_URL}/usuarios/${id}`);
      setRevalidarQuery(!revalidarQuery);
   };

   const renderizarUsuariosPagina = () => {
      return usuarios?.map((usuario) => (
         <CardUsuario
            email={usuario.email}
            id={usuario.id}
            nome={usuario.nome}
            status={usuario.ativo ? "Ativo" : "Desativado"}
            tipoConta={usuario.role}
            key={usuario.id}
            imagem={usuario.foto}
            deletarUsuario={deletarUsuario}
         />
      ));
   };

   const transformarParaModel = (data: any) => {
      const usuarios: ModelUsuario[] = data.content.map((usuario: any) => {
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
      });

      return usuarios;
   };

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
               <div
                  className="grid grid-cols-1 gap-3 w-full place-content-center place-self-center
               md:grid-cols-[1fr_3fr_1fr_1fr]
               xl:grid-cols-[1fr_6fr_1fr_1fr]
               "
               >
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
                  <Link href={"/usuarios/cadastro"}>
                     <button
                        className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full
                  text-sm py-1 px-2
                  lg:text-base lg:py-2 lg:px-3
                  2xl:py-3 2xl:px-4"
                     >
                        Adicionar <PlusIcon className="w-4" />
                     </button>
                  </Link>
               </div>
               <div
                  className="grid grid-cols-1 gap-4 w-full
               md:mt-2
               lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4
               2xl:mt-6"
               >
                  {renderizarUsuariosPagina()}
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
