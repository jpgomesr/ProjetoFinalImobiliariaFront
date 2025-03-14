import React, { useState } from "react";
import ComponenteInputFiltro from "../pagina_inicial/ComponenteInputFiltro";
import ComponenteRadioFiltro from "../pagina_inicial/ComponenteRadioFiltro";
import ComponenteSelectFiltro from "../pagina_inicial/ComponenteSelectFiltro";
import List from "@/components/List";

interface FiltroProps {}

const Filtro = (props: FiltroProps) => {
   const [precoMinimo, setPrecoMinimo] = useState<string>("");
   const [precoMaximo, setPrecoMaximo] = useState<string>("");
   const [metrosQuadradosMinimo, setMetrosQuadradosMinimo] =
      useState<string>("");
   const [metrosQuadradosMaximo, setMetrosQuadradosMaximo] =
      useState<string>("");
   const [quantidadeDeQuartos, setQuantidadeQuartos] = useState<number[]>([]);
   const [quantidadeDeVagas, setQuantidadeVagas] = useState<number[]>([]);
   const [cidade, setCidade] = useState<string>("");
   const [bairro, setBairro] = useState<string>("");
   const [tipoImovel, setTipoImovel] = useState<string>("");

   const cidadesExemplo = [
      { id: "corupa", label: "Corupá" },
      { id: "jaragua-do-sul", label: "Jaraguá do Sul" },
   ];
   const bairrosExemplo = [
      { id: "centro", label: "Centro" },
      { id: "rau", label: "Rau" },
   ];
   const tipoImovelExemplo = [
      { id: "casa", label: "Casa" },
      { id: "apartamento", label: "Apartamento" },
   ];

   // Limpa todos os filtros
   function limparFiltro(): void {
      setPrecoMinimo("");
      setPrecoMaximo("");
      setMetrosQuadradosMinimo("");
      setMetrosQuadradosMaximo("");
      setCidade("");
      setBairro("");
      setTipoImovel("");
      setQuantidadeQuartos([]);
      setQuantidadeVagas([]);
   }

   return (
      <div className="w-[60vw] max-w-[800px] h-full border-2 bg-white border-gray-300 rounded-md rounded-tr-none px-4 py-4">
         <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-col lg:flex-row w-full gap-2">
               <div>
                  <p className="mb-2 text-sm text-center xl:text-xl">Preço</p>
                  <div className="flex justify-center gap-6 w-full">
                     <ComponenteInputFiltro
                        tipoInput="number"
                        onChange={setPrecoMinimo}
                        valor={precoMinimo}
                        placeholder="mínimo"
                        htmlFor="preco-minimo"
                        label="R$"
                     />
                     <ComponenteInputFiltro
                        tipoInput="number"
                        onChange={setPrecoMaximo}
                        valor={precoMaximo}
                        placeholder="mínimo"
                        htmlFor="preco-maximo"
                        label="R$"
                     />
                  </div>
               </div>
               <div>
                  <p
                     className="mb-2 text-sm text-center
                     xl:text-xl"
                  >
                     Area
                  </p>

                  <div className="flex justify-center gap-6 mb-3 w-full">
                     <ComponenteInputFiltro
                        tipoInput="number"
                        onChange={setMetrosQuadradosMinimo}
                        valor={metrosQuadradosMinimo}
                        placeholder="mínimo"
                        htmlFor="preco minimo"
                        label="m²"
                     />
                     <ComponenteInputFiltro
                        tipoInput="number"
                        onChange={setMetrosQuadradosMaximo}
                        valor={metrosQuadradosMaximo}
                        placeholder="mínimo"
                        htmlFor="preco minimo"
                        label="m²"
                     />
                  </div>
               </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 max-w-76 justify-center items-center w-full">
               <ComponenteRadioFiltro
                  titulo="Vagas"
                  onChange={setQuantidadeVagas}
                  selecionados={quantidadeDeVagas}
               />
               <ComponenteRadioFiltro
                  titulo="Dormitório"
                  onChange={setQuantidadeQuartos}
                  selecionados={quantidadeDeQuartos}
               />
            </div>
         </div>
         <div
            className="flex flex-col w-full justify-center items-center text-xs gap-3 
                  md:flex-row mt-4"
         >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <List opcoes={cidadesExemplo} buttonHolder="Cidade" />
               <List opcoes={bairrosExemplo} buttonHolder="Bairro" />
               <List opcoes={tipoImovelExemplo} buttonHolder="Tipo" />
            </div>
         </div>
      </div>
   );
};

export default Filtro;
