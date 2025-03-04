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
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";
import ModalCofirmacao from "@/components/ComponentesCrud/ModalConfirmacao";

const page = () => {
   const opcoesStatus = [{ status: "Ativo" }, { status: "Inativo" }];
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const [status, setStatus] = useState<string>("Ativo");
   const [tipoUsuario, setTipoUsuario] = useState<string>("Usuario");
   const [usuarios, setUsuarios] = useState<ModelUsuario[]>();
   const [revalidarQuery, setRevalidarQuery] = useState<boolean>(false);
   const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null)
   const [mostrarNotificacao, setMostrarNotificacao] = useState(false)
   const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(null)


   useEffect(() => {
      renderizarUsuariosApi();
   }, [revalidarQuery]);


   const fechandoNotificacao = () => {
      setMostrarNotificacao(false)
      setItemDeletadoId(null)
   }
   const desfazendoDelete = async () => {
      await fetch(`${BASE_URL}/usuarios/restaurar/${itemDeletadoId}`,
         {
            method : "POST"
         }
      )
      setRevalidarQuery(!revalidarQuery)

   }


   const renderizarUsuariosApi = async () => {
      const response = await fetch(`${BASE_URL}/usuarios?role=${tipoUsuario}`);

      const data = await response.json();

      setUsuarios(transformarParaModel(data));
   };
   const deletarUsuario = async () => {
      const response = await UseFetchDelete(`${BASE_URL}/usuarios/${idItemParaDeletar}`);
      setItemDeletadoId(idItemParaDeletar)
      setMostrarNotificacao(true)
      setRevalidarQuery(!revalidarQuery);
      setIdItemParaDeletar(null)
   };
   const exibirModal = (id : number) => {
      setIdItemParaDeletar(id)
      setModalConfirmacaoAberto(true);
      
   }

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
            deletarUsuario={exibirModal}
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
                  className="grid grid-cols-1 gap-3 w-full
               md:grid-cols-[1fr_5fr_1fr_1fr]
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
                     onChange={(e) =>  {
                        setTipoUsuario(e.target.value)
                        setRevalidarQuery(!revalidarQuery)
                     }}
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

               <NotificacaoCrud
               message="Desfazer"
               isVisible={mostrarNotificacao}
               onClose={fechandoNotificacao}
               onUndo={desfazendoDelete}
               duration={5000}
               />
               <ModalCofirmacao
               isOpen={modalConfirmacaoAberto}
               onClose={() => setModalConfirmacaoAberto(false)}
               onConfirm={deletarUsuario}
               message="Você realmente deseja remover este usuário?"
               /> 
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
