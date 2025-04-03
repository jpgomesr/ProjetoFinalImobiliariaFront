import React from "react";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import ModelPergunta from "@/models/ModelPergunta";

interface InputsPerguntaProps {
   placeholder: string;
   pergunta: ModelPergunta;
   setPergunta: React.Dispatch<React.SetStateAction<ModelPergunta>>;
   erros?: { campo: string; mensagem: string }[];
   setErros?: React.Dispatch<
      React.SetStateAction<{ campo: string; mensagem: string }[]>
   >;
}

const InputsPergunta = ({
   placeholder,
   pergunta,
   setPergunta,
   erros,
   setErros,
}: InputsPerguntaProps) => {
   const getErroCampo = (campo: string) => {
      return erros?.find((erro) => erro.campo === campo)?.mensagem;
   };

   const handleChange = (campo: keyof ModelPergunta, value: string) => {
      setPergunta({ ...pergunta, [campo]: value });

      // Remove o erro do campo quando o usuário começa a digitar
      if (setErros && erros) {
         setErros(erros.filter((erro) => erro.campo !== campo));
      }
   };

   return (
      <div className="flex flex-col gap-4">
         <InputPadrao
            htmlFor="nome"
            label="Nome"
            placeholder="Digite seu nome"
            value={pergunta.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            mensagemErro={getErroCampo("nome")}
         />
         <InputPadrao
            htmlFor="email"
            label="Email"
            placeholder="Digite seu email"
            value={pergunta.email}
            onChange={(e) => handleChange("email", e.target.value)}
            mensagemErro={getErroCampo("email")}
         />
         <InputPadrao
            htmlFor="telefone"
            label="Telefone"
            placeholder="Digite seu telefone"
            value={pergunta.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
            mensagemErro={getErroCampo("telefone")}
         />
         <TextAreaPadrao
            htmlFor="mensagem"
            label="Mensagem"
            placeholder={placeholder}
            value={pergunta.mensagem}
            onChange={(e) => handleChange("mensagem", e.target.value)}
            mensagemErro={getErroCampo("mensagem")}
         />
      </div>
   );
};

export default InputsPergunta;
