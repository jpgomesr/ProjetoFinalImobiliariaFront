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
} from "date-fns"
import { ptBR } from "date-fns/locale"
import BotaoPadrao from "@/components/BotaoPadrao"
import { twMerge } from "tailwind-merge"
import BotaoCalendario from "../BotaoCalendario"

export function Calendario() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Gerar dias do mês atual
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, { locale: ptBR })
  const endDate = endOfWeek(monthEnd, { locale: ptBR })

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Dias da semana em português
  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

  // Navegar para o mês anterior
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navegar para o próximo mês
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho do calendário */}
      <div className="p-4 flex items-center justify-center">
        <BotaoPadrao
          texto={<ChevronLeft className="h-4 w-4" />}
          handler={prevMonth}
          className="text-white hover:bg-havprincipal hover:text-white "
        />
        <h2 className="font-medium text-lg mx-2">{format(currentMonth, "MMMM", { locale: ptBR })}</h2>
        <BotaoPadrao
          texto={<ChevronRight className="h-4 w-4" />}
          handler={nextMonth}
          className="text-white hover:bg-havprincipal hover:text-white"
        />
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 text-center text-xs">
        {weekDays.map((day) => (
          <div key={day} className="py-2 font-medium flex items-center justify-center w-8 h-8 mx-auto">
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 text-center gap-1 flex-grow">
        {days.map((day, key) => {
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <BotaoCalendario
              key={key}
              handler={() => setSelectedDate(day)}
              className={twMerge(
                "flex items-center justify-center w-8 h-8 mx-auto transition-colors rounded-full",
                !isCurrentMonth && "text-gray-400", // Dias de outros meses
                isToday && !isSelected && "border border-begepadrao text-white rounded-full", // Dia atual
                isSelected && "bg-white text-havprincipal rounded-full font-medium", // Dia selecionado
                !isToday && !isSelected && isCurrentMonth && "hover:bg-havprincipal", // Dias normais do mês atual
              )}
              texto={format(day, "dd")}
            />
          )
        })}
      </div>
    </div>
  )
}

