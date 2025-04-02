"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ComponentePaginacao from "@/components/ComponentePaginacao";
import { useState, useEffect } from "react";

interface PaginacaoHistoricoProps {
   totalPages: number;
   currentPage: number;
}

const PaginacaoHistorico = ({
   totalPages,
   currentPage,
}: PaginacaoHistoricoProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [paginaAtual, setPaginaAtual] = useState(currentPage);

   const setPaginaAtualHandler = (novaPagina: number) => {
      setPaginaAtual(novaPagina);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", novaPagina.toString());
      router.push(`?${params.toString()}`);
   };

   return (
      <ComponentePaginacao
         totalPaginas={totalPages}
         ultimaPagina={paginaAtual === totalPages - 1}
         setPaginaAtual={setPaginaAtualHandler}
         paginaAtual={paginaAtual}
         maximoPaginasVisiveis={5}
      />
   );
};

export default PaginacaoHistorico;
