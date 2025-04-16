"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import HeaderVermelho from "./HeaderVermelho";
import { Roles } from "@/models/Enum/Roles";

interface ClientLanguageProviderProps {
   role?: Roles;
   id?: string;
   foto?: string | null;
   nome?: string;
}

const ClientLanguageProvider = ({
   role,
   id,
   foto,
   nome,
}: ClientLanguageProviderProps) => {
   const { t } = useLanguage();

   return <HeaderVermelho role={role} id={id} foto={foto} nome={nome} t={t} />;
};

export default ClientLanguageProvider;
