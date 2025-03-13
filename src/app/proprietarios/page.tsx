"use client";

import CardUsuario from "@/components/CardUsuario";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import ModalCofirmacao from "@/components/ComponentesCrud/ModalConfirmacao";
import NotificacaoCrud from "@/components/ComponentesCrud/NotificacaoCrud";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import List from "@/components/List";
import SelectPadrao from "@/components/SelectPadrao";
import { buscarProprietarios } from "@/Functions/proprietario/buscaProprietario";
import { UseFetchDelete } from "@/hooks/UseFetchDelete";
import ModelProprietarioListagem from "@/models/ModelProprietarioListagem";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";




const page = () => {

 
   const [status, setStatus] = useState<string>("Ativo");
   const [revalidarQuery, setRevalidarQuery] = useState<boolean>(false);
   const opcoesStatus = [{id: "Ativo", label : "Ativo" }, {id: "Desativado", label : "Desativado" }];
   const [proprietarios, setProprietarios] = useState<ModelProprietarioListagem[] | undefined>([])
   const [nomePesquisa, setNomePesquisa] = useState<string>("");
   const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
   const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
   const [idItemParaDeletar, setIdItemParaDeletar] = useState<number | null>(
         null
      );
   const [itemDeletadoId, setItemDeletadoId] = useState<number | null>(null);
      const [numeroPaginaAtual, setNumeroPaginaAtual] = useState(0);
      const [peageableinfo, setPeageableInfo] = useState({
         totalPaginas: 0,
         ultima: true,
         maximoPaginasVisiveis: 5,
      });

   
      
   
   
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   const setRevalidandoQuery =
      (funcao: (valor: any) => any) => (valor: any) => {
         funcao(valor);
         setRevalidarQuery(!revalidarQuery);
   };

   const adicionarInformacoesPagina = (data: any) => {
      const quantidadePaginas = data.totalPages;
      const ultimaPagina: boolean = data.last;

      setPeageableInfo((prev) => ({
         ...prev,
         totalPaginas: quantidadePaginas,
         ultima: ultimaPagina,
      }));
   };

   
      const renderizarUsuariosApi = async () => {
      
         
         const {conteudoCompleto, proprietariosRenderizados}  = await buscarProprietarios(numeroPaginaAtual,nomePesquisa,status === "Ativo")
         
         adicionarInformacoesPagina(conteudoCompleto)
         setProprietarios(proprietariosRenderizados)
         renderizarProprietariosPagina()
      };
      const deletarUsuario = async () => {
            const response = await UseFetchDelete(
               `${BASE_URL}/proprietarios/${idItemParaDeletar}`
            );
            setItemDeletadoId(idItemParaDeletar);
            setMostrarNotificacao(true);
            setRevalidarQuery(!revalidarQuery);
            setIdItemParaDeletar(null);
         };
      const fechandoNotificacao = () => {
         setMostrarNotificacao(false);
         setItemDeletadoId(null);
      };
      const desfazendoDelete = async () => {
         await fetch(`${BASE_URL}/proprietarios/restaurar/${itemDeletadoId}`, {
            method: "POST",
         });
         setRevalidarQuery(!revalidarQuery);
      };
      const exibirModal = (id: number) => {
         setIdItemParaDeletar(id);
         setModalConfirmacaoAberto(true);
      };

      const renderizarProprietariosPagina = () => {
         return proprietarios?.map((proprietario) => (
            <CardUsuario
               labelPrimeiroValor="E-mail:"
               primeiroValor={proprietario.email}
               labelSegundoValor="Nome:"
               segundoValor={proprietario.nome}
               labelTerceiroValor="Telefone"
               terceiroValor={proprietario.telefone}
               labelQuartoValor="CPF:"
               quartoValor={proprietario.cpf}
               key={proprietario.id}
               id={proprietario.id}
               imagem={proprietario.imagemUrl}
               deletarUsuario={exibirModal}
               linkEdicao={`/proprietarios/edicao/${proprietario.id}`}
            />
         ));
      };

   useEffect(() => {
      renderizarUsuariosApi()
   }, [revalidarQuery]);

   

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Gerenciamento de proprietarios"
               className="w-full"
            >
               <div
                  className="grid grid-cols-1 gap-3 w-full
               md:grid-cols-[1fr_7fr_1fr]
               xl:grid-cols-[1fr_7fr_1fr]   
               "
               >
                    <List
                     mundandoValor={setRevalidandoQuery(setStatus)}
                     opcoes={opcoesStatus}
                     placeholder="Ativo"
                     bordaPreta
                  />
                  <InputPadrao
                     type="text"
                     htmlFor="input-busca-nome"
                     onChange={(e) =>
                        setRevalidandoQuery(setNomePesquisa)(e.target.value)
                     }
                     placeholder="Digite o nome que deseja pesquisar"
                     required={false}
                  />
                  <Link href={"/proprietarios/cadastro"}>
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
               <div
                  className="grid grid-cols-1 gap-4 w-full
               md:mt-2
               lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4
               2xl:mt-6"
               >
               {renderizarProprietariosPagina()}
               </div>
               {peageableinfo.totalPaginas > 0 && (
                  <ComponentePaginacao
                     paginaAtual={numeroPaginaAtual}
                     setPaginaAtual={setRevalidandoQuery(setNumeroPaginaAtual)}
                     totalPaginas={peageableinfo.totalPaginas}
                     maximoPaginasVisiveis={peageableinfo.maximoPaginasVisiveis}
                     ultimaPagina={peageableinfo.ultima}
                  />
               )}
               <ModalCofirmacao
                                 isOpen={modalConfirmacaoAberto}
                                 onClose={() => setModalConfirmacaoAberto(false)}
                                 onConfirm={deletarUsuario}
                                 message="Você realmente deseja desativar este proprietario?"
                              />
                <NotificacaoCrud
                                 message="Desfazer"
                                 isVisible={mostrarNotificacao}
                                 onClose={fechandoNotificacao}
                                 onUndo={desfazendoDelete}
                                 duration={5000}
                              />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
