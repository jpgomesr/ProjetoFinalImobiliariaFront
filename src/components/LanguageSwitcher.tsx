"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Us, Br, Es } from "react-flags-select";

type Language = "pt-BR" | "en-US" | "es-ES";

export default function LanguageSwitcher() {
   const { language, setLanguage } = useLanguage();
   const [isOpen, setIsOpen] = useState(false);

   const languages = [
      { code: "pt-BR" as Language, name: "Português", flag: <Br className="w-8 h-6 rounded" /> },
      { code: "en-US" as Language, name: "English", flag: <Us className="w-8 h-6 rounded" /> },
      { code: "es-ES" as Language, name: "Español", flag: <Es className="w-8 h-6 rounded" /> }
   ];

   const currentLanguage = languages.find(lang => lang.code === language);

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-md"
         >
            {currentLanguage?.flag}
            <span className="text-sm font-medium">{currentLanguage?.name}</span>
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
               {languages.map((lang) => (
                  <button
                     key={lang.code}
                     onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                     }}
                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                     {lang.flag}
                     <span>{lang.name}</span>
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}