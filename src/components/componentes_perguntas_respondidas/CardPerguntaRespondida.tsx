import React, { useState, useEffect } from "react";

interface CardPerguntaRespondidaProps {
   id: string;
   tipoPergunta: string;
   email: string;
   titulo: string;
   mensagem: string;
   data: string | Date;
   perguntaRespondida: boolean;
   resposta?: string;
   idAdministrador?: string;
   idEditor?: string;
}

const CardPerguntaRespondida = ({
   id,
   tipoPergunta,
   email,
   titulo,
   mensagem,
   data,
   perguntaRespondida,
   resposta,
   idAdministrador,
   idEditor,
}: CardPerguntaRespondidaProps) => {
   const [respondidoPor, setRespondidoPor] = useState<string>("");

   useEffect(() => {
      // Determina quem respondeu a pergunta
      if (idAdministrador) {
         setRespondidoPor("Administrador");
      } else if (idEditor) {
         setRespondidoPor("Editor");
      }
   }, [idAdministrador, idEditor]);

   // Função para formatar a data
   const formatarData = (data: string | Date) => {
      if (!data) return "Data não informada";

      const dataObj = typeof data === "string" ? new Date(data) : data;

      return new Intl.DateTimeFormat("pt-BR", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(dataObj);
   };

   return (
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
         <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
               <span>{tipoPergunta || "Não informado"}</span>
               <span>•</span>
               <span>{email || "Não informado"}</span>
               <span>•</span>
               <span>{formatarData(data)}</span>
               {respondidoPor && (
                  <>
                     <span>•</span>
                     <span>Respondido por: {respondidoPor}</span>
                  </>
               )}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
               {titulo || "Não informado"}
            </h3>
         </div>
         <div className="text-gray-700 mb-4">
            <p className="line-clamp-3">{mensagem || "Não informado"}</p>
         </div>

         {perguntaRespondida && resposta && (
            <div className="mt-4 pt-4 border-t border-gray-200">
               <h4 className="text-md font-medium text-gray-800 mb-2">
                  Resposta:
               </h4>
               <p className="text-gray-700">{resposta}</p>
            </div>
         )}
      </div>
   );
};

export default CardPerguntaRespondida;
