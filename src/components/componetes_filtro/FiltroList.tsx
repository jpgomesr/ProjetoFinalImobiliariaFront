"use client";

import List from "@/components/List";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface FiltrosProps {
   finalidade?: string;
   precoMinimo?: string;
   precoMaximo?: string;
   metrosQuadradosMinimo?: string;
   metrosQuadradosMaximo?: string;
   quantidadeDeQuartos?: string;
   quantidadeDeVagas?: string;
   cidade?: string;
   bairro?: string;
   tipoImovel?: string;
   value: string;
   url: string;
   opcoes: { id: string; label: string }[];
   width?: string;
   buttonHolder?: string;
}

const FiltroList = (props: FiltrosProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [finalidadeMomento, setFinalidadeMomento] = useState<string>(
      props.finalidade || ""
   );

   const atualizarURL = (finalidade: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (finalidade && finalidade !== "todos") {
         params.set("finalidade", finalidade);
      } else {
         params.delete("finalidade");
      }

      router.push(`${props.url}?${params.toString()}`);
   };

   return (
      <List
         opcoes={props.opcoes}
         value={props.value || "todos"}
         buttonHolder={props.buttonHolder || "Finalidade"}
         mudandoValor={(value) => {
            setFinalidadeMomento(value);
            atualizarURL(value);
         }}
         width={props.width}
      />
   );
};
export default FiltroList;
