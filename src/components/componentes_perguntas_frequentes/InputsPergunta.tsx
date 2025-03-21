import React from 'react'
import InputPadrao from '../InputPadrao'
import TextAreaPadrao from '../TextAreaPadrao'
interface InputsPerguntaProps {
  placeholder: string;
}

const InputsPergunta = ({ placeholder }: InputsPerguntaProps) => {
  return (
    <div className="flex flex-col gap-4">
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
        <TextAreaPadrao
            label="Mensagem"
            placeholder={placeholder}
            htmlFor="Mensagem"
        />
    </div>
  )
}

export default InputsPergunta