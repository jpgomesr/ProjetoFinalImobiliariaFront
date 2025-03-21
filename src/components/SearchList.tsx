import { useState, useEffect, useMemo } from "react";
import { Trash2, Search } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface SearchListProps<T> {
   title?: string;
   differentSize?: string;
   registerProps: UseFormRegisterReturn;
   selected?: number | number[]; // Alterado para suportar múltiplos selecionados
   mensagemErro?: string;
   url: string;
   method?: string;
   model?: new () => T;
   selecaoMultipla?: boolean;
}

const SearchList = <T extends {}>(props: SearchListProps<T>) => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const {
      title,
      differentSize,
      registerProps: initialRegisterProps,
      url,
      selecaoMultipla = false,
      method = "GET",
   } = props;
   const [selecionados, setSelecionados] = useState<number[]>([]); // Alterado para um array de selecionados
   const [searchTerm, setSearchTerm] = useState("");
   const [opcoes, setOpcoes] = useState<T[]>([]); // Removido dados mockados

   const handleSelecionadoRender = () => {
      return Array.isArray(props.selected)
         ? props.selected.filter((id): id is number => id !== undefined)
         : [props.selected].filter((id): id is number => id !== undefined);
   };

   useEffect(() => {
      setSelecionados(handleSelecionadoRender());
   }, [props.selected]);

   const renderizarProprietarios = async (): Promise<T[]> => {
      const response = await fetch(`${BASE_URL}${url}`, {
         method: method,
      });
      if (!response.ok) {
         throw new Error("Erro ao buscar dados");
      }
      return await response.json();
   };

   useEffect(() => {
      const fetchData = async () => {
         const proprietarios = await renderizarProprietarios();
         setOpcoes(proprietarios);
      };

      fetchData();
   }, [url, method]);

   const memoizedRegisterProps = useMemo(
      () => initialRegisterProps,
      [initialRegisterProps]
   );

   useEffect(() => {
      if (selecionados.length > 0) {
         memoizedRegisterProps.onChange({
            target: {
               name: memoizedRegisterProps.name,
               value: selecionados,
            },
         });
      }
   }, [selecionados]);

   const handleSelect = (id: number) => {
      if (selecaoMultipla) {
         setSelecionados((prev) =>
            prev.includes(id)
               ? prev.filter((item) => item !== id)
               : [...prev, id]
         );
      } else {
         setSelecionados([id]);
      }
   };

   const handleRemove = (id: number) => {
      setSelecionados((prev) => prev.filter((item) => item !== id));
   };

   const filteredOpcoes = opcoes.filter((opc) =>
      (opc as any).nome.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="flex flex-col gap-1 w-1/2 bg-begeEscuroPadrao rounded-md p-2 h-80">
         {title && (
            <div className="flex flex-row justify-start">
               <label
                  className="opacity-90 text-base font-inter lg:rounded-lg 2xl:text-xl 
                              2xl:rounded-xl text-center text-black px-2 font-bold"
               >
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
               {filteredOpcoes.map((opc) => (
                  <div
                     key={(opc as any).id}
                     className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
                        selecionados.includes((opc as any).id)
                           ? "bg-havprincipal text-white"
                           : "bg-havprincipal/80 text-white"
                     }`}
                     onClick={() => handleSelect((opc as any).id)}
                  >
                     <div className="truncate">{(opc as any).nome}</div>
                     {selecionados.includes((opc as any).id) && (
                        <>
                           <div className="border-l border-white h-3/4" />
                           <Trash2
                              className="w-4 h-4 cursor-pointer"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleRemove((opc as any).id);
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

export default SearchList;
