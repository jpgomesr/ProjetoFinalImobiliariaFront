"use client"

import Image from "next/image"

interface CardReservaProps {
  urlImagem: string
  horario: string
  data: string
  corretor: string
  localizacao: string
  endereco: string
  onConfirm?: () => void
  onCancel?: () => void
}

export default function CardReserva({
  urlImagem = "/placeholder.svg?height=300&width=500",
  horario = "16:00",
  data = "19/12/2024",
  corretor = "João Pedro",
  localizacao = "Vila Lenzi",
  endereco = "Rua Hermann Schulz 210",
  onConfirm = () => {},
  onCancel = () => {},
}: CardReservaProps) {
  return (
    <div className="max-w-96 rounded-xl overflow-hidden shadow-lg bg-begepadrao">
      <div className="relative h-48 w-full">
        <Image
          src={urlImagem || "/placeholder.svg"}
          alt="Imagem da propriedade"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="px-6 py-4">
        <h2 className="text-2xl font-semibold text-havprincipal mb-4">Reserva</h2>

        <div className="space-y-2 text-gray-800">
          <p>
            <span className="font-semibold">Horario:</span> {horario}
          </p>
          <p>
            <span className="font-semibold">Data:</span> {data}
          </p>
          <p>
            <span className="font-semibold">Corretor:</span> {corretor}
          </p>
          <p>
            <span className="font-semibold">Localização:</span> {localizacao}, {endereco}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex gap-4">
        <button
          onClick={onConfirm}
          className="flex-1 py-2 px-4 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors duration-200 font-medium"
        >
          Confirmar
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 bg-[#7a2638] hover:bg-[#662030] text-white rounded-md transition-colors duration-200 font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
