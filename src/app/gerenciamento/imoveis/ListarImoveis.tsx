"use client";

import { ModelImovelGet } from "@/models/ModelImovelGet";
import CardImovel from "@/components/card/CardImovel";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalConfirmacao from "@/components/ComponentesCrud/ModalConfirmacao";
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";



interface ListarImoveisProps {
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
   };
}

const ListarImoveisSession = ({
   imoveis,
   pageableInfo,
}: ListarImoveisProps) => {
   const [paginaAtual, setPaginaAtual] = useState(0);
   const [modalAberto, setModalAberto] = useState(false);
   const [imovelParaExcluir, setImovelParaExcluir] = useState<number | null>(
      null
   );
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
   const router = useRouter();

   const { data: session } = useSession();
   const token = session?.accessToken;

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const desfazendoDelete = async (id: number) => {
      await fetch(`${BASE_URL}/imoveis/restaurar/${id}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
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
            const response = await fetch(
               `${BASE_URL}/imoveis/${imovelParaExcluir}`,
               {
                  method: "DELETE",
                  headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`,
                  },
               }
            );

            if (response.ok) {
               setItemDeletadoId(imovelParaExcluir);
               setMostrarNotificacao(true);
               setModalAberto(false);
               router.refresh();
            } else {
               console.error("Erro ao deletar imóvel");
            }
         } catch (error) {
            console.error("Erro ao deletar imóvel:", error);
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
                  edicaoLink={`/gerenciamento/imoveis/edicao/${imovel.id}`}
                  deletarImovel={() => handleExcluir(imovel.id)}
                  restaurarImovel={() => desfazendoDelete(imovel.id)}
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
            onUndo={() => itemDeletadoId && desfazendoDelete(itemDeletadoId)}
         />
      </div>
   );
};

const ListarImoveis = ({ imoveis, pageableInfo }: ListarImoveisProps) => {
   return (
      <SessionProvider>
         <ListarImoveisSession imoveis={imoveis} pageableInfo={pageableInfo} />
      </SessionProvider>
   );
};

export default ListarImoveis;
