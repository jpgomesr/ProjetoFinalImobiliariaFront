"use client"

import { useEffect, useState } from "react"

export default function SuccessNotification({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")

  // When a new message is received
  useEffect(() => {
    if (message) {
      setCurrentMessage(message)

      // Small delay to ensure DOM is ready before animation
      setTimeout(() => {
        setIsVisible(true)
      }, 10)

      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message])

  // Reset message after animation completes
  useEffect(() => {
    if (!isVisible && currentMessage) {
      // Wait for the exit animation to complete
      const animationTimer = setTimeout(() => {
        setCurrentMessage("")
      }, 500) // Match this with your transition duration

      return () => clearTimeout(animationTimer)
    }
  }, [isVisible, currentMessage])

  if (!currentMessage) return null

  return (
    <div
      className={`fixed -left-6 top-20 md:top-24 z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative bg-[#7a2735] text-white px-1.5 py-1 md:px-3 md:py-2 rounded-lg shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="border-2 rounded-lg flex pr-4 md:pr-6">
          <p className="text-center text-xs md:text-base ml-3 md:ml-5 w-32 md:w-44 py-1.5 md:py-2.5">
            {currentMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

