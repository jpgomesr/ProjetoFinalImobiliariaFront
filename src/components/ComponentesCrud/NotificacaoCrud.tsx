"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface NotificacaoCrudProps {
  message: string
  isVisible: boolean
  onClose: () => void
  onUndo?: () => void
  duration?: number
}

export default function NotificacaoCrud({
  message,
  isVisible,
  onClose,
  onUndo,
  duration = 5000,
}: NotificacaoCrudProps) {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true)

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsShowing(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const handleUndo = () => {
    if (onUndo) {
      onUndo()
    }
    setIsShowing(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const handleClose = () => {
    setIsShowing(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-24 left-4 z-50 transition-all duration-300 ease-in-out ${
        isShowing ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
      }`}
    >
      <div className="bg-havprincipal text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-md w-full">
        <span className="text-sm">{message}</span>
        <div className="flex items-center space-x-3 ml-4">
          {onUndo && (
            <button
              onClick={handleUndo}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Desfazer
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

