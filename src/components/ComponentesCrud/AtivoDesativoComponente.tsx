"use client";

import { useState } from "react";

interface AtivoDesativoProps {
   defaultChecked?: boolean;
   onToggle?: (checked: boolean) => void;
   activeColor?: string;
   inactiveColor?: string;
   className?: string;
   label?: string;
   disabled?: boolean;
}

export default function AtivoDesativoComponente({
   defaultChecked = false,
   onToggle,
   activeColor = "bg-havprincipal",
   inactiveColor = "bg-white",
   className = "",
   label,
   disabled = false,
}: AtivoDesativoProps) {
   const [checked, setChecked] = useState(defaultChecked);

   const handleToggle = () => {
      if (disabled) return;

      const newState = !checked;
      setChecked(newState);
      onToggle?.(newState);
   };

   return (
      <div className={`flex items-center gap-2 ${className}`}>
         {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
               {label}
            </label>
         )}
         <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 w-11  cursor-pointer rounded-full border border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
               checked ? activeColor : inactiveColor
            }`}
         >
            <span
               className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform ${
                  checked ? "bg-white translate-x-5" : "bg-black translate-x-0"
               }`}
            />
         </button>
      </div>
   );
}
