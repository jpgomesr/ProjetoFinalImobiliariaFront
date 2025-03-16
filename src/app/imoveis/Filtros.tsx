"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Filtros({ filtro }: { filtro: string }) {
   const router = useRouter();
   const [filtroLocal, setFiltroLocal] = useState(filtro);

   const handleSearch = () => {
      router.push(`/imoveis?filtro=${filtroLocal}`);
   };

   return (
      <div className="flex flex-col w-full gap-2 items-left md:flex-row h-full">
         <div className="flex h-full">
            {/* Exemplo de lista de filtros */}
            <select
               value={filtroLocal}
               onChange={(e) => setFiltroLocal(e.target.value)}
            >
               <option value="">Todos</option>
               <option value="compra">Compra</option>
               <option value="aluguel">Aluguel</option>
            </select>
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
               value={filtroLocal}
               onChange={(e) => setFiltroLocal(e.target.value)}
            />
         </div>
         <button
            onClick={handleSearch}
            className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full
                     text-sm py-1 px-2 lg:text-base lg:py-2 lg:px-3 2xl:py-3 2xl:px-4"
         >
            Buscar
         </button>
      </div>
   );
}