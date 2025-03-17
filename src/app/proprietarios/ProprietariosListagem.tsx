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

interface ProprietariosListagemProps {
  proprietariosIniciais: ModelProprietarioListagem[] | [];
  totalPaginas: number;
  ultimaPagina: boolean;
  paginaAtual: number;
  nomePesquisa: string;
  status: string;
}

const ProprietariosListagem = ({
  proprietariosIniciais,
  totalPaginas,
  ultimaPagina,
  paginaAtual,
  nomePesquisa,
  status,
}: ProprietariosListagemProps) => {
  const [proprietarios, setProprietarios] = useState(proprietariosIniciais);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(null);
  const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
  const [nomePesquisaTemporario, setNomePesquisaTemporario] = useState<string>(nomePesquisa)

  const router = useRouter();
  const searchParams = useSearchParams();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



  const deletarUsuario = async () => {
    const response = await UseFetchDelete(`${BASE_URL}/proprietarios/${idItemParaDeletar}`);
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
    await fetch(`${BASE_URL}/proprietarios/restaurar/${itemDeletadoId}`, {
      method: "POST",
    });
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
 },[proprietariosIniciais])



  return (
    <Layout className="py-0">
      <SubLayoutPaginasCRUD>
        <FundoBrancoPadrao titulo="Gerenciamento de proprietarios" className="w-full">
          <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_7fr_1fr] xl:grid-cols-[1fr_7fr_1fr]">
            <List
              mudandoValor={(valor) => atualizarFiltros(nomePesquisa, valor)}
              opcoes={[
                { id: "Ativo", label: "Ativo" },
                { id: "Desativado", label: "Desativado" },
              ]}
              placeholder="Ativo"
              bordaPreta
              value={status}
            />
            <InputPadrao
              type="text"
              htmlFor="input-busca-nome"
              onChange={(e) => setNomePesquisaTemporario(e.target.value)}
              placeholder="Digite o nome que deseja pesquisar"
              search
              handlePesquisa={handlePesquisa}
              required={false}
            />
            <Link href={"/proprietarios/cadastro"}>
              <button className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full text-sm py-1 px-2 lg:text-base lg:py-2 lg:px-3 2xl:py-3 2xl:px-4">
                Adicionar <PlusIcon className="w-4" />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 w-full md:mt-2 lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4 2xl:mt-6">
            {proprietarios.map((proprietario) => (
              <CardUsuario
                labelPrimeiroValor="E-mail:"
                primeiroValor={proprietario.email}
                labelSegundoValor="Nome:"
                segundoValor={proprietario.nome}
                labelTerceiroValor="Telefone"
                terceiroValor={proprietario.telefone}
                labelQuartoValor="CPF:"
                quartoValor={proprietario.cpf}
                key={proprietario.id}
                id={proprietario.id}
                imagem={proprietario.imagemUrl}
                deletarUsuario={exibirModal}
                linkEdicao={`/proprietarios/edicao/${proprietario.id}`}
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
        </FundoBrancoPadrao>
      </SubLayoutPaginasCRUD>
    </Layout>
  );
};

export default ProprietariosListagem;