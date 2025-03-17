"use client";

import { ModelImovelGet } from "@/models/ModelImovelGet";
import CardImovel from "@/components/card/CardImovel";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { useState } from "react";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
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
   precoMinimo = "0",
   precoMaximo = "0", 
   metrosQuadradosMinimo = "0",
   metrosQuadradosMaximo = "0",
   quantidadeDeQuartos = "0",
   quantidadeDeVagas = "0",
   cidade = "",
   bairro = "",
   tipoImovel = "",
}: ListarImoveisProps) {
   const [paginaAtual, setPaginaAtual] = useState(0);
   const [modalAberto, setModalAberto] = useState(false);
   const [imovelParaExcluir, setImovelParaExcluir] = useState<number | null>(null);
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
   const router = useRouter();


   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
   const desfazendoDelete = async () => {
      await fetch(`${BASE_URL}/imoveis/restaurar/${itemDeletadoId}`, {
         method: "POST",
      });
      router.refresh();
   };
  
     const mudarPagina = (pagina: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("numeroPaginaAtual", pagina.toString());
        router.push(`/usuarios?${params.toString()}`);
     };
     const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(null);
     const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
     const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  
     const exibirModal = (id: number) => {
      setIdItemParaDeletar(id);
      setModalConfirmacaoAberto(true);
   };

   const handleExcluir = async (id: number) => {
      setImovelParaExcluir(id);
      setModalAberto(true);
   };

   const confirmarExclusao = async () => {
      if (imovelParaExcluir) {
         try {
            const response = await fetch(`${BASE_URL}/imoveis/${imovelParaExcluir}`, {
               method: 'DELETE'
            });

            setItemDeletadoId(imovelParaExcluir)
            setMostrarNotificacao(true)
            setModalAberto(false);
            router.refresh();

         } catch (error) {
         }
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
                  edicaoLink={`/imoveis/edicao/${imovel.id}`}
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
