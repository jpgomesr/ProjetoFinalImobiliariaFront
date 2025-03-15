import { useState, useEffect, useMemo } from "react";
import { ChevronDown, CheckCircle } from "lucide-react";
import { ModelProprietarioList } from "@/models/ModelProprietarioList";
import { UseFormRegisterReturn } from "react-hook-form";

interface SearchListProps {
   title?: string;
   differentSize?: string;
   registerProps: UseFormRegisterReturn;
   selected?: number;
   mensagemErro?: string;
}

const SearchList = (props: SearchListProps) => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const { title, differentSize, registerProps: initialRegisterProps } = props;
   const [selecionado, setSelecionado] = useState<number | undefined>(
      undefined
   );
   const [aberto, setAberto] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [opcoes, setOpcoes] = useState<ModelProprietarioList[]>([]);

   const handleSelecionadoRender = () => {
      return props.selected ? props.selected : undefined;
   };

   useEffect(() => {
      setSelecionado(handleSelecionadoRender);
   }, []);

   const renderizarProprietarios = async (): Promise<
      ModelProprietarioList[]
   > => {
      try {
         const response = await fetch(
            `${BASE_URL}/proprietarios/lista-select`,
            {
               method: "GET",
            }
         );

         if (response.ok) {
            return await response.json();
         } else {
            throw new Error("Erro ao buscar os dados");
         }
      } catch (error) {
         console.error(error);
         return [];
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         const proprietarios = await renderizarProprietarios();
         setOpcoes(proprietarios);
      };

      fetchData();
   }, []);

   const memoizedRegisterProps = useMemo(
      () => initialRegisterProps,
      [initialRegisterProps]
   );

   useEffect(() => {
      if (selecionado !== undefined || props.selected) {
         memoizedRegisterProps.onChange({
            target: {
               name: memoizedRegisterProps.name,
               value: selecionado,
            },
         });
      }
   }, [selecionado]);

   const handleSelect = (id: number) => {
      setSelecionado(id);
      setAberto(false);
   };

   const sortedOpcoes = [
      opcoes.find((opc) => opc.id === selecionado),
      ...opcoes.filter((opc) => opc.id !== selecionado),
   ].filter((opc): opc is ModelProprietarioList => opc !== undefined);

   return (
      <div className="flex flex-row items-center gap-3">
         <div className="flex flex-col">
            <div
               className={`relative h-full max-w-24 min-w-24 w-24 
                    md:max-w-32 md:min-w-32 md:w-32 
                    lg:gap-1 2xl:gap-2 flex flex-col`}
            >
               {title && (
                  <label className="opacity-90 text-xs font-montserrat md:text-sm lg:text-base lg:rounded-lg 2xl:text-xl 2xl:rounded-xl">
                     {title}
                  </label>
               )}
               <div
                  className={`border-black border-[1px] rounded-md bg-white shadow-sm 
                      cursor-pointer h-full ${
                         aberto ? "rounded-bl-none rounded-br-none" : ""
                      }`}
                  onClick={() => setAberto(!aberto)}
               >
                  <div
                     className={`flex items-center justify-between px-2 py-1 gap-2 h-full border
                        border-transparent ${differentSize}`}
                  >
                     <input
                        type="text"
                        className="w-full text-xs focus:outline-none"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                     <ChevronDown
                        className={`transition-transform min-w-4 max-w-4 w-4 ${
                           aberto ? "rotate-180" : ""
                        }`}
                     />
                  </div>
                  {aberto && (
                     <div className="absolute left-0 right-0 z-10 bg-white border-t-0 rounded-b-md shadow-md">
                        {sortedOpcoes
                           .filter(
                              (opc) =>
                                 !searchTerm ||
                                 opc.nome
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                           )
                           .map((opc, index, arr) => (
                              <div
                                 key={opc.id}
                                 className={`text-xs px-2 py-1 cursor-pointer hover:bg-gray-100 
                               border-black border-l border-r
                               ${index === 0 ? "border-t rounded-t-none" : ""}
                               ${
                                  index === arr.length - 1
                                     ? `rounded-b-md border-b`
                                     : ""
                               }
                               ${
                                  index > 0 && index < arr.length - 1
                                     ? "border-t border-b-none"
                                     : ""
                               }
                               ${
                                  index == arr.length - 2 && arr.length > 3
                                     ? "border-b"
                                     : ""
                               }
                               ${
                                  index == arr.length - 1 && arr.length == 3
                                     ? "border-t"
                                     : ""
                               }`}
                                 onClick={() => handleSelect(opc.id)}
                              >
                                 <div className="flex flex-row justify-between items-center gap-1">
                                    <div className="truncate">{opc.nome}</div>
                                    {opc.id === selecionado && (
                                       <CheckCircle className="text-green-500 w-3 min-w-3 max-w-3 h-full" />
                                    )}
                                 </div>
                              </div>
                           ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
         {props.mensagemErro && (
            <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
               {props.mensagemErro}
            </span>
         )}
      </div>
   );
};

export default SearchList;
