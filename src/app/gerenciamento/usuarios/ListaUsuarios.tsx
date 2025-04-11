"use client";

import CardUsuario from "@/components/CardUsuario";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import ModalCofirmacao from "@/components/ComponentesCrud/ModalConfirmacao";
import ModelUsuarioListagem from "@/models/ModelUsuarioListagem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletarUsuario, restaurarUsuario } from "./actions";
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
interface ListaUsuariosProps {
   usuarios: ModelUsuarioListagem[] | undefined;
   peageableinfo: {
      totalPaginas: number;
      ultima: boolean;
      maximoPaginasVisiveis: number;
   };
   numeroPaginaAtual: number;
   token: string;
}

export default function ListaUsuarios({ usuarios, peageableinfo, numeroPaginaAtual, token }: ListaUsuariosProps) {
   const router = useRouter();
   
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

   const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);

   const fechandoNotificacao = () => {
    setMostrarNotificacao(false);
    setItemDeletadoId(null);
 };
 const desfazendoDelete = async () => {
    await useFetchComAutorizacaoComToken(`${BASE_URL}/usuarios/restaurar/${itemDeletadoId}`, {
       method: "POST",
    }, token);
    router.refresh();
 };

   const mudarPagina = (pagina: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("numeroPaginaAtual", pagina.toString());
      router.push(`/gerenciamento/usuarios?${params.toString()}`);
   };
   const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(null);
   const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);

   const exibirModal = (id: number) => {
    setIdItemParaDeletar(id);
    setModalConfirmacaoAberto(true);
 };
 const fecharModal = () => {
    setModalConfirmacaoAberto(false);
    setIdItemParaDeletar(null);
 };
 const confirmarDelecao = async () => {
    if (idItemParaDeletar) {
       await useFetchComAutorizacaoComToken(`${BASE_URL}/usuarios/${idItemParaDeletar}`, {
          method: "DELETE",
       }, token);
       setItemDeletadoId(idItemParaDeletar)
       setMostrarNotificacao(true)
       fecharModal();
       router.refresh(); 
    }
 };

   return (
      <div>
         <div className="grid grid-cols-1 gap-4 w-full md:mt-2 lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4 2xl:mt-6">
            {usuarios?.map((usuario) => (
               <CardUsuario
               labelPrimeiroValor="E-mail:"
               primeiroValor={usuario.email}
               labelSegundoValor="Nome:"
               segundoValor={usuario.nome}
               labelTerceiroValor="Status:"
               terceiroValor={usuario.ativo ? "Ativo" : "Desativado"}
               labelQuartoValor="Tipo usuario:"
               quartoValor={usuario.role}
               key={usuario.id}
               id={usuario.id}
               imagem={usuario.foto}
               deletarUsuario={exibirModal}
               linkEdicao={`/gerenciamento/usuarios/edicao/${usuario.id}`}
            />
            ))}
         </div>
         {usuarios?.length === 0 && (
            <div className="text-center w-full col-span-2">Nenhum usuário encontrado...</div>
         )}
         {peageableinfo.totalPaginas > 0 && (
            <ComponentePaginacao
               paginaAtual={numeroPaginaAtual}
               setPaginaAtual={mudarPagina}
               totalPaginas={peageableinfo.totalPaginas}
               maximoPaginasVisiveis={peageableinfo.maximoPaginasVisiveis}
               ultimaPagina={peageableinfo.ultima}
            />
         )}
          <ModalCofirmacao
            isOpen={modalConfirmacaoAberto}
            onClose={fecharModal}
            onConfirm={confirmarDelecao}
            message="Você realmente deseja remover este usuário?"
         />
          <NotificacaoCrud
                                          message="Desfazer"
                                          isVisible={mostrarNotificacao}
                                          onClose={fechandoNotificacao}
                                          onUndo={desfazendoDelete}
                                          duration={5000}
                                       />
      </div>
   );
}