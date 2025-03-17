"use client";

import { ModelImovelGet } from "@/models/ModelImovelGet";
import CardImovel from "@/components/card/CardImovel";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalConfirmacao from "@/components/ComponentesCrud/ModalConfirmacao";
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";

interface ListarImoveisProps {
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
   };
   precoMinimo?: string;
   precoMaximo?: string;
   metrosQuadradosMinimo?: string;
   metrosQuadradosMaximo?: string;
   quantidadeDeQuartos?: string;
   quantidadeDeVagas?: string;
   cidade?: string;
   bairro?: string;
   tipoImovel?: string;
}

export default function ListarImoveis({
   imoveis,
   pageableInfo,
}: ListarImoveisProps) {
   const [paginaAtual, setPaginaAtual] = useState(0);
   const [modalAberto, setModalAberto] = useState(false);
   const [imovelParaExcluir, setImovelParaExcluir] = useState<number | null>(
      null
   );
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
   const router = useRouter();

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const desfazendoDelete = async () => {
      await fetch(`${BASE_URL}/imoveis/restaurar/${itemDeletadoId}`, {
         method: "POST",
      });
      router.refresh();
   };

   const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

   const handleExcluir = async (id: number) => {
      setImovelParaExcluir(id);
      setModalAberto(true);
   };

   const confirmarExclusao = async () => {
      if (imovelParaExcluir) {
         try {
            setItemDeletadoId(imovelParaExcluir);
            setMostrarNotificacao(true);
            setModalAberto(false);
            router.refresh();
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         } catch (error) {}
      }
      setModalAberto(false);
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
            {imoveis.map((imovel) => (
               <CardImovel
                  key={imovel.id}
                  imovel={imovel}
                  edicao={true}
                  edicaoLink={`/gerenciamento/imoveis/edicao/${imovel.id}`}
                  deletarImovel={() => handleExcluir(imovel.id)}
               />
            ))}
         </div>

         <ComponentePaginacao
            totalPaginas={pageableInfo.totalPaginas}
            ultimaPagina={pageableInfo.ultima}
            setPaginaAtual={setPaginaAtual}
            paginaAtual={paginaAtual}
            maximoPaginasVisiveis={5}
         />

         <ModalConfirmacao
            isOpen={modalAberto}
            onClose={() => setModalAberto(false)}
            onConfirm={confirmarExclusao}
            message="Tem certeza que deseja excluir este imóvel?"
         />
         <NotificacaoCrud
            message="Imóvel excluído com sucesso!"
            isVisible={mostrarNotificacao}
            onClose={() => setMostrarNotificacao(false)}
            onUndo={desfazendoDelete}
         />
      </div>
   );
}
