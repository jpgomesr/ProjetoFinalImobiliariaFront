"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ModelAgendamento } from "@/models/ModelAgendamento";
import { Roles } from "@/models/Enum/Roles";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Link from "next/link";
import BotaoPadrao from "@/components/BotaoPadrao";
import FIltrosAgendamento from "./FIltrosAgendamento";
import { Suspense } from "react";
import CardReserva from "@/components/card/CardAgendamento";
import PaginacaoHistorico from "./PaginacaoHistórico";

interface HistoricoAgendamentosClientProps {
   id: string;
   role: Roles;
   parametrosRenderizados: {
      status?: string;
      data?: string;
   };
   currentPage: number;
   agendamentos: ModelAgendamento[];
   totalPages: number;
   token: string;
}

const HistoricoAgendamentosClient = ({
   id,
   role,
   parametrosRenderizados,
   currentPage,
   agendamentos,
   totalPages,
   token
}: HistoricoAgendamentosClientProps) => {
   const { t } = useLanguage();

   return (
      <FundoBrancoPadrao
         titulo={t("SchedulingHistory.title")}
         className="w-full px-2"
      >
         {role === Roles.CORRETOR && (
            <Link href={`/horarios/${id}`} className="w-fit">
               <BotaoPadrao texto={t("SchedulingHistory.mySchedules")} />
            </Link>
         )}
         <FIltrosAgendamento
            id={id}
            url={`/historico-agendamentos/${id}`}
            status={parametrosRenderizados?.status || ""}
            data={parametrosRenderizados?.data || ""}
         />
         <Suspense fallback={<div>Carregando...</div>}>
            <section
               className="grid grid-cols-1 w-full my-4 place-items-center gap-8 '
               md:grid-cols-2 
               lg:grid-cols-3
               "
            >
               {agendamentos &&
                  agendamentos.map((agendamento: ModelAgendamento, key) => (
                     <CardReserva
                        role={role}
                        id={agendamento.id}
                        key={key}
                        urlImagem={agendamento.referenciaImagemPrincipal}
                        horario={agendamento.horario.split("T")[1].substring(0, 5)}
                        data={new Date(agendamento.horario).toLocaleDateString(
                           "pt-BR"
                        )}
                        corretor={agendamento.nomeUsuario}
                        usuario={agendamento.nomeCorretor}
                        status={agendamento.status}
                        localizacao={`${agendamento.endereco.cidade} - ${agendamento.endereco.bairro}`}
                        endereco={`${agendamento.endereco.rua}, ${agendamento.endereco.numeroCasaPredio}`}
                        token={token}
                     />
                  ))}
            </section>
            <PaginacaoHistorico totalPages={totalPages} currentPage={currentPage} />
         </Suspense>
      </FundoBrancoPadrao>
   );
};

export default HistoricoAgendamentosClient; 