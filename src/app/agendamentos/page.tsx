"use client"

import { useState } from "react"
import { useNotification } from "@/context/NotificationContext"
import Layout from "@/components/layout/LayoutPadrao"
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD"
import { Calendario } from "@/components/calendario/Calendario"
import Horario from "@/components/calendario/Horarios"
import { CalendarDays, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Page = () => {
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())
  const { showNotification } = useNotification() // Hook para disparar notificações

  const handleSelecionarHorario = (horario: string) => {
    setHorarioSelecionado(horario)
  }

  const handleSelecionarData = (data: Date) => {
    setDataSelecionada(data)
  }

  const dataFormatada = dataSelecionada ? format(dataSelecionada, "EEEE, dd 'de' MMMM", { locale: ptBR }) : ""
  const dataFormatadaCapitalizada = dataFormatada ? dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1) : ""

  const handleAgendar = () => {
    if (horarioSelecionado) {
      setMostrarModal(true)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Rolagem suave
    })
  }

  return (
    <Layout className={"py-0"}>
      <SubLayoutPaginasCRUD>
        <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl md:text-2xl lg:text-3xl text-center mb-4 md:mb-6 lg:mb-8">
          <h1>Agendamento de Visitas com</h1>
          <h1 className="font-bold">HAV</h1>
        </div>
        <div className="w-full px-4 md:px-6 lg:px-8 flex-grow flex flex-col">
          <div className="bg-havprincipal w-full md:max-w-[600px] lg:max-w-[700px] mx-auto rounded-xl flex-grow flex flex-col overflow-hidden">
            <div className="flex gap-2 items-center justify-center text-begepadrao pt-2 px-4">
              <CalendarDays className="h-5 md:h-6 lg:h-7 w-5 md:w-6 lg:w-7" />
              <span className="text-sm md:text-base lg:text-lg text-left">{dataFormatadaCapitalizada}</span>
            </div>
            <Calendario onDateSelect={handleSelecionarData} />
          </div>
        </div>
        <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl md:text-2xl lg:text-3xl text-center my-4 md:my-6 lg:my-8">
          <h2>Horários</h2>
        </div>
        <div className="grid grid-rows-2 gap-7">
          <div className="grid grid-cols-4 gap-2 lg:gap-16">
            {["10:00", "11:30", "13:30", "14:30"].map((horario) => (
              <Horario
                key={horario}
                horario={horario}
                selecionado={horario === horarioSelecionado}
                onSelecionar={() => handleSelecionarHorario(horario)}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 lg:gap-16">
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
                className="bg-havprincipal/90 flex justify-center items-center h-7 w-24 rounded-md font-inter lg:w-32 lg:h-10 text-begepadrao"
                onClick={handleAgendar}
              >
                Agendar
              </button>
            </div>
          )}
        </div>
      </SubLayoutPaginasCRUD>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-80 md:w-96 lg:w-[28rem] text-center bg-white">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold flex justify-center">Corretor xxx</h2>
            <div className="grid grid-cols-[auto,1fr] gap-2 md:gap-3 items-center justify-center mt-2 md:mt-3 lg:mt-4">
              <CalendarDays className="h-5 md:h-6 lg:h-7 w-5 md:w-6 lg:w-7" />
              <p className="text-left md:text-lg lg:text-xl">{dataFormatadaCapitalizada}</p>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-2 md:gap-3 items-center justify-items-start mt-2 md:mt-3 lg:mt-4">
              <Clock className="h-5 md:h-6 lg:h-7 w-5 md:w-6 lg:w-7" />
              <p className="text-left md:text-lg lg:text-xl">Você agendou para {horarioSelecionado}</p>
            </div>
            <button
              className="mt-4 md:mt-6 lg:mt-8 bg-havprincipal text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-md md:text-lg lg:text-xl"
              onClick={() => {
                setMostrarModal(false)
                showNotification("Agendado com sucesso!") // Disparar a notificação
                scrollToTop() // Rolar para o topo
              }}
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Page

