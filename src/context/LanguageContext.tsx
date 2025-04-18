"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ptBR from "@/locales/pt-BR.json";
import enUS from "@/locales/en-US.json";
import esES from "@/locales/es-ES.json";

type Language = "pt-BR" | "en-US" | "es-ES";

interface LanguageContextType {
   language: Language;
   setLanguage: (lang: Language) => void;
   t: (key: string) => string;
}

const translations = {
   "pt-BR": ptBR,
   "en-US": enUS,
   "es-ES": esES,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
   undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
   const [language, setLanguage] = useState<Language>("pt-BR");

   useEffect(() => {
      const savedLanguage = localStorage.getItem("language") as Language;
      const browserLanguage = navigator.language as Language;

      const supportedLanguages: Language[] = ["pt-BR", "en-US", "es-ES"];

      if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
         setLanguage(savedLanguage);
      } else if (supportedLanguages.includes(browserLanguage)) {
         setLanguage(browserLanguage);
      }
   }, []);

   const t = (key: string): string => {
      const keys = key.split(".");
      let value: any = translations[language];

      for (const k of keys) {
         if (value && typeof value === "object") {
            value = value[k];
         } else {
            return key;
         }
      }

      return value || key;
   };

   const handleSetLanguage = (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem("language", lang);
   };

   return (
      <LanguageContext.Provider
         value={{
            language,
            setLanguage: handleSetLanguage,
            t,
         }}
      >
         {children}
      </LanguageContext.Provider>
   );
}

export function useLanguage() {
   const context = useContext(LanguageContext);
   if (context === undefined) {
      throw new Error("useLanguage must be used within a LanguageProvider");
   }
   return context;
}