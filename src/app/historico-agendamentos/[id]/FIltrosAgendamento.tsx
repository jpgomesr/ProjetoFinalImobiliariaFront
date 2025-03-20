import List from '@/components/List'
import React from 'react'

const FIltrosAgendamento = () => {

    const opcoesAgendamento = [
        {
            id: "cancelado",
            label: "Cancelado"
        },
        {
            id: "confirmado", 
            label: "Confirmado"
        },
        {
            id: "aguardandoConfirmacao",
            label: "Aguardando Confirmação"
        }
    ]

  return (
    <div className='w-full flex justify-between'>
        <List 
        placeholder=''
        opcoes={opcoesAgendamento}/>
        <List
        placeholder=''
        opcoes={opcoesAgendamento}
        />

    </div>
  )
}

export default FIltrosAgendamento