import React, { useEffect, useState } from "react";

interface DadosResposta {
   nome: string;
   dataResposta: string;
}

interface CardPerguntaRespondidaProps {
   id: string;
   tipoPergunta: string;
   email: string;
   titulo: string;
   mensagem: string;
   data: string;
   resposta: string;
   idAdministrador?: string;
   idEditor?: string;
}

const CardPerguntaRespondida: React.FC<CardPerguntaRespondidaProps> = ({
   id,
   tipoPergunta,
   email,
   titulo,
   mensagem,
   data,
   resposta,
   idAdministrador,
   idEditor,
}) => {
   const [dadosResposta, setDadosResposta] = useState<DadosResposta | null>(
      null
   );
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const carregarDadosResposta = async () => {
         try {
            let url = "";
            if (idAdministrador) {
               url = `${process.env.NEXT_PUBLIC_API_URL}/administradores/${idAdministrador}`;
            } else if (idEditor) {
               url = `${process.env.NEXT_PUBLIC_API_URL}/editores/${idEditor}`;
            }

            if (url) {
               const response = await fetch(url);
               if (!response.ok) {
                  throw new Error("Erro ao carregar dados do respondente");
               }
               const data = await response.json();
               setDadosResposta({
                  nome: data.nome,
                  dataResposta: data.dataResposta,
               });
            }
         } catch (error) {
            console.error("Erro ao carregar dados do respondente:", error);
            setError("Não foi possível carregar os dados do respondente");
         } finally {
            setLoading(false);
         }
      };

      carregarDadosResposta();
   }, [idAdministrador, idEditor]);

   const formatarData = (data: string) => {
      return new Date(data).toLocaleDateString("pt-BR", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-havprincipal"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-center text-red-500 p-4">
            <p>{error}</p>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg shadow-md p-6">
         <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-havprincipal text-white">
               {tipoPergunta === "DUVIDA" ? "Dúvida" : "Sugestão"}
            </span>
            <span className="text-sm text-gray-500">{formatarData(data)}</span>
         </div>

         <h3 className="text-lg font-semibold mb-2">{titulo}</h3>
         <p className="text-gray-600 mb-4">{mensagem}</p>

         <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
               <span className="font-medium text-havprincipal">
                  {dadosResposta?.nome || "Respondente"}
               </span>
               <span className="text-sm text-gray-500">
                  {dadosResposta?.dataResposta
                     ? formatarData(dadosResposta.dataResposta)
                     : formatarData(data)}
               </span>
            </div>
            <p className="text-gray-700">{resposta}</p>
         </div>
      </div>
   );
};

export default CardPerguntaRespondida;
