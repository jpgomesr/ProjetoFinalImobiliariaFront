import React from 'react'
import InputPadrao from '../InputPadrao'

const InputsPergunta = () => {
  return (
    <div>
        <InputPadrao
            label="E-mail"
            placeholder="Ex: Carlos@gmail.com"
            htmlFor="E-mail"
        />
        <InputPadrao
            label="Telefone"
            placeholder="Ex: 47912312121"
            htmlFor="Telefone"
        />
        <InputPadrao
            label="Nome"
            placeholder="Ex: Carlos"
            htmlFor="Nome"
        />
    </div>
  )
}

export default InputsPergunta