"use client";

import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { buscarTodosImoveis } from "@/Functions/imovel/buscaImovel";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { listarUsuarios } from "@/Functions/usuario/buscaUsuario";
import ModelUsuarioListagem from "@/models/ModelUsuarioListagem";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import Image from "next/image";
import { renderizarUsuariosApi } from "@/app/sobre-nos/action";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
   interface jsPDF {
      autoTable: typeof autoTable;
      lastAutoTable: { finalY: number };
   }
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Page = () => {
   const { showNotification } = useNotification();
   const [imoveis, setImoveis] = useState<ModelImovelGet[]>([]);
   const [usuariosAtivos, setUsuariosAtivos] = useState<ModelUsuarioListagem[]>(
      []
   );
   const [usuariosBloqueados, setUsuariosBloqueados] = useState<
      ModelUsuarioListagem[]
   >([]);
   const [corretores, setCorretores] = useState<ModelExibirCorretor[]>([]);
   const [agendamentosPorCorretor, setAgendamentosPorCorretor] = useState<{
      [key: string]: number;
   }>({});
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [
               resultImoveis,
               resultUsuariosAtivos,
               resultUsuariosBloqueados,
               resultCorretores,
            ] = await Promise.all([
               buscarTodosImoveis(),
               listarUsuarios(0, "CORRETOR", true, "", 1000), // Usuários ativos
               listarUsuarios(0, "CORRETOR", false, "", 1000), // Usuários bloqueados
               renderizarUsuariosApi(),
            ]);

            setImoveis(resultImoveis.imoveis);
            setUsuariosAtivos(resultUsuariosAtivos.usuariosRenderizados || []);
            setUsuariosBloqueados(
               resultUsuariosBloqueados.usuariosRenderizados || []
            );
            setCorretores(resultCorretores || []);

            // Buscar agendamentos para cada corretor
            const agendamentos: { [key: string]: number } = {};
            for (const corretor of resultUsuariosAtivos.usuariosRenderizados ||
               []) {
               try {
                  console.log(
                     `Buscando agendamentos para o corretor: ${corretor.nome} (ID: ${corretor.id})`
                  );
                  const response = await fetch(
                     `${process.env.NEXT_PUBLIC_BASE_URL}/agendamento/corretor/${corretor.id}`
                  );

                  if (response.ok) {
                     const data = await response.json();
                     console.log(
                        `Resposta da API para ${corretor.nome}:`,
                        data
                     );

                     // Verifica se data é um objeto com uma propriedade que contém o array
                     const agendamentosArray = Array.isArray(data)
                        ? data
                        : data.agendamentos || data.data || data.content || [];

                     console.log(
                        `Array de agendamentos para ${corretor.nome}:`,
                        agendamentosArray
                     );

                     // Filtra apenas agendamentos confirmados
                     const agendamentosConfirmados = agendamentosArray.filter(
                        (agendamento: any) =>
                           agendamento.status === "CONFIRMADO"
                     ).length;

                     console.log(
                        `Agendamentos confirmados para ${corretor.nome}:`,
                        agendamentosConfirmados
                     );
                     agendamentos[corretor.nome] = agendamentosConfirmados;
                  } else {
                     console.error(
                        `Erro ao buscar agendamentos para o corretor ${corretor.nome}:`,
                        response.status,
                        response.statusText
                     );
                     agendamentos[corretor.nome] = 0;
                  }
               } catch (error) {
                  console.error(
                     `Erro ao buscar agendamentos para o corretor ${corretor.nome}:`,
                     error
                  );
                  agendamentos[corretor.nome] = 0;
               }
            }

            console.log("Objeto final de agendamentos:", agendamentos);
            setAgendamentosPorCorretor(agendamentos);
         } catch (error) {
            console.error("Erro ao buscar dados:", error);
            showNotification("Erro ao carregar os dados");
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [showNotification]);

   // Função para formatar valor monetário
   const formatarPreco = (valor: number) => {
      return valor.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL",
      });
   };

   // Função para calcular a média de preços
   const calcularMediaPrecos = (imoveisList: ModelImovelGet[]) => {
      if (imoveisList.length === 0) return 0;
      const soma = imoveisList.reduce((acc, imovel) => {
         // Usa o preço promocional se existir, senão usa o preço normal
         const precoFinal = imovel.precoPromocional || imovel.preco;
         return acc + precoFinal;
      }, 0);
      return soma / imoveisList.length;
   };

   // Função para calcular a cor baseada no preço
   const calcularCorPorPreco = (preco: number, precoMaximo: number) => {
      // Calcula a intensidade da cor (0 a 1)
      const intensidade = preco / precoMaximo;
      // Converte para valores RGB mantendo o tom vermelho do havprincipal (#7a2638)
      const r = Math.round(122 + (255 - 122) * (1 - intensidade)); // 122 é o valor R de #7a2638
      const g = Math.round(38 + (255 - 38) * (1 - intensidade)); // 38 é o valor G de #7a2638
      const b = Math.round(56 + (255 - 56) * (1 - intensidade)); // 56 é o valor B de #7a2638
      return `rgb(${r}, ${g}, ${b})`;
   };

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
   const imoveisVenda = imoveis.filter((imovel) => {
      console.log("Verificando imóvel:", {
         titulo: imovel.titulo,
         finalidade: imovel.finalidade,
         preco: imovel.preco,
      });
      return imovel.finalidade?.toUpperCase() === "VENDA";
   });
   const imoveisAluguel = imoveis.filter(
      (imovel) => imovel.finalidade?.toUpperCase() === "ALUGUEL"
   );

   console.log("Todos os imóveis:", imoveis);
   console.log("Imóveis para venda:", imoveisVenda);
   console.log("Imóveis para aluguel:", imoveisAluguel);
   console.log("Finalidades únicas:", [
      ...new Set(imoveis.map((imovel) => imovel.finalidade)),
   ]);

   // Dados para o gráfico de distribuição de imóveis
   const quantidadeMaxima = Math.max(
      imoveisComuns.length,
      bannerDesconto.length,
      bannerMelhorPreco.length,
      bannerPromocao.length,
      bannerAdquirido.length,
      bannerAlugado.length
   );

   const dadosDistribuicao = {
      labels: [
         "Comuns",
         "Desconto",
         "Melhor Preço",
         "Promoção",
         "Adquirido",
         "Alugado",
      ],
      datasets: [
         {
            data: [
               imoveisComuns.length,
               bannerDesconto.length,
               bannerMelhorPreco.length,
               bannerPromocao.length,
               bannerAdquirido.length,
               bannerAlugado.length,
            ],
            backgroundColor: [
               calcularCorPorPreco(imoveisComuns.length, quantidadeMaxima),
               calcularCorPorPreco(bannerDesconto.length, quantidadeMaxima),
               calcularCorPorPreco(bannerMelhorPreco.length, quantidadeMaxima),
               calcularCorPorPreco(bannerPromocao.length, quantidadeMaxima),
               calcularCorPorPreco(bannerAdquirido.length, quantidadeMaxima),
               calcularCorPorPreco(bannerAlugado.length, quantidadeMaxima),
            ],
            borderWidth: 1,
            borderColor: "#fff",
         },
      ],
   };

   // Dados para o gráfico de preços de venda
   const precoMaximoVenda = Math.max(
      ...imoveisVenda.map(
         (imovel) => imovel.precoPromocional || imovel.preco || 0
      )
   );
   const dadosPrecosVenda = {
      labels: imoveisVenda.map((imovel) => imovel.titulo),
      datasets: [
         {
            data: imoveisVenda.map((imovel) => {
               const preco = imovel.precoPromocional || imovel.preco || 0;
               console.log(`Preço do imóvel "${imovel.titulo}":`, {
                  precoOriginal: imovel.preco,
                  precoPromocional: imovel.precoPromocional,
                  precoUsado: preco,
                  precoFormatado: formatarPreco(preco),
               });
               return preco === 0 ? 1 : preco;
            }),
            backgroundColor: imoveisVenda.map((imovel) =>
               calcularCorPorPreco(
                  imovel.precoPromocional || imovel.preco || 0,
                  precoMaximoVenda
               )
            ),
            borderWidth: 1,
            borderColor: "#fff",
         },
      ],
   };

   console.log("Dados do gráfico de venda:", dadosPrecosVenda);

   // Dados para o gráfico de preços de aluguel
   const precoMaximoAluguel = Math.max(
      ...imoveisAluguel.map(
         (imovel) => imovel.precoPromocional || imovel.preco || 0
      )
   );
   const dadosPrecosAluguel = {
      labels: imoveisAluguel.map((imovel) => imovel.titulo),
      datasets: [
         {
            data: imoveisAluguel.map(
               (imovel) => imovel.precoPromocional || imovel.preco || 0
            ),
            backgroundColor: imoveisAluguel.map((imovel) =>
               calcularCorPorPreco(
                  imovel.precoPromocional || imovel.preco || 0,
                  precoMaximoAluguel
               )
            ),
            borderWidth: 1,
            borderColor: "#fff",
         },
      ],
   };

   const opcoes = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
         legend: {
            display: true,
            position: "bottom" as const,
            labels: {
               font: {
                  size: 12,
               },
               boxWidth: 15,
               padding: 10,
            },
         },
         tooltip: {
            callbacks: {
               label: function (context: any) {
                  const valor = context.raw === 1 ? 0 : context.raw;
                  return formatarPreco(valor);
               },
            },
         },
      },
      animation: {
         animateRotate: true,
         animateScale: true,
      },
      cutout: "0%",
   };

   const opcoesDistribuicao = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
         legend: {
            position: "bottom" as const,
            labels: {
               font: {
                  size: 12,
               },
               boxWidth: 15,
               padding: 10,
            },
         },
      },
      animation: {
         animateRotate: true,
         animateScale: true,
      },
   };

   const exportarPDF = () => {
      const doc = new jsPDF("p", "pt");
      let yPos = 15;
      const margin = 15;
      const titleGap = 10;
      const tableGap = 20;

      // Configuração inicial
      doc.setFont("helvetica");
      doc.setFontSize(20);
      doc.text("Relatório Imobiliária", 105, yPos, { align: "center" });
      yPos += titleGap * 2;

      // Seção de Imóveis
      doc.setFontSize(16);
      doc.text("Distribuição de Imóveis", margin, yPos);
      yPos += titleGap;

      // Tabela de distribuição de imóveis
      const dadosDistribuicaoTabela = [
         ["Categoria", "Quantidade"],
         ["Imóveis Comuns", imoveisComuns.length],
         ["Banner Desconto", bannerDesconto.length],
         ["Banner Melhor Preço", bannerMelhorPreco.length],
         ["Banner Promoção", bannerPromocao.length],
         ["Banner Adquirido", bannerAdquirido.length],
         ["Banner Alugado", bannerAlugado.length],
      ];

      autoTable(doc, {
         startY: yPos,
         head: [["Categoria", "Quantidade"]],
         body: dadosDistribuicaoTabela.slice(1),
      });
      yPos = (doc as any).lastAutoTable.finalY + tableGap;

      // Preços médios
      doc.text("Preços Médios", margin, yPos);
      yPos += titleGap;

      const dadosPrecos = [
         ["Categoria", "Valor Médio"],
         ["Venda", formatarPreco(calcularMediaPrecos(imoveisVenda))],
         ["Aluguel", formatarPreco(calcularMediaPrecos(imoveisAluguel))],
      ];

      autoTable(doc, {
         startY: yPos,
         head: [["Categoria", "Valor Médio"]],
         body: dadosPrecos.slice(1),
      });
      yPos = (doc as any).lastAutoTable.finalY + tableGap;

      // Seção de Usuários
      doc.text("Usuários", margin, yPos);
      yPos += titleGap;

      const dadosUsuarios = [
         ["Categoria", "Quantidade"],
         ["Usuários Ativos", usuariosAtivos.length],
         ["Usuários Bloqueados", usuariosBloqueados.length],
         [
            "Total de Usuários",
            usuariosAtivos.length + usuariosBloqueados.length,
         ],
      ];

      autoTable(doc, {
         startY: yPos,
         head: [["Categoria", "Quantidade"]],
         body: dadosUsuarios.slice(1),
      });
      yPos = (doc as any).lastAutoTable.finalY + tableGap;

      // Seção de Corretores
      doc.text("Corretores e Agendamentos", margin, yPos);
      yPos += titleGap;

      const dadosCorretores = usuariosAtivos.map((corretor) => [
         corretor.nome,
         agendamentosPorCorretor[corretor.nome] || 0,
      ]);

      autoTable(doc, {
         startY: yPos,
         head: [["Nome do Corretor", "Quantidade de Agendamentos"]],
         body: dadosCorretores,
      });

      // Salvar o PDF
      doc.save("relatorio-imobiliaria.pdf");
   };

   const exportarExcel = () => {
      // Criar planilhas separadas para cada seção
      const wb = XLSX.utils.book_new();

      // Planilha de Distribuição de Imóveis
      const distribuicaoData = [
         ["Categoria", "Quantidade"],
         ["Imóveis Comuns", imoveisComuns.length],
         ["Banner Desconto", bannerDesconto.length],
         ["Banner Melhor Preço", bannerMelhorPreco.length],
         ["Banner Promoção", bannerPromocao.length],
         ["Banner Adquirido", bannerAdquirido.length],
         ["Banner Alugado", bannerAlugado.length],
      ];
      const wsDistribuicao = XLSX.utils.aoa_to_sheet(distribuicaoData);
      XLSX.utils.book_append_sheet(
         wb,
         wsDistribuicao,
         "Distribuição de Imóveis"
      );

      // Planilha de Preços Médios
      const precosData = [
         ["Categoria", "Valor Médio"],
         ["Venda", formatarPreco(calcularMediaPrecos(imoveisVenda))],
         ["Aluguel", formatarPreco(calcularMediaPrecos(imoveisAluguel))],
      ];
      const wsPrecos = XLSX.utils.aoa_to_sheet(precosData);
      XLSX.utils.book_append_sheet(wb, wsPrecos, "Preços Médios");

      // Planilha de Usuários
      const usuariosData = [
         ["Categoria", "Quantidade"],
         ["Usuários Ativos", usuariosAtivos.length],
         ["Usuários Bloqueados", usuariosBloqueados.length],
         [
            "Total de Usuários",
            usuariosAtivos.length + usuariosBloqueados.length,
         ],
      ];
      const wsUsuarios = XLSX.utils.aoa_to_sheet(usuariosData);
      XLSX.utils.book_append_sheet(wb, wsUsuarios, "Usuários");

      // Planilha de Corretores e Agendamentos
      const corretoresData = [
         ["Nome do Corretor", "Quantidade de Agendamentos"],
         ...usuariosAtivos.map((corretor) => [
            corretor.nome,
            agendamentosPorCorretor[corretor.nome] || 0,
         ]),
      ];
      const wsCorretores = XLSX.utils.aoa_to_sheet(corretoresData);
      XLSX.utils.book_append_sheet(wb, wsCorretores, "Corretores");

      // Salvar o arquivo
      XLSX.writeFile(wb, "relatorio-imobiliaria.xlsx");
   };

   if (loading) {
      return (
         <Layout className="py-0">
            <SubLayoutPaginasCRUD>
               <FundoBrancoPadrao className="w-full" titulo="Relatório">
                  <div className="flex items-center justify-center w-full h-64">
                     <p className="text-havprincipal">Carregando...</p>
                  </div>
               </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
         </Layout>
      );
   }

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Relatório">
               <div className="flex flex-col w-full max-w-[90rem] mx-auto">
                  <h2 className="text-havprincipal text-2xl font-bold mb-4 text-center">
                     Imóveis
                  </h2>
                  {/* Container dos gráficos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                     {/* Gráfico de Distribuição de Imóveis */}
                     <div className="bg-white p-6 rounded-lg shadow w-full flex flex-col">
                        <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
                           Distribuição de Imóveis
                        </h2>
                        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                           <div className="w-full aspect-square max-w-[260px] mx-auto">
                              <Pie
                                 data={dadosDistribuicao}
                                 options={opcoesDistribuicao}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Gráfico de Preços de Venda */}
                     <div className="bg-white p-6 rounded-lg shadow w-full flex flex-col">
                        <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
                           Preços de Venda
                        </h2>
                        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                           <div className="w-full aspect-square max-w-[260px] mx-auto">
                              <Pie data={dadosPrecosVenda} options={opcoes} />
                           </div>
                        </div>
                     </div>

                     {/* Gráfico de Preços de Aluguel */}
                     <div className="bg-white p-6 rounded-lg shadow w-full flex flex-col">
                        <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
                           Preços de Aluguel
                        </h2>
                        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                           <div className="w-full aspect-square max-w-[220px] mx-auto" >
                              <Pie data={dadosPrecosAluguel} options={opcoes} />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Valores Médios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full mb-8">
                     {/* Valor Médio Venda */}
                     <div className="bg-white p-6 rounded-lg shadow text-center">
                        <h2 className="text-lg font-semibold text-havprincipal mb-2">
                           Valor Médio dos Imóveis para Venda
                        </h2>
                        <p className="text-3xl font-bold text-havprincipal">
                           {formatarPreco(calcularMediaPrecos(imoveisVenda))}
                        </p>
                     </div>

                     {/* Valor Médio Aluguel */}
                     <div className="bg-white p-6 rounded-lg shadow text-center">
                        <h2 className="text-lg font-semibold text-havprincipal mb-2">
                           Valor Médio dos Imóveis para Aluguel
                        </h2>
                        <p className="text-3xl font-bold text-havprincipal">
                           {formatarPreco(calcularMediaPrecos(imoveisAluguel))}
                        </p>
                     </div>
                  </div>

                  {/* Relatório de Usuários */}
                  <h2 className="text-havprincipal text-2xl font-bold mb-4 text-center mt-8">
                     Usuários
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                     {/* Usuários Ativos */}
                     <div className="bg-white p-6 rounded-lg shadow w-full">
                        <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
                           Usuários Ativos
                        </h2>
                        <div className="flex flex-col items-center">
                           <p className="text-5xl font-bold text-havprincipal mb-2">
                              {usuariosAtivos.length}
                           </p>
                           <p className="text-gray-600">
                              {usuariosAtivos.length === 1
                                 ? "usuário ativo"
                                 : "usuários ativos"}
                           </p>
                        </div>
                     </div>

                     {/* Usuários Bloqueados */}
                     <div className="bg-white p-6 rounded-lg shadow w-full">
                        <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
                           Usuários Bloqueados
                        </h2>
                        <div className="flex flex-col items-center">
                           <p className="text-5xl font-bold text-havprincipal mb-2">
                              {usuariosBloqueados.length}
                           </p>
                           <p className="text-gray-600">
                              {usuariosBloqueados.length === 1
                                 ? "usuário bloqueado"
                                 : "usuários bloqueados"}
                           </p>
                        </div>
                     </div>

                     {/* Total de Usuários */}
                     <div className="bg-white p-6 rounded-lg shadow w-full">
                        <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
                           Total de Usuários
                        </h2>
                        <div className="flex flex-col items-center">
                           <p className="text-5xl font-bold text-havprincipal mb-2">
                              {usuariosAtivos.length +
                                 usuariosBloqueados.length}
                           </p>
                           <p className="text-gray-600">
                              {usuariosAtivos.length +
                                 usuariosBloqueados.length ===
                              1
                                 ? "usuário cadastrado"
                                 : "usuários cadastrados"}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Lista de Corretores */}
                  <h2 className="text-havprincipal text-2xl font-bold mb-4 text-center mt-8">
                     Corretores
                  </h2>
                  <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl mx-auto">
                     {usuariosAtivos.map((corretor, index) => (
                        <div
                           key={index}
                           className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                        >
                           <div className="px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 md:gap-6">
                              <div className="flex items-center gap-3 md:gap-4">
                                 {corretor.foto ? (
                                    <Image
                                       src={corretor.foto}
                                       alt={`Foto de ${corretor.nome}`}
                                       width={40}
                                       height={40}
                                       className="rounded-full object-cover md:w-14 md:h-14"
                                    />
                                 ) : (
                                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-200 rounded-full flex items-center justify-center">
                                       <svg
                                          className="w-6 h-6 md:w-8 md:h-8 text-gray-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                          />
                                       </svg>
                                    </div>
                                 )}
                                 <span className="text-gray-700 text-base md:text-lg">
                                    {corretor.nome}
                                 </span>
                              </div>
                              <div className="flex-1 text-right">
                                 <span className="text-gray-700 text-base md:text-lg">
                                    Agendamentos:{" "}
                                    {agendamentosPorCorretor[corretor.nome] ||
                                       0}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               {/* Botões de Exportar */}
               <div className="flex justify-center gap-4 mt-8">
                  <button
                     onClick={exportarPDF}
                     className="bg-havprincipal text-white px-6 py-2 rounded-md hover:bg-havprincipal/90 transition-colors flex items-center gap-2"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                     </svg>
                     Exportar PDF
                  </button>
                  <button
                     onClick={exportarExcel}
                     className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                     </svg>
                     Exportar Excel
                  </button>
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
