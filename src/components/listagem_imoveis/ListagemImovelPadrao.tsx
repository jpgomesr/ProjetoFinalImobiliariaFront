"use client";
("");
import { ModelImovelGet } from "@/models/ModelImovelGet";
import CardImovel from "@/components/card/CardImovel";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalComparacaoImoveis from "../pop-up/ModalComparacaoImoveis";
import BotaoPadrao from "../BotaoPadrao";

interface ListarImoveisProps {
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
      paginaAtual: number;
   };
}

export default function ListagemImovelPadrao({
   imoveis,
   pageableInfo,
}: ListarImoveisProps) {
   const [comparando, setComparando] = useState(false);
   const [imoveisSelecionados, setImoveisSelecionados] = useState<number[]>([]);
   const [modalAberto, setModalAberto] = useState(false);
   const router = useRouter();

   const mudarPagina = (pagina: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("numeroPaginaAtual", pagina.toString());
      router.push(`/imoveis?${params.toString()}`);
   };

   const iniciarComparacao = () => {
      setComparando(true);
      setImoveisSelecionados([]);
   };

   const pararComparacao = () => {
      setComparando(false);
      setImoveisSelecionados([]);
   };

   const selecionarImovel = (imovelId: number) => {
      if (!comparando) return;

      setImoveisSelecionados((prev) => {
         if (prev.includes(imovelId)) {
            return prev.filter((id) => id !== imovelId);
         }
         return [...prev, imovelId];
      });
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="flex gap-4  justify-center md:my-3 xl:my-4 2xl:my-6">
            {!comparando ? (
               <BotaoPadrao
                  texto="Comparar imóveis"
                  onClick={iniciarComparacao}
               />
            ) : (
               <>
                  <BotaoPadrao
                     texto="Parar Comparação"
                     onClick={pararComparacao}
                  />
                  {imoveisSelecionados.length > 0 && (
                     <BotaoPadrao
                        texto="Comparar"
                        onClick={() => setModalAberto(true)}
                     />
                  )}
               </>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
            {imoveis.map((imovel) => (
               <div
                  key={imovel.id}
                  className={`transition-opacity duration-200 cursor-pointer w-full place-items-center ${
                     comparando && !imoveisSelecionados.includes(imovel.id)
                        ? "opacity-30"
                        : ""
                  }`}
                  onClick={() => selecionarImovel(imovel.id)}
               >
                  <CardImovel imovel={imovel} />
               </div>
            ))}
         </div>

         <ComponentePaginacao
            totalPaginas={pageableInfo.totalPaginas}
            ultimaPagina={pageableInfo.ultima}
            setPaginaAtual={mudarPagina}
            paginaAtual={pageableInfo.paginaAtual}
            maximoPaginasVisiveis={5}
         />

         <ModalComparacaoImoveis
            isOpen={modalAberto}
            onClose={() => setModalAberto(false)}
            imoveisIds={imoveisSelecionados}
         />
      </div>
   );
}
