"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
} from "date-fns";
import { ptBR } from "date-fns/locale";
import BotaoPadrao from "@/components/BotaoPadrao";
import { twMerge } from "tailwind-merge";

export function Calendario() {
   const [currentMonth, setCurrentMonth] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

   // Gerar dias do mês atual
   const monthStart = startOfMonth(currentMonth);
   const monthEnd = endOfMonth(currentMonth);
   const startDate = startOfWeek(monthStart, { locale: ptBR });
   const endDate = endOfWeek(monthEnd, { locale: ptBR });

   const days = eachDayOfInterval({ start: startDate, end: endDate });

   // Dias da semana em português
   const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

   // Navegar para o mês anterior
   const prevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
   };

   // Navegar para o próximo mês
   const nextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
   };

   return (
      <div className="rounded-lg overflow-hidden bg-havprincipal text-white shadow-lg">
         {/* Cabeçalho do calendário */}
         <div className="p-4 flex items-center justify-center">
            <BotaoPadrao
               texto={<ChevronLeft className="h-4 w-4" />}
               handler={prevMonth}
               className="text-white hover:bg-havprincipal hover:text-white"
            />
            <h2 className="font-medium text-lg">
               {format(currentMonth, "MMMM", { locale: ptBR })}
            </h2>
            <BotaoPadrao
               texto={<ChevronRight className="h-4 w-4" />}
               handler={nextMonth}
               className="text-white hover:bg-havprincipal hover:text-white"
            />
         </div>

         {/* Dias da semana */}
         <div className="grid grid-cols-7 text-center text-xs">
            {weekDays.map((day) => (
               <div key={day} className="py-2 font-medium">
                  {day}
               </div>
            ))}
         </div>

         {/* Dias do mês */}
         <div className="grid grid-cols-7 text-center">
            {days.map((day, i) => {
               const isToday = isSameDay(day, new Date());
               const isSelected = selectedDate
                  ? isSameDay(day, selectedDate)
                  : false;
               const isCurrentMonth = isSameMonth(day, currentMonth);

               return (
                  <BotaoPadrao
                     key={i}
                     handler={() => setSelectedDate(day)}
                     className={twMerge(
                        "h-10 w-full flex items-center justify-center text-sm",
                        !isCurrentMonth && "text-gray-400",
                        isToday &&
                           !isSelected &&
                           "border border-begepadrao text-white rounded-full",
                        isSelected &&
                           "bg-white text-havprincipal rounded-full font-medium",
                        !isToday &&
                           !isSelected &&
                           isCurrentMonth &&
                           "hover:bg-havprincipal"
                     )}
                     texto={format(day, "dd")}
                  />
               );
            })}
         </div>
      </div>
   );
}
