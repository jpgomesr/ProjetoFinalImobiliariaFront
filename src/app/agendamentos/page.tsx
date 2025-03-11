"use client"

import { useState } from "react"
import Layout from "@/components/layout/LayoutPadrao"
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD"
import { Calendario } from "@/components/calendario/Calendario"
import Horario from "@/components/calendario/Horarios"
import { CalendarDays, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Page = () => {
  // Estado para armazenar o horário selecionado
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  // Estado para armazenar a data selecionada
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())

  // Função para atualizar o horário selecionado
  const handleSelecionarHorario = (horario: string) => {
    setHorarioSelecionado(horario)
  }

  // Função para atualizar a data selecionada
  const handleSelecionarData = (data: Date) => {
    setDataSelecionada(data)
  }

  // Formatar a data selecionada para exibição (dia da semana, dia e mês)
  const dataFormatada = dataSelecionada ? format(dataSelecionada, "EEEE, dd 'de' MMMM", { locale: ptBR }) : ""

  // Capitalizar a primeira letra do dia da semana
  const dataFormatadaCapitalizada = dataFormatada ? dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1) : ""

  const handleAgendar = () => {
    if (horarioSelecionado) {
      setMostrarModal(true)
    }
  }

  const handleFecharModal = () => {
    setMostrarModal(false)
  }

  return (
    <Layout className={"py-0"}>
      <SubLayoutPaginasCRUD>
        <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl text-center mb-4">
          <h1>Agendamento de Visitas com</h1>
          <h1 className="font-bold">HAV</h1>
        </div>
        <div className="w-full px-4 flex-grow flex flex-col">
          <div className="bg-havprincipal w-full rounded-xl flex-grow flex flex-col overflow-hidden">
            {/* Exibir a data selecionada ao lado do ícone de calendário */}
            <div className="grid grid-cols-[auto,1fr] gap-2 items-center text-begepadrao pt-2 px-4">
              <CalendarDays className="h-5 w-5" />
              <span className="text-sm text-left">{dataFormatadaCapitalizada}</span>
            </div>
            <Calendario onDateSelect={handleSelecionarData} />
          </div>
        </div>
        <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl text-center my-4">
          <h2>Horários</h2>
        </div>
        <div className="grid grid-rows-2 gap-7">
          <div className="grid grid-cols-4 gap-2">
            {["10:00", "11:30", "13:30", "14:30"].map((horario) => (
              <Horario
                key={horario}
                horario={horario}
                selecionado={horario === horarioSelecionado}
                onSelecionar={() => handleSelecionarHorario(horario)}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["15:30", "16:00", "17:30", "18:00"].map((horario) => (
              <Horario
                key={horario}
                horario={horario}
                selecionado={horario === horarioSelecionado}
                onSelecionar={() => handleSelecionarHorario(horario)}
              />
            ))}
          </div>
          {horarioSelecionado && (
            <div className="flex justify-center">
              <button
                className="bg-havprincipal/90 flex justify-center items-center h-7 w-24 rounded-md font-inter text-begepadrao"
                onClick={handleAgendar}
              >
                Agendar
              </button>
            </div>
          )}
        </div>
      </SubLayoutPaginasCRUD>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg p-6 rounded-lg shadow-lg w-80 text-center bg-white">
            <h2 className="text-xl font-bold flex justify-center">Corretor xxx</h2>
            <div className="grid grid-cols-[auto,1fr] gap-2 items-center justify-items-start mt-2">
              <CalendarDays className="h-5 w-5" />
              <p className="text-left">{dataFormatadaCapitalizada}</p>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-2 items-center justify-items-start mt-2">
              <Clock className="h-5 w-5" />
              <p className="text-left">Você agendou para {horarioSelecionado}</p>
            </div>

            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleFecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Page

