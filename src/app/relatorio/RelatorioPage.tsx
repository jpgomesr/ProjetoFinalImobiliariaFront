"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import RelatorioClient from "./cliente";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";

interface RelatorioPageProps {
  initialData: any;
  graficosData: any;
}

export default function RelatorioPage({ initialData, graficosData }: RelatorioPageProps) {
  const { t } = useLanguage();

  return (
    <FundoBrancoPadrao className="w-full" titulo={t("relatorios.title")}>
      <RelatorioClient 
        initialData={initialData} 
        graficosData={graficosData}
      />
    </FundoBrancoPadrao>
  );
}