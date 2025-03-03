"use client"

interface ModalCofirmacaoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}

export default function ModalCofirmacao({
  isOpen,
  onClose,
  onConfirm,
  message = "Você tem certeza que deseja remover o proprietário?",
}: ModalCofirmacaoProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#e6e2d7] p-8 rounded-lg max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-medium mb-6 text-center">{message}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="bg-[#7e2639] hover:bg-[#6a1f30] text-white py-2 px-8 rounded-md font-medium"
          >
            Sim
          </button>
          <button
            onClick={onClose}
            className="bg-[#7e2639] hover:bg-[#6a1f30] text-white py-2 px-8 rounded-md font-medium"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  )
}

