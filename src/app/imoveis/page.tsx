"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import CardImovel from "@/components/card/CardImovel";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React, { useEffect, useState } from "react";
import { PlusIcon, Search } from "lucide-react";
import List from "@/components/List";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import Link from "next/link";
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";
import ModalCofirmacao from "@/components/ComponentesCrud/ModalConfirmacao";

const page = () => {
   const [imoveis, setImoveis] = useState<ModelImovelGet[]>([]);
   const [paginaAtual, setPaginaAtual] = useState(0);
   const [peageableInfo, setPeageableInfo] = useState({
      totalPaginas: 0,
      ultima: true,
   });
   const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

   const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(
      null
   );
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);

   const fechandoNotificacao = () => {
      setMostrarNotificacao(false);
      setItemDeletadoId(null);
   };
   const desfazendoDelete = async () => {
      await fetch(`${BASE_URL}/imoveis/restaurar/${itemDeletadoId}`, {
         method: "POST",
      });
      setRevalidarQuery(!revalidarQuery);
   };
   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
   const exibirModal = (id: number) => {
      setIdItemParaDeletar(id);
      setIsModalVisible(true);
   };

   const [revalidarQuery, setRevalidarQuery] = useState<boolean>(false);
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   useEffect(() => {
      handleRenderImoveis();
      console.log(paginaAtual);
   }, [revalidarQuery]);

   const handleRenderImoveis = () => {
      try {
         const buscarImovel = async () => {
            try {
               const response = await fetch(
                  `${BASE_URL}/imoveis?page=${paginaAtual}&ativo=true`
               );
               if (response.ok) {
                  const imoveis = await response.json();
                  console.log(imoveis);

                  setImoveis(imoveis.content);
                  setPeageableInfo({
                     totalPaginas: imoveis.totalPages,
                     ultima: imoveis.last,
                  });
               } else {
                  console.error("Erro ao buscar os dados do imóvel");
               }
            } catch (error) {
               console.error("Erro ao buscar os dados do imóvel:", error);
            }
         };

         buscarImovel();
      } catch (error) {
         console.log(error);
      }
   };

   const setRevalidandoQuery =
      (funcao: (valor: any) => any) => (valor: any) => {
         funcao(valor);
         setRevalidarQuery(!revalidarQuery);
      };

   const opcoes = [
      { id: "compra", label: "Compra" },
      { id: "aluguel", label: "Aluguel" },
   ];

   const qtdEncontrados = 100;

   const handleDeleteImovel = async () => {
      try {
         const response = await fetch(
            `${BASE_URL}/imoveis/${idItemParaDeletar}`,
            {
               method: "DELETE",
            }
         );

         if (response.ok) {
            console.log("Imóvel deletado com sucesso!");
            setItemDeletadoId(idItemParaDeletar);
            setMostrarNotificacao(true);
            setRevalidarQuery(!revalidarQuery);
            setIdItemParaDeletar(null);
         } else {
            console.error("Erro ao deletar o imóvel:", response.statusText);
         }
      } catch (error) {
         console.error("Erro ao deletar o imóvel:", error);
      }
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               className="w-full"
               titulo="Gerenciador de imóveis"
            >
               <div className="flex flex-col w-full gap-2 items-left md:flex-row h-full">
                  <div className="flex h-full">
                     <List opcoes={opcoes} />
                  </div>
                  <div
                     className="flex flex-row items-center px-2 py-1 gap-2 rounded-md border-2 border-gray-300 
                              bg-white w-full min-h-full min-w-1"
                  >
                     <Search className="w-5" />
                     <input
                        type="text"
                        className="focus:outline-none min-w-1 bg-white placeholder:text-gray-500"
                        placeholder="Pesquise aqui"
                     />
                  </div>
                  <div className="flex flex-row-reverse md:flex-row justify-between gap-2 min-h-full">
                     <div className="w-36 min-h-full">
                        <ButtonFiltro />
                     </div>
                     <Link href={"/imoveis/cadastro"}>
                        <button
                           className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full
                           text-sm py-1 px-2
                           lg:text-base lg:py-2 lg:px-3
                           2xl:py-3 2xl:px-4"
                        >
                           Adicionar <PlusIcon className="w-4" />
                        </button>
                     </Link>
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row">
                  <p className="text-sm">
                     {qtdEncontrados} imóveis encontrados
                  </p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imoveis.map((imovel, index) => (
                     <div
                        className="flex justify-center items-center"
                        key={index}
                     >
                        <CardImovel
                           imovel={imovel}
                           edicao={true}
                           edicaoLink={`/imoveis/edicao/${imovel.id}`}
                           atualizacaoRender={handleRenderImoveis}
                           deletarImovel={exibirModal}
                        />
                     </div>
                  ))}
               </div>
               {/* Paginação */}
               {peageableInfo.totalPaginas > 0 && (
                  <ComponentePaginacao
                     paginaAtual={paginaAtual}
                     setPaginaAtual={setRevalidandoQuery(setPaginaAtual)}
                     totalPaginas={peageableInfo.totalPaginas}
                     maximoPaginasVisiveis={5}
                     ultimaPagina={peageableInfo.ultima}
                  />
               )}
               <NotificacaoCrud
                  message="Desfazer"
                  isVisible={mostrarNotificacao}
                  onClose={fechandoNotificacao}
                  onUndo={desfazendoDelete}
                  duration={5000}
               />
               <ModalCofirmacao
                  isOpen={isModalVisible}
                  onClose={() => setIsModalVisible(false)}
                  onConfirm={handleDeleteImovel}
                  message="Você realmente deseja remover este imóvel?"
               />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
