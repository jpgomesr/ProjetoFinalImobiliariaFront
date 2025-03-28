import CardReserva from "@/components/card/CardAgendamento";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React, { Suspense } from "react";
import FIltrosAgendamento from "./FIltrosAgendamento";
import { buscarIdsUsuarios } from "@/Functions/usuario/buscaUsuario";
import { ModelAgendamento } from "@/models/ModelAgendamento";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import PaginacaoHistorico from "./PaginacaoHistórico";
import Link from "next/link";
import BotaoPadrao from "@/components/BotaoPadrao";
interface PageProps {
   params: Promise<{
      id: string;
   }>;
   searchParams: Promise<{
      page?: string;
      status?: string;
      data?: string;
   }>;
}

export async function generateStaticParams() {
   const ids = await buscarIdsUsuarios();
   return ids.map((id) => ({ id: id.toString() }));
}

const page = async ({ params, searchParams }: PageProps) => {
   const { id } = await params;
   const parametros = await searchParams;
   const currentPage = Number(parametros?.page) || 0;

   const fetchAgendamentos = async () => {
      try {
         console.log(parametros);
         const response = await fetch(
            `http://localhost:8082/agendamentos/${id}?status=${
               parametros?.status || ""
            }&data=${
               parametros?.data || ""
            }&page=${currentPage}&size=9&sort=dataHora,desc`
         );
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Erro ao buscar agendamentos:", error);
         return [];
      }
   };

   const agendamentos = await fetchAgendamentos();

   return (
      <Layout>
         <SubLayoutPaginasCRUD>
               <FIltrosAgendamento
               id={id}
               url={`/historico-agendamentos/${id}`}
               status={parametros?.status || ""}
               data={parametros?.data || ""}
               />
               <Suspense fallback={<div>Carregando...</div>}>
                  <section
                     className="grid grid-cols-1 w-full my-4 place-items-center gap-8 '
               md:grid-cols-2 
               lg:grid-cols-3
               "
                  >
                     {agendamentos &&
                        agendamentos.map(
                           (agendamento: ModelAgendamento, key: number) => (
                              <CardReserva
                                 id={agendamento.id}
                                 key={key}
                                 urlImagem={
                                    agendamento.referenciaImagemPrincipal
                                 }
                                 horario={agendamento.horario
                                    .split("T")[1]
                                    .substring(0, 5)}
                                 data={new Date(
                                    agendamento.horario
                                 ).toLocaleDateString("pt-BR")}
                                 corretor={agendamento.nomeUsuario}
                                 status={agendamento.status}
                                 localizacao={`${agendamento.endereco.cidade} - ${agendamento.endereco.bairro}`}
                                 endereco={`${agendamento.endereco.rua}, ${agendamento.endereco.numeroCasaPredio}`}
                              />
                           )
                        )}
                  </section>
                  <PaginacaoHistorico
                     totalPages={agendamentos.totalPages}
                     currentPage={currentPage}
                  />
            </Suspense>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
