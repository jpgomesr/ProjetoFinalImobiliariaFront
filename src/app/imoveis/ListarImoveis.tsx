"use client";

import CardImovel from "@/components/card/CardImovel";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import Link from "next/link";
import { PlusIcon, Search } from "lucide-react";
import List from "@/components/List";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";

export default function ListarImoveis({
   imoveis,
   peageableInfo,
   paginaAtual,
   totalImoveis,
}: {
   imoveis: any[];
   peageableInfo: any;
   paginaAtual: number;
   totalImoveis: number;
}) {

    const opcoesCompraAluguel = [
        { id: "compra", label: "Compra" },
        { id: "aluguel", label: "Aluguel" },
     ];

   const handlePaginaChange = (novaPagina: number) => {
      window.location.href = `/imoveis?paginaAtual=${novaPagina}`;
   };

   return (
      <div className="flex flex-col w-full gap-2 items-left md:flex-row h-full">
         <div className="flex h-full">
            <List opcoes={opcoesCompraAluguel} />
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
   );
}
