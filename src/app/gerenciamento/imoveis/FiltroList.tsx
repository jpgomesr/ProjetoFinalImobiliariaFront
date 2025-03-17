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
}

const FiltroList = (props: FiltrosProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [finalidadeMomento, setFinalidadeMomento] = useState<string>(props.finalidade);

   const atualizarURL = (finalidade: string) => {
      // Criar nova instância de URLSearchParams com os parâmetros atuais
      const params = new URLSearchParams(searchParams.toString());
      
      // Atualizar ou adicionar o parâmetro de finalidade
      if (finalidade) {
         params.set('finalidade', finalidade);
      } else {
         params.delete('finalidade');
      }

      // Navegar para a nova URL mantendo os outros parâmetros
      router.push(`/gerenciamento/imoveis?${params.toString()}`);
   };

   useEffect(() => {  
      setFinalidadeMomento(props.finalidade);
   }, [props.finalidade]);

   return (
      <List
         opcoes={[
            { id: "venda", label: "Venda" },
            { id: "aluguel", label: "Aluguel" },
         ]}
         buttonHolder="Finalidade"
         mudandoValor={(value) => {
            setFinalidadeMomento(value);
            atualizarURL(value);
         }}

      />
   )
}

export default FiltroList