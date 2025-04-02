import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ModelPadraoSelect {
   id: number;
   nome: string;
}

interface SearchSelectProps<T> {
   title?: string;
   differentSize?: string;
   selected?: T | T[];
   mensagemErro?: string;
   url: string;
   method?: string;
   model?: new () => T;
   register: UseFormRegisterReturn;
   startSelected?: T | T[];
   isSingle?: boolean;
}

const SearchSelect = <T extends ModelPadraoSelect>(
   props: SearchSelectProps<T>
) => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const {
      title,
      differentSize,
      register,
      url,
      method = "GET",
      startSelected,
      isSingle = false, // Default to multiple selection
   } = props;

   // Initialize state based on isSingle
   const [selecionados, setSelecionados] = useState<T[]>(
      startSelected
         ? Array.isArray(startSelected)
            ? startSelected
            : [startSelected]
         : []
   );
   useEffect(() => {
      console.log(selecionados);
   }, []);

   const [searchTerm, setSearchTerm] = useState("");
   const [opcoes, setOpcoes] = useState<T[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         const response = await fetch(`${BASE_URL}${url}`, {
            method: method,
         });
         if (!response.ok) {
            throw new Error("Erro ao buscar dados");
         }
         const proprietarios = await response.json();
         setOpcoes(proprietarios);
      };

      fetchData();
   }, [url, method]);

   useEffect(() => {
      const valueToSend = isSingle ? selecionados[0] || null : selecionados;
      register.onChange({
         target: {
            name: register.name,
            value: valueToSend,
         },
      });
   }, [selecionados, isSingle]);

   const handleSelect = (item: T) => {
      if (isSingle) {
         setSelecionados([item]);
      } else {
         if (!selecionados.some((i) => i.id === item.id)) {
            setSelecionados((prev) => [...prev, item]);
         }
      }
   };

   const handleRemove = (item: T) => {
      setSelecionados((prev) => prev.filter((i) => i.id !== item.id));
   };

   const filteredOpcoes = opcoes.filter((opc) =>
      (opc as any).nome.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="flex flex-col gap-1 w-1/2 bg-begeEscuroPadrao rounded-md p-2 h-80">
         {title && (
            <div className="flex flex-row justify-start">
               <label className="opacity-90 text-base font-inter lg:rounded-lg 2xl:text-xl 2xl:rounded-xl text-center text-black px-2 font-bold">
                  {title}
               </label>
            </div>
         )}
         <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center border-b border-gray-500">
               <input
                  type="text"
                  className="w-full text-base focus:outline-none rounded-md bg-transparent px-2 py-1"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search className="w-5 h-5 mx-2" />
            </div>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-60 hide-scrollbar">
               {filteredOpcoes.map((opc, key) => (
                  <div
                     key={key}
                     className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
                        selecionados.some((i) => i.id === opc.id)
                           ? "bg-havprincipal text-white"
                           : "bg-havprincipal/80 text-white"
                     }`}
                     onClick={() => handleSelect(opc)}
                  >
                     <div className="truncate">{opc.nome}</div>
                     {selecionados.some((i) => i.id === opc.id) && (
                        <>
                           <div className="border-l border-white h-3/4" />
                           <Trash2
                              className="w-4 h-4 cursor-pointer"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleRemove(opc);
                              }}
                           />
                        </>
                     )}
                  </div>
               ))}
            </div>
            {props.mensagemErro && (
               <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
                  {props.mensagemErro}
               </span>
            )}
         </div>
      </div>
   );
};

export default SearchSelect;
