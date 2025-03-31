"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ComponenteInputFiltro from "../pagina_inicial/ComponenteInputFiltro";
import ComponenteRadioFiltro from "../pagina_inicial/ComponenteRadioFiltro";
import List from "@/components/List";

interface FiltroProps {
   precoMinimo: string;
   precoMaximo: string;
   metrosQuadradosMinimo: string;
   metrosQuadradosMaximo: string;
   quantidadeDeQuartos: string;
   quantidadeDeVagas: string;
   cidade: string;
   bairro: string;
   tipoImovel: string;
   finalidade: string;
   url : string;
   bordaPreta?: boolean;
}

const Filtro = (props: FiltroProps) => {
   const router = useRouter();

   const [precoMinimo, setPrecoMinimo] = useState(props.precoMinimo);
   const [precoMaximo, setPrecoMaximo] = useState(props.precoMaximo);
   const [metrosQuadradosMinimo, setMetrosQuadradosMinimo] = useState(
      props.metrosQuadradosMinimo
   );
   const [metrosQuadradosMaximo, setMetrosQuadradosMaximo] = useState(
      props.metrosQuadradosMaximo
   );
   const [quantidadeDeQuartos, setQuantidadeQuartos] = useState(
      props.quantidadeDeQuartos
   );
   const [quantidadeDeVagas, setQuantidadeVagas] = useState(
      props.quantidadeDeVagas
   );
   const [cidade, setCidade] = useState(props.cidade);
   const [bairro, setBairro] = useState(props.bairro);
   const [tipoImovel, setTipoImovel] = useState(props.tipoImovel);
   const [carregandoCidades, setCarregandoCidades] = useState(true);
   const [carregandoBairros, setCarregandoBairros] = useState(false);

   console.log(props.bairro)
   

   const [opcoesCidade, setOpcoesCidade] = useState([
      { id: "", label: "Selecione uma cidade" }
   ]);

   const [opcoesBairro, setOpcoesBairro] = useState([
      { id: "", label: "Selecione um bairro" }
   ]);

   const tipoImovelExemplo = [
      { id: "CASA", label: "Casa" },
      { id: "APARTAMENTO", label: "Apartamento" },
   ];
   const estado = "Santa Catarina";

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   const buscarCidades = async () => {
      try {
         setCarregandoCidades(true);
         const response = await fetch(`${BASE_URL}/enderecos/cidades/${estado}`);

         if (!response.ok) {
            throw new Error("Erro ao carregar cidades");
         }

         const data = await response.json();
         return data as string[];
      } catch (error) {
         console.error("Erro ao buscar cidades:", error);
         return [];
      }
   };

   const buscarBairros = async (cidade: string) => {
      try {
         setCarregandoBairros(true);
         const response = await fetch(`${BASE_URL}/enderecos/bairros/${cidade}`);

         if (!response.ok) {
            throw new Error("Erro ao carregar bairros");
         }

         const data = await response.json();
         return data as string[];
      } catch (error) {
         console.error("Erro ao buscar bairros:", error);
         return [];
      } finally {
         setCarregandoBairros(false);
      }
   };

   const definirOpcoesCidade = async () => {
      const cidades = await buscarCidades();

      if (cidades.length === 0) {
         setOpcoesCidade([{ id: "erro", label: "Erro ao carregar cidades" }]);
         return;
      }

      const opcoesFormatadas = [
         { id: "", label: "Selecione uma cidade" },
         ...cidades.map((cidade) => ({ 
            id: cidade.toLowerCase().replace(/\s+/g, '-'), 
            label: cidade 
         }))
      ];

      setOpcoesCidade(opcoesFormatadas);
      setCarregandoCidades(false);
   };

   const definirOpcoesBairro = async (cidade: string) => {
      if (!cidade || cidade === "") {
         setOpcoesBairro([{ id: "", label: "Selecione um bairro" }]);
         return;
      }

      const bairros = await buscarBairros(cidade);

      const opcoesFormatadas = [
         { id: "", label: "Selecione um bairro" },
         ...bairros.map((bairro) => ({
            id: bairro.replace(/\s+/g, '-'),
            label: bairro
         }))
      ];

      setOpcoesBairro(opcoesFormatadas);
   };

   useEffect(() => {
      const inicializarCidades = async () => {
         await definirOpcoesCidade();
      };
      
      inicializarCidades();
   }, []);

   useEffect(() => {
      definirOpcoesBairro(cidade);
   }, [cidade]);

   const atualizarURL = () => {
      const params = new URLSearchParams({
         precoMinimo,
         precoMaximo,
         metrosQuadradosMinimo,
         metrosQuadradosMaximo,
         quantidadeDeQuartos: quantidadeDeQuartos.toString(),
         quantidadeDeVagas: quantidadeDeVagas.toString(),
         cidade,
         bairro,
         tipoImovel,
         finalidade: props.finalidade,
      });
      router.push(`${props.url}?${params.toString()}`);
   };

   const handlePesquisa = () => {
      atualizarURL();
   };

   const limparFiltro = () => {
      setPrecoMinimo("");
      setPrecoMaximo("");
      setMetrosQuadradosMinimo("");
      setMetrosQuadradosMaximo("");
      setCidade("");
      setBairro("");
      setTipoImovel("");
      setQuantidadeQuartos("");
      setQuantidadeVagas("");
      atualizarURL();
   };

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
                        placeholder="máximo"
                        htmlFor="preco-maximo"
                        label="R$"
                     />
                  </div>
               </div>
               <div>
                  <p className="mb-2 text-sm text-center xl:text-xl">Área</p>
                  <div className="flex justify-center gap-6 mb-3 w-full">
                     <ComponenteInputFiltro
                        tipoInput="number"
                        onChange={setMetrosQuadradosMinimo}
                        valor={metrosQuadradosMinimo}
                        placeholder="mínimo"
                        htmlFor="metros-quadrados-minimo"
                        label="m²"
                     />
                     <ComponenteInputFiltro
                        tipoInput="number"
                        onChange={setMetrosQuadradosMaximo}
                        valor={metrosQuadradosMaximo}
                        placeholder="máximo"
                        htmlFor="metros-quadrados-maximo"
                        label="m²"
                     />
                  </div>
               </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 max-w-76 justify-center items-center w-full">
               <ComponenteRadioFiltro
                  titulo="Vagas"
                  onChange={(value) => setQuantidadeVagas(value.toString())}
                  selecionado={Number(quantidadeDeVagas)}
               />
               <ComponenteRadioFiltro
                  titulo="Dormitório"
                  onChange={(value) => setQuantidadeQuartos(value.toString())}
                  selecionado={Number(quantidadeDeQuartos)}
               />
            </div>
         </div>
         <div className="flex flex-col w-full justify-center items-center text-xs gap-3 md:flex-row mt-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <List
                  opcoes={opcoesCidade}
                  buttonHolder="Cidade"
                  mudandoValor={(value) => {
                     setCidade(value);
                     setBairro("");
                  }}
                  disabled={carregandoCidades}
                  value={cidade}
               />
               <List
                  opcoes={opcoesBairro}
                  buttonHolder="Bairro"
                  mudandoValor={setBairro}
                  value={props.bairro} 
                  disabled={carregandoBairros || !cidade} 
               />
               <List
                  opcoes={tipoImovelExemplo}
                  buttonHolder="Tipo"
                  mudandoValor={setTipoImovel}
               />
            </div>
         </div>
         <div className="flex justify-center mt-4 gap-2">
            <button
               onClick={handlePesquisa}
               className="bg-havprincipal text-white text-xs px-2 py-1 rounded-md
                lg:px-4  lg:py-2 lg:text-sm 
                lg:rounded-md
                2xl:text-base "
            >
               Pesquisar
            </button>
            <button
               onClick={limparFiltro}
               className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md
                md:text-sm md:px-3 md:py-2
                lg:px-4  lg:py-2 
                lg:rounded-md
                2xl:text-base"
            >
               Limpar Filtros
            </button>
         </div>
      </div>
   );
};

export default Filtro;
