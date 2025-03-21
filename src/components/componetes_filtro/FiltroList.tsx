"use client"

import List from '@/components/List'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface FiltrosProps {
   finalidade: string;
   precoMinimo: string;
   precoMaximo: string;
   metrosQuadradosMinimo: string;
   metrosQuadradosMaximo: string;
   quantidadeDeQuartos: string;
   quantidadeDeVagas: string;
   cidade: string;
   bairro: string;
   tipoImovel: string;
   value : string;
   url : string;
}

const FiltroList = (props: FiltrosProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [finalidadeMomento, setFinalidadeMomento] = useState<string>(props.finalidade || "");

   const atualizarURL = (finalidade: string) => {
      // Criar nova instância de URLSearchParams com os parâmetros atuais
      const params = new URLSearchParams(searchParams.toString());
      
      // Atualizar ou adicionar o parâmetro de finalidade
      if (finalidade && finalidade !== "todos") {
         params.set('finalidade', finalidade);
      } else {
         params.delete('finalidade'); // Remove o parâmetro se for "todos"
      }

      // Navegar para a nova URL mantendo os outros parâmetros
      router.push(`${props.url}?${params.toString()}`);
   };

   return (
      <List
         opcoes={[
            { id: "venda", label: "Venda" },
            { id: "aluguel", label: "Aluguel" },
            { id: "todos", label: "Todos" },
         ]}
         value={props.value || "todos"}
         buttonHolder="Finalidade"
         mudandoValor={(value) => {
            setFinalidadeMomento(value);
            atualizarURL(value);
         }}
      />
   )
}

export default FiltroList