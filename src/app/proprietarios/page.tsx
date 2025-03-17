import { buscarProprietarios } from "@/Functions/proprietario/buscaProprietario";
import ModelProprietarioListagem from "@/models/ModelProprietarioListagem";
import ProprietariosListagem from "./ProprietariosListagem";

interface PageProps {
  searchParams: Promise<{
    pagina?: string;
    nome?: string;
    status?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {

   const parametros = await searchParams

  const paginaAtual = parseInt(parametros.pagina || "0");
  const nomePesquisa = parametros.nome || "";
  const status = parametros.status || "Ativo";

  console.log(status)

  const { conteudoCompleto, proprietariosRenderizados } = await buscarProprietarios(
    paginaAtual,
    nomePesquisa,
    status === "Ativo"
  );

  return (
    <ProprietariosListagem
      proprietariosIniciais={proprietariosRenderizados || []}
      totalPaginas={conteudoCompleto.totalPages}
      ultimaPagina={conteudoCompleto.last}
      paginaAtual={paginaAtual}
      nomePesquisa={nomePesquisa}
      status={status}
    />
  );
}