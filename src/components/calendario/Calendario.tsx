"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  getWeeksInMonth,
  isBefore,
  startOfDay,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import BotaoPadrao from "@/components/BotaoPadrao"
import { twMerge } from "tailwind-merge"
import BotaoCalendario from "../BotaoCalendario"

interface CalendarioProps {
  onDateSelect?: (date: Date) => void
}

export function Calendario({ onDateSelect }: CalendarioProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  // Data atual para comparações
  const today = startOfDay(new Date())

  // Gerar dias do mês atual
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, { locale: ptBR })
  const endDate = endOfWeek(monthEnd, { locale: ptBR })

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Calcular o número total de semanas para identificar a última linha
  const totalWeeks = getWeeksInMonth(currentMonth, { locale: ptBR })

  // Dias da semana em português
  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

  // Navegar para o mês anterior
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleMesFormatado = () => {
    const mesString = format(currentMonth, "MMMM", { locale: ptBR })
    let mesFormatado = ""

    for (let i = 0; i < mesString.length; i++) {
      if (i === 0) {
        mesFormatado += mesString.charAt(0).toLocaleUpperCase()
      } else {
        mesFormatado += mesString[i]
      }
    }

    return mesFormatado
  }
  // Navegar para o próximo mês
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Função para selecionar uma data
  const handleDateSelect = (day: Date) => {
    // Só permite selecionar a data se não for anterior a hoje
    if (!isBefore(day, today)) {
      setSelectedDate(day)
      // Notificar o componente pai sobre a mudança de data
      if (onDateSelect) {
        onDateSelect(day)
      }
    }
  }

  return (
    <div className="flex flex-col h-full w-full mx-auto">
      {/* Cabeçalho do calendário */}
      <div className="pt-2 md:pt-3 pb-2 flex items-center justify-center text-begepadrao">
        <BotaoPadrao
          texto={<ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />}
          onClick={prevMonth}
          className="text-white hover:bg-havprincipal hover:text-white"
        />
        <h2 className="font-medium text-base md:text-lg lg:text-xl mx-2 md:mx-4">{handleMesFormatado()}</h2>
        <BotaoPadrao
          texto={<ChevronRight className="h-3 w-3 md:h-4 md:w-4" />}
          onClick={nextMonth}
          className="text-white hover:bg-havprincipal hover:text-white"
        />
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 text-center text-[10px] md:text-xs">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1 md:py-2 font-medium flex items-center justify-center w-6 h-6 md:w-8 md:h-8 mx-auto text-begepadrao"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 text-center gap-0.5 md:gap-1 flex-grow pb-2 md:pb-4">
        {days.map((day, index) => {
          const isToday = isSameDay(day, today)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isPastDay = isBefore(day, today) && !isToday && isCurrentMonth

          // Verificar se o dia está na última semana do grid
          const dayLastWeek = Math.floor(index / 7)
          const isLastRow = dayLastWeek === Math.floor(days.length / 7) - 1

          const dayFirstWeek = Math.floor(index / 7)
          const isFirstRow = dayFirstWeek === 0

          return (
            <BotaoCalendario
              key={index}
              handler={() => {
                handleDateSelect(day)
                if (!isCurrentMonth && index > 20) {
                  nextMonth()
                } else if (isFirstRow && !isCurrentMonth) {
                  prevMonth()
                }
              }}
              disabled={isPastDay}
              className={twMerge(
                "flex items-center justify-center w-6 h-6 md:w-8 md:h-8 mx-auto transition-colors rounded-full text-xs md:text-sm",
                !isCurrentMonth && "text-gray-400/40", // Dias de outros meses
                isPastDay && "cursor-not-allowed text-begepadrao", // Dias passados
                isToday && !isSelected && "border border-begepadrao text-begepadrao rounded-full", // Dia atual
                isSelected && "bg-white text-havprincipal rounded-full font-medium", // Dia selecionado
                !isToday && !isSelected && isCurrentMonth && !isPastDay && "hover:bg-havprincipal text-begepadrao", // Dias normais do mês atual
                isLastRow && "mb-0.5 md:mb-1",
                !isCurrentMonth && isSelected && "asas",
              )}
              texto={format(day, "dd")}
            />
          )
        })}
      </div>
    </div>
  )
}

