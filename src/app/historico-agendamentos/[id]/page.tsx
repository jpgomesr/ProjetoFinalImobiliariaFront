import CardReserva from "@/components/card/CardAgendamento";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React, { Suspense } from "react";
import FIltrosAgendamento from "./FIltrosAgendamento";
import { buscarIdsUsuarios } from "@/Functions/usuario/buscaUsuario";
import { ModelAgendamento } from "@/models/ModelAgendamento";

interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

export async function generateStaticParams() {
   const ids = await buscarIdsUsuarios();
   return ids.map((id) => ({ id: id.toString() }));
}

const page = async ({ params }: PageProps) => {
   const { id } = await params;

   const fetchAgendamentos = async () => {
      try {
         const response = await fetch(`http://localhost:8082/agendamentos/${id}`);
         const data = await response.json();
         return data.content as ModelAgendamento[];
      } catch (error) {
         console.error("Erro ao buscar agendamentos:", error);
         return [];
      }
   };

   const agendamentos: ModelAgendamento[] = await fetchAgendamentos(); 

   console.log(agendamentos);

   return (
      <Layout className="my-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Histórico de agendamentos"
               className="w-full px-2"
            >
               <InputPadrao search className="h-8" />
               <FIltrosAgendamento />
               <Suspense fallback={<div>Carregando...</div>}>
                  <section
                     className="grid grid-cols-1 w-full my-4 place-items-center gap-8 '
               md:grid-cols-2 
               lg:grid-cols-3
               "
               >
                  {agendamentos && agendamentos.map((agendamento: ModelAgendamento) => (
                     <CardReserva
                        key={agendamento.idImovel} 
                        urlImagem={agendamento.referenciaImagemPrincipal}
                        horario={agendamento.horario.split("T")[1].substring(0, 5)}
                        data={new Date(agendamento.horario).toLocaleDateString('pt-BR')}
                        corretor={agendamento.nomeUsuario}
                        localizacao={`${agendamento.endereco.cidade} - ${agendamento.endereco.bairro}`}
                        endereco={`${agendamento.endereco.rua}, ${agendamento.endereco.numeroCasaPredio}`}
                     />
                  ))}
               </section>
               </Suspense>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
