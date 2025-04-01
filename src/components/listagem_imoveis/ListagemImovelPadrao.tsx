"use client";
("");
import { ModelImovelGet } from "@/models/ModelImovelGet";
import CardImovel from "@/components/card/CardImovel";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ListarImoveisProps {
   imoveis: ModelImovelGet[];
   pageableInfo: {
      totalPaginas: number;
      ultima: boolean;
   };
}

export default function ListagemImovelPadrao({
   imoveis,
   pageableInfo,
}: ListarImoveisProps) {
   const [paginaAtual, setPaginaAtual] = useState(0);
   const router = useRouter();

   const mudarPagina = (pagina: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("numeroPaginaAtual", pagina.toString());
      router.push(`/imoveis?${params.toString()}`);
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
            {imoveis.map((imovel) => (
               <CardImovel key={imovel.id} imovel={imovel} />
            ))}
         </div>

         <ComponentePaginacao
            totalPaginas={pageableInfo.totalPaginas}
            ultimaPagina={pageableInfo.ultima}
            setPaginaAtual={setPaginaAtual}
            paginaAtual={paginaAtual}
            maximoPaginasVisiveis={5}
         />
      </div>
   );
}
