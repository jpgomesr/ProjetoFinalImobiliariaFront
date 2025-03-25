"use client";

import List from "@/components/List";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface FiltrosProps {
   value: string;
   url: string;
   nomeAributo: string;
   opcoes: { id: string; label: string }[];
   width?: string;
   buttonHolder?: string;
}

const ListFiltroPadrao = (props: FiltrosProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [atributoMomento, setAtributoMomento] = useState<string>(
      props.value || ""
   );

   const atualizarURL = (atributo: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (atributo && atributo !== "todos") {
         params.set(props.nomeAributo, atributo);
      } else {
         params.delete(props.nomeAributo);
      }

      router.push(`${props.url}?${params.toString()}`);
   };

   return (
      <List
         opcoes={props.opcoes}
         value={props.value}
         buttonHolder={props.buttonHolder || "Finalidade"}
         mudandoValor={(value) => {
            setAtributoMomento(value);
            atualizarURL(value);
         }}
         width={props.width}
      />
   );
};
export default ListFiltroPadrao;