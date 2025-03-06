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
import SelectPadrao from "@/components/SelectPadrao";
import ComponentePaginacao from "@/components/ComponentePaginacao";

const page = () => {
   const opcoesStatus = ["Ativo", "Desativado"];
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const [status, setStatus] = useState<string>("Ativo");
   const [tipoUsuario, setTipoUsuario] = useState<string>("USUARIO");
   const [usuarios, setUsuarios] = useState<ModelUsuario[]>();
   const [revalidarQuery, setRevalidarQuery] = useState<boolean>(false);
   const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
   const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
   const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(
      null
   );
   const [numeroPaginaAtual, setNumeroPaginaAtual] = useState(0);
   const [nomePesquisa, setNomePesquisa] = useState<string>("");
   const [peageableinfo, setPeageableInfo] = useState({
      totalPaginas: 0,
      ultima: true,
      maximoPaginasVisiveis: 5,
   });

   useEffect(() => {
      renderizarUsuariosApi();
   }, [revalidarQuery]);

   const fechandoNotificacao = () => {
      setMostrarNotificacao(false);
      setItemDeletadoId(null);
   };
   const adicionarInformacoesPagina = (data: any) => {
      const quantidadePaginas = data.totalPages;
      const ultimaPagina: boolean = data.last;

      setPeageableInfo((prev) => ({
         ...prev,
         totalPaginas: quantidadePaginas,
         ultima: ultimaPagina,
      }));
   };
   const desfazendoDelete = async () => {
      await fetch(`${BASE_URL}/usuarios/restaurar/${itemDeletadoId}`, {
         method: "POST",
      });
      setRevalidarQuery(!revalidarQuery);
   };
   const setRevalidandoQuery =
      (funcao: (valor: any) => any) => (valor: any) => {
         funcao(valor);
         setRevalidarQuery(!revalidarQuery);
      };

   const renderizarUsuariosApi = async () => {
      const response = await fetch(
         `${BASE_URL}/usuarios?role=${tipoUsuario}&ativo=${
            status === "Ativo" ? true : false
         }&nome=${nomePesquisa}&page=${numeroPaginaAtual}  `
      );

      const data = await response.json();

      adicionarInformacoesPagina(data);
      setUsuarios(transformarParaModel(data));
   };
   const deletarUsuario = async () => {
      const response = await UseFetchDelete(
         `${BASE_URL}/usuarios/${idItemParaDeletar}`
      );
      setItemDeletadoId(idItemParaDeletar);
      setMostrarNotificacao(true);
      setRevalidarQuery(!revalidarQuery);
      setIdItemParaDeletar(null);
   };
   const exibirModal = (id: number) => {
      setIdItemParaDeletar(id);
      setModalConfirmacaoAberto(true);
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

   const tiposDeUsuarios = ["USUARIO", "ADMINISTRADOR", "EDITOR", "CORRETOR"];

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
                  <SelectPadrao
                     onChange={setRevalidandoQuery(setStatus)}
                     opcoes={opcoesStatus}
                     selecionado={status}
                     placeholder="Ativo"
                  />
                  <InputPadrao
                     tipoInput="text"
                     htmlFor="input-busca-nome"
                     onChange={setRevalidandoQuery(setNomePesquisa)}
                     placeholder="Digite o nome que deseja pesquisar"
                     required={false}
                  />
                  <SelectPadrao
                     opcoes={tiposDeUsuarios}
                     onChange={setRevalidandoQuery(setTipoUsuario)}
                     placeholder="USUARIO"
                     selecionado={tipoUsuario}
                  />
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
               {usuarios?.length === 0 && (
                  <div className="text-center w-full col-span-2">
                     Nenhum usuário encontrado...
                  </div>
               )}
               {peageableinfo.totalPaginas > 0 && (
                  <ComponentePaginacao
                     paginaAtual={numeroPaginaAtual}
                     setPaginaAtual={setRevalidandoQuery(setNumeroPaginaAtual)}
                     totalPaginas={peageableinfo.totalPaginas}
                     maximoPaginasVisiveis={peageableinfo.maximoPaginasVisiveis}
                     ultimaPagina={peageableinfo.ultima}
                  />
               )}

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
