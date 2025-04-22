import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import { listarUsuarios } from "@/Functions/usuario/buscaUsuario";
import { renderizarUsuariosApi } from "@/app/sobre-nos/action";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import ModelUsuarioListagem from "@/models/ModelUsuarioListagem";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";

export async function fetchRelatorioData(token: string) {
  try {
    const [
      resultImoveis,
      resultUsuariosAtivos,
      resultUsuariosBloqueados,
      resultCorretores,
    ] = await Promise.all([
      buscarTodosImoveis(),
      listarUsuarios(0,  "",true, "", 1000), // Usuários ativos
      listarUsuarios(0, "", false, "", 1000), // Usuários bloqueados
      listarUsuarios(0,  "CORRETOR", true, "", 1000), // Usuários ativos
    ]);

    console.log("resultCorretores", resultCorretores);
    // Buscar agendamentos para cada corretor
    const agendamentos: { [key: string]: number } = {};
    for (const corretor of resultCorretores.usuariosRenderizados || []) {
      try {
        const response = await useFetchComAutorizacaoComToken(
          `${process.env.NEXT_PUBLIC_BASE_URL}/agendamentos/corretor/${corretor.id}?status=&data=&page=0&size=1000&sort=dataHora,desc`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          },
          token
        );

        if (response.ok) {
          const data = await response.json();
          // Usar o totalElements da resposta paginada
          agendamentos[corretor.nome] = data.totalElements || 0;
        } else {
          console.log("Erro ao buscar agendamentos para", await response.json());
          agendamentos[corretor.nome] = 0;
        }
      } catch (error) {
        console.error(`Erro ao buscar agendamentos para ${corretor.nome}:`, error);
        agendamentos[corretor.nome] = 0;
      }
    }

    return {
      imoveis: resultImoveis.imoveis,
      usuariosAtivos: resultUsuariosAtivos.usuariosRenderizados || [],
      usuariosBloqueados: resultUsuariosBloqueados.usuariosRenderizados || [],
      corretores: resultCorretores.usuariosRenderizados || [],
      agendamentosPorCorretor: agendamentos
    };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw new Error("Erro ao carregar os dados");
  }
}

export function prepararDadosParaGraficos(imoveis: ModelImovelGet[]) {
  // Separar imóveis por categoria
  const imoveisComuns = imoveis.filter(
    (imovel) => !imovel.destaque && !imovel.banner
  );
  const bannerDesconto = imoveis.filter(
    (imovel) => imovel.banner && imovel.tipoBanner === "DESCONTO"
  );
  const bannerMelhorPreco = imoveis.filter(
    (imovel) => imovel.banner && imovel.tipoBanner === "MELHOR_PRECO"
  );
  const bannerPromocao = imoveis.filter(
    (imovel) => imovel.banner && imovel.tipoBanner === "PROMOCAO"
  );
  const bannerAdquirido = imoveis.filter(
    (imovel) => imovel.banner && imovel.tipoBanner === "ADQUIRIDO"
  );
  const bannerAlugado = imoveis.filter(
    (imovel) => imovel.banner && imovel.tipoBanner === "ALUGADO"
  );

  // Separar imóveis por finalidade
  const imoveisVenda = imoveis.filter(
    (imovel) => imovel.finalidade?.toUpperCase() === "VENDA"
  );
  const imoveisAluguel = imoveis.filter(
    (imovel) => imovel.finalidade?.toUpperCase() === "ALUGUEL"
  );

  return {
    categorias: {
      imoveisComuns,
      bannerDesconto,
      bannerMelhorPreco,
      bannerPromocao,
      bannerAdquirido,
      bannerAlugado
    },
    finalidades: {
      imoveisVenda,
      imoveisAluguel
    }
  };
} 