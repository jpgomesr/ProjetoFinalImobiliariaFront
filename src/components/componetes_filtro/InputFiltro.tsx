

import React from 'react'


interface inputFiltroProps{
    placeholder?: string,
    tipo : string,
    valor : string
    onChange : (value : string) => void; 

    
}

const InputFiltro = (props : inputFiltroProps) => {
  return (
    <input type={props.tipo} placeholder={props.placeholder} className={`w-full`} value={props.valor} onChange={(e) => props.onChange(e.target.value)}/>
  )
}

export default InputFiltro