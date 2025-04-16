"use client";

import FavButton from "../FavBotao";
import CardInfo from "./CardInfo";
import SaibaMaisBotao from "./SaibaMaisBotao";
import { ModelImovelGet } from "../../models/ModelImovelGet";
import { useEffect, useState } from "react";
import CardBanner from "./CardBanner";
import { RotateCcw, Trash } from "lucide-react";
import Image from "next/image";
import Imovel from "@/models/ModelImovel";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/context/NotificationContext";

interface HomeProps {
   imovel: ModelImovelGet | Imovel;
   edicao?: boolean;
   edicaoLink?: string;
   atualizacaoRender?: () => void;
   deletarImovel?: (id: number) => void;
   restaurarImovel?: (id: number) => void;
   width?: string;
}

export default function CardImovel(props: HomeProps) {
   const [isBannerVisible] = useState(props.imovel.banner);
   const [isFavorited, setIsFavorited] = useState(props.imovel.favoritado);

   // Força a renderização quando o estado de favorito mudar
   useEffect(() => {
      // Este efeito será executado sempre que isFavorited mudar
      // Não precisa fazer nada aqui, apenas a dependência no array já força a renderização
   }, [isFavorited]);

   const valor = props.imovel.preco;
   const valorFormatado = valor.toLocaleString("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   });

   let valorPromo;
   let valorPromoFormatado;

   if (props.imovel.precoPromocional) {
      valorPromo = props.imovel.precoPromocional;
      valorPromoFormatado = valorPromo.toLocaleString("pt-BR", {
         style: "decimal",
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      });
   }

   const getImagemCapa = (imovel: ModelImovelGet | Imovel): string => {
      if ("imagens" in imovel) {
         if (Array.isArray(imovel.imagens)) {
            const imagemCapa = imovel.imagens.find((img) => img.imagemCapa);
            return imagemCapa ? imagemCapa.referencia : "";
         } else if (
            imovel.imagens &&
            typeof imovel.imagens === "object" &&
            "imagemPrincipal" in imovel.imagens
         ) {
            const imagemPrincipal = imovel.imagens.imagemPrincipal;
            return typeof imagemPrincipal === "string" ? imagemPrincipal : "";
         }
      }
      return ""; // Fallback para caso não haja imagem
   };

   const cardEdicao = props.edicao ? props.edicao : false;

   const imagemCapa = getImagemCapa(props.imovel);

   // Função para atualizar o estado de favorito
   const atualizarFavorito = (novoEstado: boolean) => {
      setIsFavorited(novoEstado);
   };
   const desabilitado = props.imovel.tipoBanner === "ALUGADO" || props.imovel.tipoBanner === "ADQUIRIDO"

   return (
      <>
         <div
            data-disabled={desabilitado}
            className={`${
               props.width ? props.width : "w-[70%]"
            } h-full min-w-[262.5px] max-w-[305px] rounded-2xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)] relative
                     ${
                        !props.imovel?.permitirDestaque
                           ? "bg-begepadrao"
                           : "bg-havprincipal"
                     } ${desabilitado ? "opacity-50" : ""}`}
         >
            {isBannerVisible && (
               <CardBanner
                  tipo={
                     "tipoBanner" in props.imovel
                        ? props.imovel.tipoBanner
                        : "ADQUIRIDO" // Fallback para Imovel
                  }
               />
            )}
            <div>
               <Image
                  src={imagemCapa || "/images/fallback.jpg"} // Fallback para imagem inválida
                  alt={`${props.imovel.titulo}`}
                  className="w-full max-w-[350px] min-h-44 max-h-44 rounded-t-2xl object-cover"
                  width={1920}
                  height={1080}
               />
            </div>
            <div className="mx-5 mt-4 flex flex-col gap-3">
               <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                     <div className="flex flex-row justify-between w-full pr-1 items-center">
                        <p
                           className={`text-xs font-medium whitespace-nowrap ${
                              !props.imovel.permitirDestaque
                                 ? "text-havprincipal"
                                 : "text-brancoEscurecido"
                           }`}
                        >
                           {props.imovel.finalidade === "VENDA"
                              ? "Venda por"
                              : "Locação por"}
                        </p>
                        {cardEdicao ? (
                           props.imovel.ativo ? (
                              <Trash
                                 className={`${
                                    props.imovel.permitirDestaque
                                       ? "text-brancoEscurecido"
                                       : "text-havprincipal"
                                 } cursor-pointer w-5 h-5`}
                                 onClick={() => {
                                    if (props.deletarImovel) {
                                       props.deletarImovel(props.imovel.id);
                                    }
                                 }}
                              />
                           ) : (
                              <RotateCcw
                                 className={`${
                                    props.imovel.permitirDestaque
                                       ? "text-brancoEscurecido"
                                       : "text-havprincipal"
                                 } cursor-pointer w-5 h-5`}
                                 onClick={() => {
                                    if (props.restaurarImovel) {
                                       props.restaurarImovel(props.imovel.id);
                                    }
                                 }}
                              />
                           )
                        ) : (
                           <SessionProvider>
                              <NotificationProvider>
                                 <FavButton
                                    idImovel={props.imovel.id}
                                    favorited={isFavorited ?? false}
                                    dark={props.imovel.permitirDestaque}
                                    setIsFavorited={setIsFavorited}
                                 />
                              </NotificationProvider>
                           </SessionProvider>
                        )}
                     </div>
                     <div className="flex flex-row justify-between w-full">
                        <div
                           className={`flex flex-row gap-2 items-center w-full ${
                              !props.imovel.permitirDestaque
                                 ? "text-havprincipal"
                                 : "text-brancoEscurecido"
                           }`}
                        >
                           <p
                              className="text-sm font-bold"
                              style={{
                                 textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                              }}
                           >
                              R$
                           </p>
                           <p
                              className="text-base font-bold"
                              style={{
                                 textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                              }}
                           >
                              {props.imovel.precoPromocional
                                 ? valorPromoFormatado
                                 : valorFormatado}
                           </p>
                           {props.imovel.precoPromocional > 0 && (
                              <div
                                 className={`flex gap-1 justify-start items-end w-full text-xs opacity-50 ${
                                    !props.imovel.permitirDestaque
                                       ? "text-havprincipal"
                                       : "text-brancoEscurecido"
                                 }`}
                              >
                                 <div className="line-through flex gap-1 justify-end items-end h-full">
                                    <p
                                       className="font-bold whitespace-nowrap"
                                       style={{
                                          textShadow:
                                             "2px 2px 4px rgba(0, 0, 0, 0.25)",
                                       }}
                                    >
                                       R$
                                    </p>
                                    <p
                                       className="font-bold whitespace-nowrap line-through truncate"
                                       style={{
                                          textShadow:
                                             "2px 2px 4px rgba(0, 0, 0, 0.25)",
                                       }}
                                    >
                                       {props.imovel.precoPromocional
                                          ? valorFormatado
                                          : valorPromoFormatado}
                                    </p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
                  <div>
                     <p
                        className={`text-xs ${
                           !props.imovel.permitirDestaque
                              ? "text-havprincipal"
                              : "text-brancoEscurecido"
                        }`}
                     >
                        {"tipoResidencia" in props.imovel.endereco
                           ? props.imovel.endereco.tipoResidencia
                           : "Residencial"}
                     </p>
                     <CardInfo
                        qtdBanheiros={props.imovel.qtdBanheiros}
                        qtdQuartos={props.imovel.qtdQuartos}
                        qtdVagas={props.imovel.qtdGaragens}
                        metragem={props.imovel.tamanho}
                        dark={props.imovel.permitirDestaque}
                     />
                  </div>
               </div>
               <div
                  className={`text-[0.625rem] flex flex-col gap-1 text-justify ${
                     !props.imovel.permitirDestaque
                        ? "text-havprincipal"
                        : "text-brancoEscurecido"
                  }`}
               >
                  <p>
                     Código:{" "}
                     {"codigo" in props.imovel ? props.imovel.codigo : "N/A"}
                  </p>
                  <div className="flex flex-col gap-1">
                     <p>
                        {props.imovel.endereco.rua},{" "}
                        {props.imovel.endereco.bairro}
                     </p>
                     <p>{props.imovel.endereco.cidade}</p>
                  </div>
                  <p className=" h-[45px] overflow-hidden line-clamp-3 w-full">
                     {props.imovel.descricao}
                  </p>
               </div>
               <div className="flex justify-center pb-5 items-center gap-2">
                  <Link href={`/imovel/${props.imovel.id}`}>
                     <SaibaMaisBotao
                        codigo={
                           "codigo" in props.imovel ? props.imovel.codigo : 0
                        }
                        dark={props.imovel.permitirDestaque}
                     />
                  </Link>
                  {cardEdicao ? (
                     <Link href={props.edicaoLink || ""}>
                        <button
                           className={`text-sm px-4 py-2 ${
                              props.imovel.permitirDestaque
                                 ? "bg-brancoEscurecido text-havprincipal font-bold"
                                 : "bg-havprincipal text-white "
                           } rounded-md`}
                        >
                           Editar
                        </button>
                     </Link>
                  ) : null}
               </div>
            </div>
         </div>
      </>
   );
}
