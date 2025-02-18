import React, { useState } from "react";
import LupaIcon from "@/svg/icons/LupaIcon";
import BotaoPadrao from "../BotaoPadrao";
import ComponenteInputFiltro from "./ComponenteInputFiltro";
import ComponenteRadioFiltro from "./ComponenteRadioFiltro";
import ComponenteSelectFiltro from "./ComponenteSelectFiltro";

const CompontentePrincipalFiltro = () => {
   const [tipoVenda, setTipoVenda] = useState<"Compra" | "Aluguel">("Compra");
   const [filtroAberto, setFiltroAberto] = useState<boolean>(false);
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

   const cidadesExemplo = ["Corupá", "Jaragua do Sul"];
   const bairrosExemplo = ["Centro", "Rau"];
   const tipoImovelExemplo = ["Casa", "Apartamento"];

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
      <div className={`bg-white w-3/4 rounded-2xl`}>
         <div className={`flex flex-col items-center p-4 2xl:p-8`}>
            <div className="flex items-center justify-center gap-16">
               <p
                  className={`hover:cursor-pointer text-mobilePadrao md:text-1xl xl:text-2xl
               ${
                  tipoVenda === "Compra"
                     ? "text-havprincipal"
                     : "text-cinzaNeutro"
               }`}
                  onClick={() => setTipoVenda("Compra")}
               >
                  Comprar
               </p>
               <p
                  className={`hover:cursor-pointer text-mobilePadrao md:text-1xl xl:text-2xl ${
                     tipoVenda === "Aluguel"
                        ? "text-havprincipal"
                        : "text-cinzaNeutro"
                  }`}
                  onClick={() => setTipoVenda("Aluguel")}
               >
                  Alugar
               </p>
            </div>

            <div className="w-full h-[1px] bg-gray-400 my-2 lg:my-4 xl:mb-8"></div>

            <div
               className="flex px-2 border-b mt-2 pb-1 w-full
            md:border md:border-black md:p-3 md:items-center md:justify-start md:rounded-xl md:w-11/12
            2xl:w-10/12"
            >
               <LupaIcon width={16} height={16} />
               <input
                  type="text"
                  className="ml-2 placeholder:text-mobilePadrao text-xs
                  md:p-1"
                  placeholder="Fale um pouco sobre o imóvel"
               />
            </div>

            {filtroAberto && (
               <div
                  className="flex flex-wrap justify-center max-w-full md:justify-center md:gap-3 mt-3 
               md:mt-5 md:w-10/12 "
               >
                  <div>
                     <p className="mb-2 text-sm text-center xl:text-xl">
                        Preço
                     </p>
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
                  <div
                     className="flex gap-6 max-w-76 justify-center items-center mb-3
                  md:max-w-96 w-72 lg:max-w-fit"
                  >
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

                  <div
                     className="flex flex-col w-full justify-center items-center text-xs gap-3 
                  md:flex-row"
                  >
                     <div className="flex gap-4  justify-center items-center">
                        <ComponenteSelectFiltro
                           onChange={setCidade}
                           opcoes={cidadesExemplo}
                           placeholder="Cidade"
                           selecionado={cidade}
                        />
                        <ComponenteSelectFiltro
                           onChange={setBairro}
                           opcoes={bairrosExemplo}
                           placeholder="Bairro"
                           selecionado={bairro}
                        />
                     </div>
                     <div className="flex justify-center items-center ">
                        <ComponenteSelectFiltro
                           onChange={setTipoImovel}
                           opcoes={tipoImovelExemplo}
                           placeholder="Casa"
                           selecionado={tipoImovel}
                        />
                     </div>
                  </div>
               </div>
            )}

            <div className="flex items-center justify-center gap-4 mt-3 lg:mt-4">
               <BotaoPadrao texto="BUSCAR" />
               <div
                  className="botao bg-gray-100 text-black drop-shadow-xl flex items-center justify-center"
                  onClick={() => setFiltroAberto(!filtroAberto)}
               >
                  <p>FILTROS</p>
               </div>
            </div>
         </div>

         {filtroAberto && (
            <div className="border-t w-full flex items-center justify-center p-2 lg:p-4">
               <p
                  className="cursor-pointer lg:text-xl 2xl:text-2xl"
                  onClick={limparFiltro}
               >
                  Limpar filtros
               </p>
            </div>
         )}
      </div>
   );
};

export default CompontentePrincipalFiltro;
