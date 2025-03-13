"use client"

interface HorariosProps {
  horario: string
  selecionado: boolean
  onSelecionar: () => void
}

const Horarios = ({ horario, selecionado, onSelecionar }: HorariosProps) => {
  return (
    <>
      <div
        className={`flex w-20 sm:w-22 md:w-24 lg:w-32 hover:opacity-100 h-7 sm:h-8 md:h-9 lg:h-10 items-center rounded-lg justify-center text-begepadrao font-montserrat text-sm md:text-lg cursor-pointer transition-all ${
          selecionado ? "bg-havprincipal text-white" : "bg-havprincipal opacity-75"
        }`}
        onClick={onSelecionar}
      >
        {horario}
      </div>
    </>
  )
}

export default Horarios

