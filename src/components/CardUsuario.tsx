"use client";

import React from "react";
import { Trash } from "lucide-react";
import FotoUsuarioDeslogado from "./FotoUsuarioDeslogado";
import Image from "next/image";
import Link from "next/link";
import { obterNomeRole, Roles, RolesDisplay } from "@/models/Enum/Roles";
import { useLanguage } from "@/context/LanguageContext";
import CardUsuarioServer from "./CardUsuarioServer";

interface CardUsuarioProps {
   id: number;
   labelPrimeiroValor: string;
   primeiroValor: string;
   labelSegundoValor: string;
   segundoValor: string;
   labelTerceiroValor: string;
   terceiroValor: string;
   labelQuartoValor: string;
   quartoValor: string | { [key: string]: string } | any;
   imagem?: string;
   linkEdicao: string;
   deletarUsuario: (id: number) => void;
}

const CardUsuario = (props: CardUsuarioProps) => {
   return <CardUsuarioServer {...props} />;
};

export default CardUsuario;
