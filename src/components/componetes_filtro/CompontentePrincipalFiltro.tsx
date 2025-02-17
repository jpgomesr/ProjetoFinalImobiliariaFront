import React, { useState } from "react";
import LupaIcon from "@/svg/icons/LupaIcon";
import BotaoPadrao from "../BotaoPadrao";
import ComponenteInputFiltro from "./ComponenteInputFiltro";
import ComponenteRadioFiltro from "./ComponenteRadioFiltro";
import ComponenteSelectFiltro from "./ComponenteSelectFiltro";

const CompontentePrincipalFiltro = () => {
   const [tipoVenda, setTipoVenda] = useState<"Compra" | "Aluguel">("Compra");
   const [filtroAberto, setFiltroAberto] = useState<boolean>(false);
   const [precoMinimo, setPrecoMinimo] = useState<string>("")
   const [precoMaximo, setPrecoMaximo] = useState<string>("")
   const [metrosQuadradosMinimo, setMetrosQuadradosMinimo] = useState<string>("")
   const [metrosQuadradosMaximo, setMetrosQuadradosMaximo] = useState<string>("")
   const [quantidadeDeQuartos, setQuantidadeQuartos] = useState<number[]>([]);
   const [quantidadeDeVagas, setQuantidadeVagas] = useState<number[]>([]);
   const [cidade, setCidade] = useState<string>() 
   const [bairro, setBairro] = useState<string>() 
   const [tipoImovel, setTipoImovel] = useState<string>();

   const cidadesExemplo = ['Corupá', 'Jaragua do Sul']
   const bairrosExemplo = ['Centro', 'Rau']
   const tipoImovelExemplo = ['Casa', 'Apartamento']

   
   function limparFiltro() : void {

      setPrecoMinimo("")
      setPrecoMaximo("")
      setMetrosQuadradosMinimo("")
      setMetrosQuadradosMaximo("")
      setCidade("")
      setBairro("")
      setTipoImovel("")
   }


   return (
      <div className={`bg-white w-3/4 rounded-2xl`}>
      <div 
         className={`flex flex-col items-center  p-4`}
      >
         <div className="flex items-center justify-center gap-16">
            <p
               className={`hover:cursor-pointer text-mobilePadrao
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
               className={`hover:cursor-pointer text-mobilePadrao ${
                  tipoVenda === "Aluguel"
                     ? "text-havprincipal"
                     : "text-cinzaNeutro"
               }`}
               onClick={() => setTipoVenda("Aluguel")}
            >
               Alugar
            </p>
         </div>

         <div className="w-full h-[1px] bg-gray-400 my-2"></div>

         <div className="flex px-2 border-b mt-2  pb-1 w-full">
            <LupaIcon width={16} height={16} />
            <input
               type="text"
               className="ml-2 placeholder:text-mobilePadrao text-xs"
               placeholder="Fale um pouco sobre o imóvel"
            />
         </div>

         {filtroAberto && (
            <>
               <p className="mb-2 text-sm">Preço</p>
            <div className="flex justify-center gap-6">
               <ComponenteInputFiltro tipoInput="number" onChange={setPrecoMinimo} valor={precoMinimo} placeholder="mínimo" htmlFor="preco-minimo" label="R$"/>
               <ComponenteInputFiltro tipoInput="number" onChange={setPrecoMaximo} valor={precoMaximo} placeholder="mínimo" htmlFor="preco-maximo" label="R$"/>
            </div>
               <p className="my-2 text-sm">Area</p>
            <div className="flex justify-center gap-6 mb-3">
               <ComponenteInputFiltro tipoInput="number" onChange={setMetrosQuadradosMinimo} valor={metrosQuadradosMinimo} placeholder="mínimo" htmlFor="preco minimo" label="m²"/>
               <ComponenteInputFiltro tipoInput="number" onChange={setMetrosQuadradosMaximo} valor={metrosQuadradosMaximo} placeholder="mínimo" htmlFor="preco minimo" label="m²"/>
            </div>
            <div className="flex w-full text-xs">
               <div className="flex-1 flex flex-col gap-2">
                <ComponenteRadioFiltro titulo="Vagas" onChange={setQuantidadeVagas}/>
                <ComponenteRadioFiltro titulo="Dormitório" onChange={setQuantidadeQuartos}/>
               </div>
               <div className="flex-1">
                  <p>Filtros</p>
                  <div className="flex flex-col gap-4">
                     <ComponenteSelectFiltro onChange={setCidade} opcoes={cidadesExemplo} placeholder="Cidade"/> 
                     <ComponenteSelectFiltro onChange={setBairro} opcoes={bairrosExemplo} placeholder="Bairro"/> 
                  </div>
               </div>
            </div>
            <div className="mt-2">
               <ComponenteSelectFiltro onChange={setTipoImovel} placeholder="Casa" opcoes={tipoImovelExemplo}/>
            </div>
            

            </>
         )}

         <div className="flex items-center justify-center gap-4 mt-3">
            <BotaoPadrao texto="BUSCAR" />
            <div
               className="botao bg-gray-100 text-black drop-shadow-xl flex items-center justify-center"
               onClick={() => setFiltroAberto(!filtroAberto)}
            >
               <p>FILTROS</p>
            </div>
         </div>
      </div>

         {
            filtroAberto && (
               <div className="border-t w-full flex items-center justify-center p-2">
                  <p className="cursor-pointer" onClick={limparFiltro}>Limpar filtros</p>
               </div>
            )
         }
      </div>
   );
};

export default CompontentePrincipalFiltro;
