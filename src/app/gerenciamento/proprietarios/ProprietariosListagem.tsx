"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CardUsuario from "@/components/CardUsuario";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import ModalCofirmacao from "@/components/ComponentesCrud/ModalConfirmacao";
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import List from "@/components/List";
import SelectPadrao from "@/components/SelectPadrao";
import { UseFetchDelete } from "@/hooks/UseFetchDelete";
import ModelProprietarioListagem from "@/models/ModelProprietarioListagem";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
import { useLanguage } from "@/context/LanguageContext";

interface ProprietariosListagemProps {
   proprietariosIniciais: ModelProprietarioListagem[] | [];
   totalPaginas: number;
   ultimaPagina: boolean;
   paginaAtual: number;
   nomePesquisa: string;
   status: string;
   token: string;
}

const ProprietariosListagem = ({
   proprietariosIniciais,
   totalPaginas,
   ultimaPagina,
   paginaAtual,
   nomePesquisa,
   status,
   token,
}: ProprietariosListagemProps) => {
   
   const { t } = useLanguage();
   const [proprietarios, setProprietarios] = useState(proprietariosIniciais);
   const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
   const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
   const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(
      null
   );
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
   const [nomePesquisaTemporario, setNomePesquisaTemporario] =
      useState<string>(nomePesquisa);

   const router = useRouter();
   const searchParams = useSearchParams();

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   const deletarUsuario = async () => {
      const response = await UseFetchDelete(
         `${BASE_URL}/proprietarios/${idItemParaDeletar}`,
         token
      );
      setItemDeletadoId(idItemParaDeletar);
      setMostrarNotificacao(true);
      setIdItemParaDeletar(null);
      router.refresh();
   };

   const fechandoNotificacao = () => {
      setMostrarNotificacao(false);
      setItemDeletadoId(null);
   };

   const desfazendoDelete = async () => {
      await useFetchComAutorizacaoComToken(`${BASE_URL}/proprietarios/restaurar/${itemDeletadoId}`, {
         method: "POST",
      }, token);
      router.refresh();
   };
   const restaurarUsuario = async (id: number) => {
      await useFetchComAutorizacaoComToken(`${BASE_URL}/proprietarios/restaurar/${id}`, {
         method: "POST",
      }, token);
      router.refresh();
   };

   const exibirModal = (id: number) => {
      setIdItemParaDeletar(id);
      setModalConfirmacaoAberto(true);
   };

   const atualizarFiltros = (novoNome: string, novoStatus: string) => {
      const params = new URLSearchParams(searchParams);

      params.set("nome", novoNome);
      params.set("status", novoStatus);
      params.set("pagina", "0"); // Resetar para a primeira página ao mudar o filtro
      router.replace(`?${params.toString()}`); // Substituir a URL atual
   };
   const handlePesquisa = () => {
      atualizarFiltros(nomePesquisaTemporario, status); // Atualiza a URL com o valor temporário
   };
   useEffect(() => {
      setProprietarios(proprietariosIniciais);
   }, [proprietariosIniciais]);

   return (          
      <>
         <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_10fr_1fr] xl:grid-cols-[1fr_10fr_1fr]">
            <List
               mudandoValor={(valor) => atualizarFiltros(nomePesquisa, valor)}
               opcoes={[
                  { id: "Ativo", label: t("OwnerManagement.buttonActive") },
                  { id: "Desativado", label: t("OwnerManagement.buttonDesactive") },   
               ]}
               placeholder={t("OwnerManagement.buttonActive")}
               value={status}
            />
            <InputPadrao
               type="text"
               htmlFor="input-busca-nome"
               onChange={(e) => setNomePesquisaTemporario(e.target.value)}
               placeholder={t("OwnerManagement.placeholderSearch")}
               search
               handlePesquisa={handlePesquisa}
               required={false}
            />
            <Link href={"/gerenciamento/proprietarios/cadastro"}>
               <button className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full text-sm py-1 px-2 lg:text-base lg:py-2 lg:px-3 2xl:py-3 2xl:px-4">
               {t("OwnerManagement.buttonAddOwner")} <PlusIcon className="w-4" />
               </button>
            </Link>
         </div>
         <div className="grid grid-cols-1 gap-4 w-full md:mt-2 lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4 2xl:mt-6">
            {proprietarios.map((proprietario) => (
               <CardUsuario
                  ativo={proprietario.ativo}
                  restaurarUsuario={() => restaurarUsuario(proprietario.id)}
                  labelPrimeiroValor="E-mail:"
                  primeiroValor={proprietario.email}
                  labelSegundoValor={t("perfil.name") + ":"}
                  segundoValor={proprietario.nome}
                  labelTerceiroValor={t("perfil.phone")}
                  terceiroValor={proprietario.telefone}
                  labelQuartoValor="CPF:"
                  quartoValor={proprietario.cpf}
                  key={proprietario.id}
                  id={proprietario.id}
                  imagem={proprietario.imagemUrl}
                  deletarUsuario={exibirModal}
                  linkEdicao={`/gerenciamento/proprietarios/edicao/${proprietario.id}`}
               />
            ))}
         </div>
         {totalPaginas > 0 && (
            <ComponentePaginacao
               paginaAtual={paginaAtual}
               setPaginaAtual={(pagina) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("pagina", pagina.toString());
                  router.push(`?${params.toString()}`);
               }}
               totalPaginas={totalPaginas}
               maximoPaginasVisiveis={5}
               ultimaPagina={ultimaPagina}
            />
         )}
         <ModalCofirmacao
            isOpen={modalConfirmacaoAberto}
            onClose={() => setModalConfirmacaoAberto(false)}
            onConfirm={deletarUsuario}
            message="Você realmente deseja desativar este proprietario?"
         />
         <NotificacaoCrud
            message="Desfazer"
            isVisible={mostrarNotificacao}
            onClose={fechandoNotificacao}
            onUndo={desfazendoDelete}
            duration={5000}
         />
      </>
   );
};

export default ProprietariosListagem;
