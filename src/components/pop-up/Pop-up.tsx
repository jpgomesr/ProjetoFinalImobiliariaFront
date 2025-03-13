"use client"

interface SuccessNotificationProps {
  message: string
  isVisible?: boolean // Make it optional to maintain backward compatibility
}

export default function SuccessNotification({
  message,
  isVisible = true, // Default to true for backward compatibility
}: SuccessNotificationProps) {
  return (
    <div
      className={`fixed -left-6 top-20 md:top-24 z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative bg-[#7a2735] text-white px-1.5 py-1 md:px-3 md:py-2 rounded-lg shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="border-2 rounded-lg flex pr-4 md:pr-6">
          <p className="text-center text-xs md:text-base ml-3 md:ml-5 w-32 md:w-44 py-1.5 md:py-2.5">{message}</p>
        </div>
      </div>
    </div>
  )
}

