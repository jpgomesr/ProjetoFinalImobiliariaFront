"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import PerfilIcon from "@/svg/icons/header/PerfilIcon";
import { useLanguage } from "@/context/LanguageContext";

interface PerfilDropdownProps {
   foto?: string;
   id?: string;
   nome?: string;
}

const PerfilDropdown = ({ foto, id, nome }: PerfilDropdownProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const { t } = useLanguage();


   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2"
         >
            {foto ? (
               <Image
                  src={foto}
                  alt="Foto de perfil"
                  width={32}
                  height={32}
                  className="rounded-full w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8 object-cover"
               />
            ) : (
               <User
                  className="w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8 text-white"
                  onClick={() => setIsOpen(!isOpen)}
               />
            )}
            <span className="hidden md:block text-sm">{nome}</span>
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-brancoEscurecido rounded-md shadow-lg py-1 z-50">
               <Link
                  href={`/perfil/${id}`}
                  className="block px-4 py-2 text-sm text-havprincipal hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
               >
                  {t("PerfilOptions.option1")}
               </Link>
               <button
                  onClick={() => {
                     signOut({
                        callbackUrl: `/api/auth/signin?callbackUrl=${window.location.pathname}`,
                     });
                     setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-havprincipal hover:bg-gray-100"
               >
                  {t("PerfilOptions.option2")}
               </button>
            </div>
         )}
      </div>
   );
};

export default PerfilDropdown;
