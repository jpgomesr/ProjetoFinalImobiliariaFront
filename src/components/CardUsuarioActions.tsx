"use client";

import React from "react";
import Link from "next/link";
import { Trash } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CardUsuarioActionsProps {
   id: number;
   linkEdicao: string;
   deletarUsuario: (id: number) => void;
   showTitle?: boolean;
}

const CardUsuarioActions = ({ id, linkEdicao, deletarUsuario, showTitle }: CardUsuarioActionsProps) => {
   const { t } = useLanguage();

   if (showTitle) {
      return <p className="text-sm font-bold lg:text-xl">{t("OwnerManagement.information")}</p>;
   }

   return (
      <div className="flex flex-wrap justify-start max-w-full mt-1 gap-2 text-xs w-full
         md:flex-row md:gap-4 
         lg:justify-center lg:text-sm 2xl:text-base 2xl:max-w-96 2xl:gap-8 2xl:mt-3"
      >
         <div
            className="absolute top-[-10px] right-[-10px] bg-havprincipal p-1 rounded-full cursor-pointer"
            onClick={() => deletarUsuario(id)}
         >
            <Trash className="text-white" />
         </div>

         <Link href={linkEdicao}>
            <button className="bg-white border-black border rounded-md px-2 py-1">
               {t("OwnerManagement.editUser")}
            </button>
         </Link>

         <button
            onClick={() => deletarUsuario(id)}
            className="bg-white border-black border rounded-md px-2 py-1"
         >
            {t("OwnerManagement.sendMessage")}
         </button>
      </div>
   );
};

export default CardUsuarioActions; 