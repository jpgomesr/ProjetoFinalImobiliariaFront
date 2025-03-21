import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";

interface SearchSingleSelectProps<T extends {}> {
   title?: string;
   differentSize?: string;
   selected?: T;
   mensagemErro?: string;
   url: string;
   method?: string;
   model?: new () => T;
   register: UseFormRegisterReturn;
   startSelected?: T;
}

const SearchSingleSelect = <T extends {}>(
   props: SearchSingleSelectProps<T>
) => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
   const { title, register, url, method = "GET", startSelected } = props;
   const formContext = useFormContext();
   const setValue = formContext?.setValue || (() => {});

   const [selecionado, setSelecionado] = useState<T | null>(startSelected || null);
   const [searchTerm, setSearchTerm] = useState("");
   const [opcoes, setOpcoes] = useState<T[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         const proprietarios = await fetchOptions();
         setOpcoes(proprietarios);
      };

      fetchData();
   }, [url, method]);

   const fetchOptions = async (): Promise<T[]> => {
      try {
         const response = await fetch(`${BASE_URL}${url}`, {
            method,
            headers: { "Content-Type": "application/json" },
         });

         if (!response.ok) throw new Error("Erro ao buscar dados");
         return await response.json();
      } catch (error) {
         console.error("Erro ao carregar opções:", error);
         return [];
      }
   };

   useEffect(() => {
      setValue(
         register.name,
         selecionado ? Number((selecionado as any).id) : 0
      );
   }, [selecionado, register, setValue]);

   const handleSelect = (item: T) => {
      if (item) {
         setSelecionado(item);
         register.onChange({
            target: {
               name: register.name,
               value: Number((item as any).id),
            },
         });
      }
   };

   const handleRemove = () => {
      setSelecionado(null);
      setValue(register.name, 0); // Define 0 para passar na validação de zod
   };

   const filteredOpcoes = opcoes.filter(
      (opc) =>
         (opc as any).nome &&
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
               {filteredOpcoes.map((opc) => (
                  <div
                     key={(opc as any).id}
                     className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
                        selecionado &&
                        (selecionado as any).id === (opc as any).id
                           ? "bg-havprincipal text-white"
                           : "bg-havprincipal/80 text-white"
                     }`}
                     onClick={() => {
                        handleSelect(opc);
                        setSearchTerm("");
                     }}
                  >
                     <div className="truncate">{(opc as any).nome}</div>
                     {selecionado &&
                        (selecionado as any).id === (opc as any).id && (
                           <>
                              <div className="border-l border-white h-3/4" />
                              <Trash2
                                 className="w-4 h-4 cursor-pointer"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
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

export default SearchSingleSelect;
