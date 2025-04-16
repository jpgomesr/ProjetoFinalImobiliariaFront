"use client";

import { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ClientRelatorioProps {
  children: (t: (key: string) => string) => ReactNode;
}

export default function ClientRelatorio({ children }: ClientRelatorioProps) {
  const { t } = useLanguage();
  return <>{children(t)}</>;
} 