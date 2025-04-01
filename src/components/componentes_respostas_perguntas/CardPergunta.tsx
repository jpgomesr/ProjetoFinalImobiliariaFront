import React from "react";

interface CardPerguntaProps {
   tipoPergunta: string;
   email: string;
   mensagem: string;
}

export default function CardPergunta({
   tipoPergunta,
   email,
   mensagem,
}: CardPerguntaProps) {
   return (
      <div className="border border-gray-300 rounded-lg p-4 mb-4 w-full max-w-md text-xs sm:text-sm md:text-base">
         <div className="flex flex-col sm:flex-row sm:items-start mb-2">
            <div className="mb-2 sm:mb-0 sm:w-1/2">
               <div>
                  <span className="font-medium">Finalidade:</span>
               </div>
               <div className="truncate">{tipoPergunta || "Não informado"}</div>
            </div>
            <div className="sm:w-1/2">
               <div>
                  <span className="font-medium">Email:</span>
               </div>
               <div className="truncate">{email}</div>
            </div>
         </div>
         <div>
            <div>
               <span className="font-medium">Mensagem:</span>
            </div>
            <div className="line-clamp-2">{mensagem}</div>
         </div>
      </div>
   );
}
