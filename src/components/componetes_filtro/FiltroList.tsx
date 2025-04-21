"use client";

import List from "@/components/List";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";

interface FiltrosProps {
   defaultValue?: string;
   value: string;
   url: string;
   opcoes: { id: string; label: string }[];
   width?: string;
   buttonHolder?: string;
   nome: string;
   defaultPlaceholder?: string;
   bordaPreta?: boolean;
}

const FiltroList = (props: FiltrosProps) => {
   const { t } = useLanguage();
   const router = useRouter();
   const searchParams = useSearchParams();
   const [valorMomento, setValorMomento] = useState<string>(
      props.value || ""
   );

   const atualizarURL = (valor: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (valor) {
         params.set(`${props.nome   }`, valor);
      } else {
         params.delete(`${props.nome}`);
      }

      router.push(`${props.url}?${params.toString()}`);
   };

   return (
      <List
         opcoes={props.opcoes}
         value={valorMomento || "todos"}
         buttonHolder={props.buttonHolder || t("Finalidade")}
         mudandoValor={(value) => {
            setValorMomento(value);
            atualizarURL(value);
         }}
         width={props.width}
         defaultValue={props.defaultValue}
         defaultPlaceholder={props.defaultPlaceholder}
         bordaPreta={props.bordaPreta ?? false}
      />
   );
};
export default FiltroList;
