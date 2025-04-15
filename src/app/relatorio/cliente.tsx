"use client";

import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import ModelUsuarioListagem from "@/models/ModelUsuarioListagem";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNotification } from "@/context/NotificationContext";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
   interface jsPDF {
      autoTable: typeof autoTable;
      lastAutoTable: { finalY: number };
   }
}

ChartJS.register(ArcElement, Tooltip, Legend);

interface RelatorioClientProps {

  initialData: {
    imoveis: ModelImovelGet[];
    usuariosAtivos: ModelUsuarioListagem[];
    usuariosBloqueados: ModelUsuarioListagem[];
    corretores: ModelExibirCorretor[];
    agendamentosPorCorretor: { [key: string]: number };
  };
  graficosData: {
    categorias: {
      imoveisComuns: ModelImovelGet[];
      bannerDesconto: ModelImovelGet[];
      bannerMelhorPreco: ModelImovelGet[];
      bannerPromocao: ModelImovelGet[];
      bannerAdquirido: ModelImovelGet[];
      bannerAlugado: ModelImovelGet[];
    };
    finalidades: {
      imoveisVenda: ModelImovelGet[];
      imoveisAluguel: ModelImovelGet[];
    };
  };
  t: (key: string) => string;
}

export default function RelatorioClient({ initialData, graficosData, t }: RelatorioClientProps) {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

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
      const precoFinal = imovel.precoPromocional || imovel.preco;
      return acc + precoFinal;
    }, 0);
    return soma / imoveisList.length;
  };

  // Função para calcular a cor baseada no preço
  const calcularCorPorPreco = (preco: number, precoMaximo: number) => {
    const intensidade = preco / precoMaximo;
    const r = Math.round(122 + (255 - 122) * (1 - intensidade));
    const g = Math.round(38 + (255 - 38) * (1 - intensidade));
    const b = Math.round(56 + (255 - 56) * (1 - intensidade));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Dados para o gráfico de distribuição de imóveis
  const quantidadeMaxima = Math.max(
    graficosData.categorias.imoveisComuns.length,
    graficosData.categorias.bannerDesconto.length,
    graficosData.categorias.bannerMelhorPreco.length,
    graficosData.categorias.bannerPromocao.length,
    graficosData.categorias.bannerAdquirido.length,
    graficosData.categorias.bannerAlugado.length
  );

  const dadosDistribuicao = {
    labels: [
      t("relatorios.type1"),
      t("relatorios.type2"),
      t("relatorios.type3"),
      t("relatorios.type4"),
      t("relatorios.type5"),
      t("relatorios.type6"),
    ],
    datasets: [
      {
        data: [
          graficosData.categorias.imoveisComuns.length,
          graficosData.categorias.bannerDesconto.length,
          graficosData.categorias.bannerMelhorPreco.length,
          graficosData.categorias.bannerPromocao.length,
          graficosData.categorias.bannerAdquirido.length,
          graficosData.categorias.bannerAlugado.length,
        ],
        backgroundColor: [
          calcularCorPorPreco(graficosData.categorias.imoveisComuns.length, quantidadeMaxima),
          calcularCorPorPreco(graficosData.categorias.bannerDesconto.length, quantidadeMaxima),
          calcularCorPorPreco(graficosData.categorias.bannerMelhorPreco.length, quantidadeMaxima),
          calcularCorPorPreco(graficosData.categorias.bannerPromocao.length, quantidadeMaxima),
          calcularCorPorPreco(graficosData.categorias.bannerAdquirido.length, quantidadeMaxima),
          calcularCorPorPreco(graficosData.categorias.bannerAlugado.length, quantidadeMaxima),
        ],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  // Dados para o gráfico de preços de venda
  const precoMaximoVenda = Math.max(
    ...graficosData.finalidades.imoveisVenda.map(
      (imovel) => imovel.precoPromocional || imovel.preco || 0
    )
  );
  const dadosPrecosVenda = {
    labels: graficosData.finalidades.imoveisVenda.map((imovel) => imovel.titulo),
    datasets: [
      {
        data: graficosData.finalidades.imoveisVenda.map((imovel) => {
          const preco = imovel.precoPromocional || imovel.preco || 0;
          return preco === 0 ? 1 : preco;
        }),
        backgroundColor: graficosData.finalidades.imoveisVenda.map((imovel) =>
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

  // Dados para o gráfico de preços de aluguel
  const precoMaximoAluguel = Math.max(
    ...graficosData.finalidades.imoveisAluguel.map(
      (imovel) => imovel.precoPromocional || imovel.preco || 0
    )
  );
  const dadosPrecosAluguel = {
    labels: graficosData.finalidades.imoveisAluguel.map((imovel) => imovel.titulo),
    datasets: [
      {
        data: graficosData.finalidades.imoveisAluguel.map(
          (imovel) => imovel.precoPromocional || imovel.preco || 0
        ),
        backgroundColor: graficosData.finalidades.imoveisAluguel.map((imovel) =>
          calcularCorPorPreco(
            imovel.precoPromocional || imovel.preco || 0,
            precoMaximoAluguel
          )
        ),
        borderWidth: 1,
        borderColor: "#fff",
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
      setLoading(true);
      try {
         const doc = new jsPDF("p", "pt");
         let yPos = 15;
         const margin = 15;
         const titleGap = 10;
         const tableGap = 20;

         // Configuração inicial
         doc.setFont("helvetica");
         doc.setFontSize(20);
         doc.setTextColor("#7a2638"); // Cor do título principal
         doc.text("Relatório Imobiliária", 105, yPos, { align: "center" });
         yPos += titleGap * 2;

         // Seção de Imóveis
         doc.setFontSize(16);
         doc.setTextColor("#6B1D1D"); // Cor dos subtítulos
         doc.text("Distribuição de Imóveis", margin, yPos);
         yPos += titleGap;

         // Tabela de distribuição de imóveis
         const dadosDistribuicaoTabela = [
            ["Categoria", "Quantidade"],
            ["Imóveis Comuns", graficosData.categorias.imoveisComuns.length],
            ["Banner Desconto", graficosData.categorias.bannerDesconto.length],
            [
               "Banner Melhor Preço",
               graficosData.categorias.bannerMelhorPreco.length,
            ],
            ["Banner Promoção", graficosData.categorias.bannerPromocao.length],
            [
               "Banner Adquirido",
               graficosData.categorias.bannerAdquirido.length,
            ],
            ["Banner Alugado", graficosData.categorias.bannerAlugado.length],
         ];

         autoTable(doc, {
            startY: yPos,
            head: [["Categoria", "Quantidade"]],
            body: dadosDistribuicaoTabela.slice(1),
            headStyles: {
               fillColor: [122, 38, 56],
               textColor: [255, 255, 255],
            }, // #7a2638
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 220] }, // #F5F5DC
         });
         yPos = (doc as any).lastAutoTable.finalY + tableGap;

         // Preços médios
         doc.setTextColor("#6B1D1D"); // Cor dos subtítulos
         doc.text("Preços Médios", margin, yPos);
         yPos += titleGap;

         const dadosPrecos = [
            ["Categoria", "Valor Médio"],
            [
               "Venda",
               formatarPreco(
                  calcularMediaPrecos(graficosData.finalidades.imoveisVenda)
               ),
            ],
            [
               "Aluguel",
               formatarPreco(
                  calcularMediaPrecos(graficosData.finalidades.imoveisAluguel)
               ),
            ],
         ];

         autoTable(doc, {
            startY: yPos,
            head: [["Categoria", "Valor Médio"]],
            body: dadosPrecos.slice(1),
            headStyles: {
               fillColor: [122, 38, 56],
               textColor: [255, 255, 255],
            }, // #7a2638
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 220] }, // #F5F5DC
         });
         yPos = (doc as any).lastAutoTable.finalY + tableGap;

         // Seção de Usuários
         doc.setTextColor("#6B1D1D"); // Cor dos subtítulos
         doc.text("Usuários", margin, yPos);
         yPos += titleGap;

         const dadosUsuarios = [
            ["Categoria", "Quantidade"],
            ["Usuários Ativos", initialData.usuariosAtivos.length],
            ["Usuários Bloqueados", initialData.usuariosBloqueados.length],
            [
               "Total de Usuários",
               initialData.usuariosAtivos.length +
                  initialData.usuariosBloqueados.length,
            ],
         ];

         autoTable(doc, {
            startY: yPos,
            head: [["Categoria", "Quantidade"]],
            body: dadosUsuarios.slice(1),
            headStyles: {
               fillColor: [122, 38, 56],
               textColor: [255, 255, 255],
            }, // #7a2638
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 220] }, // #F5F5DC
         });
         yPos = (doc as any).lastAutoTable.finalY + tableGap;

         // Seção de Corretores
         doc.setTextColor("#6B1D1D"); // Cor dos subtítulos
         doc.text("Corretores e Agendamentos", margin, yPos);
         yPos += titleGap;

         const dadosCorretores = initialData.usuariosAtivos.map((corretor) => [
            corretor.nome,
            initialData.agendamentosPorCorretor[corretor.nome] || 0,
         ]);

         autoTable(doc, {
            startY: yPos,
            head: [["Nome do Corretor", "Quantidade de Agendamentos"]],
            body: dadosCorretores,
            headStyles: {
               fillColor: [122, 38, 56],
               textColor: [255, 255, 255],
            }, // #7a2638
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 220] }, // #F5F5DC
         });

         // Salvar o PDF
         doc.save("relatorio-imobiliaria.pdf");
         showNotification("PDF exportado com sucesso!");
      } catch (error) {
         console.error("Erro ao exportar PDF:", error);
         showNotification("Erro ao exportar PDF");
      } finally {
         setLoading(false);
      }
   };

   const exportarExcel = () => {
      setLoading(true);
      try {
         const wb = XLSX.utils.book_new();

         // Planilha de Distribuição de Imóveis
         const distribuicaoData = [
            ["Categoria", "Quantidade"],
            ["Imóveis Comuns", graficosData.categorias.imoveisComuns.length],
            ["Banner Desconto", graficosData.categorias.bannerDesconto.length],
            [
               "Banner Melhor Preço",
               graficosData.categorias.bannerMelhorPreco.length,
            ],
            ["Banner Promoção", graficosData.categorias.bannerPromocao.length],
            [
               "Banner Adquirido",
               graficosData.categorias.bannerAdquirido.length,
            ],
            ["Banner Alugado", graficosData.categorias.bannerAlugado.length],
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
            [
               "Venda",
               formatarPreco(
                  calcularMediaPrecos(graficosData.finalidades.imoveisVenda)
               ),
            ],
            [
               "Aluguel",
               formatarPreco(
                  calcularMediaPrecos(graficosData.finalidades.imoveisAluguel)
               ),
            ],
         ];
         const wsPrecos = XLSX.utils.aoa_to_sheet(precosData);
         XLSX.utils.book_append_sheet(wb, wsPrecos, "Preços Médios");

         // Planilha de Usuários
         const usuariosData = [
            ["Categoria", "Quantidade"],
            ["Usuários Ativos", initialData.usuariosAtivos.length],
            ["Usuários Bloqueados", initialData.usuariosBloqueados.length],
            [
               "Total de Usuários",
               initialData.usuariosAtivos.length +
                  initialData.usuariosBloqueados.length,
            ],
         ];
         const wsUsuarios = XLSX.utils.aoa_to_sheet(usuariosData);
         XLSX.utils.book_append_sheet(wb, wsUsuarios, "Usuários");

         // Planilha de Corretores e Agendamentos
         const corretoresData = [
            ["Nome do Corretor", "Quantidade de Agendamentos"],
            ...initialData.usuariosAtivos.map((corretor) => [
               corretor.nome,
               initialData.agendamentosPorCorretor[corretor.nome] || 0,
            ]),
         ];
         const wsCorretores = XLSX.utils.aoa_to_sheet(corretoresData);
         XLSX.utils.book_append_sheet(wb, wsCorretores, "Corretores");

         // Salvar o arquivo
         XLSX.writeFile(wb, "relatorio-imobiliaria.xlsx");
         showNotification("Excel exportado com sucesso!");
      } catch (error) {
         console.error("Erro ao exportar Excel:", error);
         showNotification("Erro ao exportar Excel");
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center w-full h-64">
            <p className="text-havprincipal">Carregando...</p>
         </div>
      );
   }

   return (
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
      // Salvar o PDF
      doc.save("relatorio-imobiliaria.pdf");
      showNotification("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      showNotification("Erro ao exportar PDF");
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    setLoading(true);
    try {
      const wb = XLSX.utils.book_new();

      // Planilha de Distribuição de Imóveis
      const distribuicaoData = [
        ["Categoria", "Quantidade"],
        ["Imóveis Comuns", graficosData.categorias.imoveisComuns.length],
        ["Banner Desconto", graficosData.categorias.bannerDesconto.length],
        ["Banner Melhor Preço", graficosData.categorias.bannerMelhorPreco.length],
        ["Banner Promoção", graficosData.categorias.bannerPromocao.length],
        ["Banner Adquirido", graficosData.categorias.bannerAdquirido.length],
        ["Banner Alugado", graficosData.categorias.bannerAlugado.length],
      ];
      const wsDistribuicao = XLSX.utils.aoa_to_sheet(distribuicaoData);
      XLSX.utils.book_append_sheet(wb, wsDistribuicao, "Distribuição de Imóveis");

      // Planilha de Preços Médios
      const precosData = [
        ["Categoria", "Valor Médio"],
        ["Venda", formatarPreco(calcularMediaPrecos(graficosData.finalidades.imoveisVenda))],
        ["Aluguel", formatarPreco(calcularMediaPrecos(graficosData.finalidades.imoveisAluguel))],
      ];
      const wsPrecos = XLSX.utils.aoa_to_sheet(precosData);
      XLSX.utils.book_append_sheet(wb, wsPrecos, "Preços Médios");

      // Planilha de Usuários
      const usuariosData = [
        ["Categoria", "Quantidade"],
        ["Usuários Ativos", initialData.usuariosAtivos.length],
        ["Usuários Bloqueados", initialData.usuariosBloqueados.length],
        [
          "Total de Usuários",
          initialData.usuariosAtivos.length + initialData.usuariosBloqueados.length,
        ],
      ];
      const wsUsuarios = XLSX.utils.aoa_to_sheet(usuariosData);
      XLSX.utils.book_append_sheet(wb, wsUsuarios, "Usuários");

      // Planilha de Corretores e Agendamentos
      const corretoresData = [
        ["Nome do Corretor", "Quantidade de Agendamentos"],
        ...initialData.usuariosAtivos.map((corretor) => [
          corretor.nome,
          initialData.agendamentosPorCorretor[corretor.nome] || 0,
        ]),
      ];
      const wsCorretores = XLSX.utils.aoa_to_sheet(corretoresData);
      XLSX.utils.book_append_sheet(wb, wsCorretores, "Corretores");

      // Salvar o arquivo
      XLSX.writeFile(wb, "relatorio-imobiliaria.xlsx");
      showNotification("Excel exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      showNotification("Erro ao exportar Excel");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-havprincipal">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[90rem] mx-auto">
      <h2 className="text-havprincipal text-2xl font-bold mb-4 text-center">
        {t("relatorios.properties")}
      </h2>
      {/* Container dos gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        {/* Gráfico de Distribuição de Imóveis */}
        <div className="bg-white p-6 rounded-lg shadow w-full flex flex-col">
          <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
            {t("relatorios.tittleRel1")}
          </h2>
          <div className="flex-1 flex flex-col justify-center min-h-[300px]">
            <div className="w-full aspect-square max-w-[260px] mx-auto">
              <Pie data={dadosDistribuicao} options={opcoesDistribuicao} />
            </div>
          </div>
        </div>

        {/* Gráfico de Preços de Venda */}
        <div className="bg-white p-6 rounded-lg shadow w-full flex flex-col">
          <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
            {t("relatorios.tittleRel2")}
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
            {t("relatorios.tittleRel3")}
          </h2>
          <div className="flex-1 flex flex-col justify-center min-h-[300px]">
            <div className="w-full aspect-square max-w-[220px] mx-auto">
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
            {t("relatorios.titleValue1")}
          </h2>
          <p className="text-3xl font-bold text-havprincipal">
            {formatarPreco(calcularMediaPrecos(graficosData.finalidades.imoveisVenda))}
          </p>
        </div>

        {/* Valor Médio Aluguel */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-havprincipal mb-2">
            {t("relatorios.titleValue2")}
          </h2>
          <p className="text-3xl font-bold text-havprincipal">
            {formatarPreco(calcularMediaPrecos(graficosData.finalidades.imoveisAluguel))}
          </p>
        </div>
      </div>

      {/* Relatório de Usuários */}
      <h2 className="text-havprincipal text-2xl font-bold mb-4 text-center mt-8">
        {t("relatorios.users")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        {/* Usuários Ativos */}
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
            {t("relatorios.tittleUsers1")}
          </h2>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-bold text-havprincipal mb-2">
              {initialData.usuariosAtivos.length}
            </p>
            <p className="text-gray-600">
              {initialData.usuariosAtivos.length === 1
                ? "usuário ativo"
                : "usuários ativos"}
            </p>
          </div>
        </div>

        {/* Usuários Bloqueados */}
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
            {t("relatorios.tittleUsers2")}
          </h2>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-bold text-havprincipal mb-2">
              {initialData.usuariosBloqueados.length}
            </p>
            <p className="text-gray-600">
              {initialData.usuariosBloqueados.length === 1
                ? "usuário bloqueado"
                : "usuários bloqueados"}
            </p>
          </div>
        </div>

        {/* Total de Usuários */}
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold text-havprincipal mb-4 text-center">
            {t("relatorios.tittleUsers3")}
          </h2>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-bold text-havprincipal mb-2">
              {initialData.usuariosAtivos.length +
                initialData.usuariosBloqueados.length}
            </p>
            <p className="text-gray-600">
              {initialData.usuariosAtivos.length +
                initialData.usuariosBloqueados.length ===
              1
                ? "usuário cadastrado"
                : "usuários cadastrados"}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Corretores */}
      <h2 className="text-havprincipal text-2xl font-bold mb-4 text-center mt-8">
        {t("relatorios.brokers")}
      </h2>
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl mx-auto">
        {initialData.usuariosAtivos.map((corretor, index) => (
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
                  {t("relatorios.appointments")}:{" "}
                  {initialData.agendamentosPorCorretor[corretor.nome] || 0}
                </span>
              </div>
            </div>
      {/* Botões de Exportar */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={exportarPDF}
          disabled={loading}
          className="bg-havprincipal text-white px-6 py-2 rounded-md hover:bg-havprincipal/90 transition-colors flex items-center gap-2 disabled:opacity-50"
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
          {loading ? t("common.loading") : t("relatorios.button1")}
        </button>
        <button
          onClick={exportarExcel}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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
          {loading ? t("common.loading") : t("relatorios.button2")}
        </button>
      </div>
   );
}
