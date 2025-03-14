import React, { useEffect, useRef, useState } from "react";
import InputPadrao from "./InputPadrao";
import { ModelCorretor } from "@/models/ModelCorretor";
import { UseFormRegisterReturn } from "react-hook-form";

interface CorretorBoxProps {
   corretor: ModelCorretor;
   handle: (e: ModelCorretor) => void;
   isSelected: boolean;
}

const CorretorBox = (props: CorretorBoxProps) => {
   return (
      <div
         onClick={() => props.handle(props.corretor)}
         className={`border border-black/70 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-300 cursor-pointer text-sm sm:text-md
                    ${props.isSelected ? "bg-black" : null}`}
      >
         {props.corretor.nome}
      </div>
   );
};

interface CorretoresBoxSelectProps {
   registerProps: UseFormRegisterReturn;
   arraySelect?: { id: number; nome: string }[];
}

const CorretoresBoxSelect = ({
   registerProps,
   arraySelect,
}: CorretoresBoxSelectProps) => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const [search, setSearch] = useState<string>("");
   const [corretores, setCorretores] = useState<ModelCorretor[]>([]);
   const [selectedValues, setSelectedValues] = useState<
      { id: number; nome: string }[]
   >([]);

   const handleSelectedValuesRender = () => {
      return arraySelect ? arraySelect : [];
   };

   useEffect(() => {
      setSelectedValues(handleSelectedValuesRender);
   }, []);

   const renderizarCorretores = async (): Promise<ModelCorretor[]> => {
      try {
         const response = await fetch(
            `${BASE_URL}/usuarios/corretores-lista-select`,
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
         const proprietarios = await renderizarCorretores();
         setCorretores(proprietarios);
      };

      fetchData();
   }, []);

   const handleAddSelectedValues = (e: ModelCorretor) => {
      if (selectedValues.includes(e)) {
         setSelectedValues((prev) => prev.filter((value) => value !== e));
      } else {
         setSelectedValues((prev) => [...prev, e]);
      }
   };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
   };

   const previousSelectedValuesRef = useRef(selectedValues);

   useEffect(() => {
      const currentIds = selectedValues.map((corretor) => corretor.id);
      const previousIds = previousSelectedValuesRef.current.map(
         (corretor) => corretor.id
      );

      if (!arraysAreEqual(currentIds, previousIds)) {
         registerProps.onChange({
            target: {
               name: registerProps.name,
               value: selectedValues,
            },
         });
         previousSelectedValuesRef.current = selectedValues;
      }
   }, [selectedValues, registerProps]);

   const arraysAreEqual = (arr1: number[], arr2: number[]) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((value, index) => value === arr2[index]);
   };

   return (
      <div className="flex flex-col md:flex-row gap-8 w-full">
         <div className="bg-begeClaroPadrao p-4 gap-3 flex flex-col h-64 w-full rounded-md">
            <InputPadrao
               type="text"
               placeholder="Pesquise o nome do corretor"
               value={search}
               onChange={handleSearchChange}
            />
            <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar">
               {corretores
                  .filter(
                     (cor) =>
                        !search ||
                        cor.nome.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((cor, idx) => (
                     <CorretorBox
                        key={idx}
                        corretor={cor}
                        isSelected={selectedValues.includes(cor)}
                        handle={handleAddSelectedValues}
                     />
                  ))}
            </div>
         </div>

         {/* Exibir os valores selecionados */}
         <div className="w-full h-64 bg-begeClaroPadrao rounded-md">
            <div className="p-4 h-full">
               <h3>Valores selecionados:</h3>
               <div>
                  {selectedValues.map((cor, index) => (
                     <div key={index}>{cor.nome}</div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CorretoresBoxSelect;
