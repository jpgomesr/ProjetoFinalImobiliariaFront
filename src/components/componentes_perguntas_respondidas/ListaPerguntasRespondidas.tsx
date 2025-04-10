import React, { useEffect, useState } from "react";
import CardPerguntaRespondida from "./CardPerguntaRespondida";
import { buscarPerguntasRespondidas } from "@/app/perguntas-respondidas/action";

interface Pergunta {
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

const ListaPerguntasRespondidas: React.FC = () => {
   const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const carregarPerguntas = async () => {
         try {
            const resultado = await buscarPerguntasRespondidas();

            if (resultado.success) {
               setPerguntas(resultado.data);
            } else {
               throw new Error(
                  resultado.error || "Erro ao carregar perguntas respondidas"
               );
            }
         } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
            setError("Não foi possível carregar as perguntas respondidas");
         } finally {
            setLoading(false);
         }
      };

      carregarPerguntas();
   }, []);

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-havprincipal"></div>
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

   if (perguntas.length === 0) {
      return (
         <div className="text-center p-8">
            <p className="text-gray-500">
               Nenhuma pergunta respondida encontrada.
            </p>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {perguntas.map((pergunta) => (
            <CardPerguntaRespondida key={pergunta.id} {...pergunta} />
         ))}
      </div>
   );
};

export default ListaPerguntasRespondidas;
