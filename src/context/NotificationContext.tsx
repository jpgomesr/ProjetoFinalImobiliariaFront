"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import SuccessNotification from "@/components/pop-up/Pop-up" // Importe o componente

interface NotificationContextType {
  showNotification: (message: string) => void
  hideNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>("")
  const [show, setShow] = useState<boolean>(false)

  const showNotification = (message: string) => {
    setMessage(message)
    setShow(true)

    // Esconder a notificação após 5 segundos
    setTimeout(() => {
      setShow(false)
    }, 5000)
  }

  const hideNotification = () => {
    setShow(false)
  }

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {show && <SuccessNotification message={message} />} {/* Renderiza a notificação */}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}