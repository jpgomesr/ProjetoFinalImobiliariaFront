"use client"

import { useEffect, useState } from "react"

export default function SuccessNotification({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(false)

  // Mostrar a notificação quando a mensagem é recebida
  useEffect(() => {
    if (message) {
      setIsVisible(true)
    }
  }, [message])

  // Esconder a notificação após 5 segundos
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000) // 5000ms = 5 segundos

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <div
      className={`fixed -left-6 top-20 z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative bg-[#7a2735] text-white px-1.5 py-1 rounded-lg shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="border-2 rounded-lg flex pr-4">
          <p className="text-center text-xs ml-3 w-32 py-1.5">{message}</p>
        </div>
      </div>
    </div>
  )
}