"use client";

import { useEffect, useState } from "react";
import { ModelAgendamento } from "@/models/ModelAgendamento";
import CardReserva from "@/components/card/CardAgendamento";
import { Roles } from "@/models/Enum/Roles";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";

interface AgendamentosPerfilProps {
  id: string;
  role: string;
  token: string;
}

export default function AgendamentosPerfil({ id, role, token }: AgendamentosPerfilProps) {
  const [agendamentos, setAgendamentos] = useState<ModelAgendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      setLoading(true);
      try {
        const response = await useFetchComAutorizacaoComToken(
          `${process.env.NEXT_PUBLIC_BASE_URL}/agendamentos/${role === Roles.CORRETOR ? "corretor" : "usuario"}/${id}?status=&data=&page=0&size=9&sort=dataHora,desc`,
          {}, token
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar agendamentos", await response.json());
        }
        const data = await response.json() as { content: ModelAgendamento[] };
        const agendamentosOrdenados = data.content.sort((a: ModelAgendamento, b: ModelAgendamento) => {
          return new Date(b.horario).getTime() - new Date(a.horario).getTime();
        }).slice(0, 3);
        setAgendamentos(agendamentosOrdenados);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [id, role]);

  return (
     <div className="w-full relative z-10">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-lg sm:text-xl font-semibold">
              Meus Agendamentos
           </h2>
           <Link href={`/historico-agendamentos/${id}`}>
              <p className="text-white bg-havprincipal px-4 py-2 rounded-md hover:bg-havprincipal/90">
                 Ver todos
              </p>
           </Link>
        </div>
        {loading ? (
           <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-havprincipal"></div>
           </div>
        ) : agendamentos.length > 0 ? (
           <div className="flex flex-wrap  justify-around gap-12">
              {agendamentos.map((agendamento) => (
                 <CardReserva
                    key={agendamento.id}
                    role={role as Roles}
                    id={agendamento.id}
                    urlImagem={agendamento.referenciaImagemPrincipal}
                    horario={agendamento.horario.split("T")[1].substring(0, 5)}
                    data={new Date(agendamento.horario).toLocaleDateString(
                       "pt-BR"
                    )}
                    corretor={agendamento.corretor}
                    usuario={agendamento.usuario}
                    status={agendamento.status}
                    localizacao={`${agendamento.endereco.cidade} - ${agendamento.endereco.bairro}`}
                    endereco={`${agendamento.endereco.rua}, ${agendamento.endereco.numeroCasaPredio}`}
                    token={token}
                    idImovel={agendamento.idImovel}
                 />
              ))}
           </div>
        ) : (
           <p className="text-center text-gray-500">
              Nenhum agendamento encontrado.
           </p>
        )}
     </div>
  );
} 