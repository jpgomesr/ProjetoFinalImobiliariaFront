import React from "react";

interface CardPerguntaProps {
   tipoPergunta: string;
   email: string;
   mensagem: string;
   data: Date;
   perguntaRespondida: boolean;
   resposta?: string;
   idAdministrador?: string;
   idEditor?: string;
}

const CardPergunta = ({ tipoPergunta, email, mensagem }: CardPerguntaProps) => {
   return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 h-[200px]">
         <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
               <span className="font-medium h-6">Tipo:</span>
               <p className="mt-1 truncate">
                  {tipoPergunta || "Não informado"}
               </p>
            </div>
            <div className="flex flex-col">
               <span className="font-medium h-6">Email:</span>
               <p className="mt-1 truncate">{email}</p>
            </div>
         </div>
         <div className="flex flex-col">
            <span className="font-medium h-6">Mensagem:</span>
            <p className="mt-1 line-clamp-3">{mensagem}</p>
         </div>
      </div>
   );
};

export default CardPergunta;
