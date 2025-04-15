"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ButtonFiltroProps {
   onClick: () => void;
   className?: string;
}

export default function ButtonFiltro({ onClick, className }: ButtonFiltroProps) {
   const { t } = useLanguage();

   return (
      <button
         onClick={onClick}
         className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-havprincipal text-white hover:bg-opacity-90 ${className}`}
      >
         <span>{t("property.filters.title")}</span>
      </button>
   );
}
