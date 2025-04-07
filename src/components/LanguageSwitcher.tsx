"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Us, Br, Es } from "react-flags-select";

export default function LanguageSwitcher() {
   const { language, setLanguage } = useLanguage();

   return (
      <div className="flex items-center gap-2">
         <button onClick={() => setLanguage("pt-BR")}>
            <Br className="w-8 h-6 rounded" />
         </button>
         <button onClick={() => setLanguage("en-US")}>
            <Us className="w-8 h-6 rounded" />
         </button>
         <button onClick={() => setLanguage("es-ES")}>
            <Es className="w-8 h-6 rounded" />
         </button>
      </div>
   );
}
