"use client";

import React, { useState, useEffect } from "react";
import BotaoPadrao from "../../BotaoPadrao";
import ComponenteInputFiltro from "./ComponenteInputFiltro";
import ComponenteRadioFiltro from "./ComponenteRadioFiltro";
import List from "@/components/List";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ComponentePrincipalFiltroProps {
   initialFinalidade?: string;
   initialPrecoMinimo?: string;
   initialPrecoMaximo?: string;
   initialMetrosQuadradosMinimo?: string;
   initialMetrosQuadradosMaximo?: string;
   initialQuantidadeDeQuartos?: string;
   initialQuantidadeDeVagas?: string;
   initialCidade?: string;
   initialBairro?: string;
   initialTipoImovel?: string;
   onSearch?: (filtros: Record<string, string>) => void;
}

const CompontentePrincipalFiltro = ({
   initialFinalidade = "Venda",
   initialPrecoMinimo = "",
   initialPrecoMaximo = "",
   initialMetrosQuadradosMinimo = "",
   initialMetrosQuadradosMaximo = "",
   initialQuantidadeDeQuartos = "",
   initialQuantidadeDeVagas = "",
   initialCidade = "",
   initialBairro = "",
   initialTipoImovel = "CASA",
   onSearch,
}: ComponentePrincipalFiltroProps) => {
   const router = useRouter();
   const searchParams = useSearchParams();

   const [tipoVenda, setTipoVenda] = useState<"venda" | "aluguel">(
      initialFinalidade === "aluguel" ? "aluguel" : "venda"
   );
   const [filtroAberto, setFiltroAberto] = useState<boolean>(false);
   const [precoMinimo, setPrecoMinimo] = useState<string>(initialPrecoMinimo);
   const [precoMaximo, setPrecoMaximo] = useState<string>(initialPrecoMaximo);
   const [metrosQuadradosMinimo, setMetrosQuadradosMinimo] = useState<string>(
      initialMetrosQuadradosMinimo
   );
   const [metrosQuadradosMaximo, setMetrosQuadradosMaximo] = useState<string>(
      initialMetrosQuadradosMaximo
   );
   const [quantidadeDeQuartos, setQuantidadeQuartos] = useState<number | null>(
      initialQuantidadeDeQuartos ? Number(initialQuantidadeDeQuartos) : null
   );
   const [quantidadeDeVagas, setQuantidadeVagas] = useState<number | null>(
      initialQuantidadeDeVagas ? Number(initialQuantidadeDeVagas) : null
   );
   const [cidade, setCidade] = useState<string>(initialCidade);
   const [bairro, setBairro] = useState<string>(initialBairro);
   const [tipoImovel, setTipoImovel] = useState<string>(initialTipoImovel);
   const [imovelDescTitulo, setimovelDescTitulo] = useState<string>("");

   // Estados de carregamento
   const [carregandoCidades, setCarregandoCidades] = useState(true);
   const [carregandoBairros, setCarregandoBairros] = useState(false);

   // Estados para opções
   const [opcoesCidade, setOpcoesCidade] = useState([
      { id: "", label: "Selecione uma cidade" },
   ]);

   const [opcoesBairro, setOpcoesBairro] = useState([
      { id: "", label: "Selecione um bairro" },
   ]);

   const tipoImovelExemplo = [
      { id: "CASA", label: "Casa" },
      { id: "APARTAMENTO", label: "Apartamento" },
   ];

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const estado = "Santa Catarina";

   const buscarCidades = async () => {
      try {
         setCarregandoCidades(true);
         const response = await fetch(
            `${BASE_URL}/enderecos/cidades/${estado}`
         );

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
         const response = await fetch(
            `${BASE_URL}/enderecos/bairros/${cidade}`
         );

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
            id: cidade.toLowerCase().replace(/\s+/g, "-"),
            label: cidade,
         })),
      ];

      setOpcoesCidade(opcoesFormatadas);
      setCarregandoCidades(false);
   };

   const definirOpcoesBairro = async (cidade: string) => {
      // Resetar o bairro e as opções quando mudar de cidade
      setBairro("");
      setOpcoesBairro([{ id: "", label: "Selecione um bairro" }]);

      if (!cidade || cidade === "") {
         return;
      }

      const bairros = await buscarBairros(cidade);

      const opcoesFormatadas = [
         { id: "", label: "Selecione um bairro" },
         ...bairros.map((bairro) => ({
            id: bairro.replace(/\s+/g, "-"),
            label: bairro,
         })),
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

   // Usando useEffect para sincronizar o estado com os parâmetros da URL quando a página carrega
   useEffect(() => {
      if (searchParams) {
         const finalidade = searchParams.get("finalidade");
         if (finalidade === "Aluguel") setTipoVenda("aluguel");
         else if (finalidade === "Venda") setTipoVenda("venda");

         const precoMin = searchParams.get("precoMinimo");
         if (precoMin) setPrecoMinimo(precoMin);

         const precoMax = searchParams.get("precoMaximo");
         if (precoMax) setPrecoMaximo(precoMax);

         const metrosMin = searchParams.get("metrosQuadradosMinimo");
         if (metrosMin) setMetrosQuadradosMinimo(metrosMin);

         const metrosMax = searchParams.get("metrosQuadradosMaximo");
         if (metrosMax) setMetrosQuadradosMaximo(metrosMax);

         const quartos = searchParams.get("quantidadeDeQuartos");
         if (quartos) setQuantidadeQuartos(Number(quartos));

         const vagas = searchParams.get("quantidadeDeVagas");
         if (vagas) setQuantidadeVagas(Number(vagas));

         const cidadeParam = searchParams.get("cidade");
         if (cidadeParam) setCidade(cidadeParam);

         const bairroParam = searchParams.get("bairro");
         if (bairroParam) setBairro(bairroParam);

         const tipoParam = searchParams.get("tipoImovel");
         if (tipoParam) setTipoImovel(tipoParam.toUpperCase());
      }
   }, [searchParams]);

   // Limpa todos os filtros
   function limparFiltro(): void {
      setPrecoMinimo("");
      setPrecoMaximo("");
      setMetrosQuadradosMinimo("");
      setMetrosQuadradosMaximo("");
      setCidade("");
      setBairro("");
      setTipoImovel("");
      setQuantidadeQuartos(null);
      setQuantidadeVagas(null);
      setimovelDescTitulo("");


   }

   // Função para realizar a busca
   const handleBusca = () => {
      const filtros: Record<string, string> = {
         finalidade: tipoVenda,
      };

      if (precoMinimo) filtros.precoMinimo = precoMinimo;
      if (precoMaximo) filtros.precoMaximo = precoMaximo;
      if (metrosQuadradosMinimo)
         filtros.metrosQuadradosMinimo = metrosQuadradosMinimo;
      if (metrosQuadradosMaximo)
         filtros.metrosQuadradosMaximo = metrosQuadradosMaximo;
      if (quantidadeDeQuartos !== null)
         filtros.quantidadeDeQuartos = quantidadeDeQuartos.toString();
      if (quantidadeDeVagas !== null)
         filtros.quantidadeDeVagas = quantidadeDeVagas.toString();
      if (cidade) filtros.cidade = cidade;
      if (bairro) filtros.bairro = bairro;
      if (tipoImovel) filtros.tipoImovel = tipoImovel.toUpperCase();
      if (imovelDescTitulo) filtros.imovelDescTitulo = imovelDescTitulo;

      // Se houver um callback de pesquisa externo, chame-o
      if (onSearch) {
         onSearch(filtros);
      } else {
         // Caso contrário, navegue para a página de resultados com os parâmetros
         const params = new URLSearchParams();
         Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.append(key, value);
         });

         router.push(`/imoveis?${params.toString()}`);
      }
   };

   return (
      <div className={`bg-white w-3/4 rounded-2xl`}>
         <div className={`flex flex-col items-center p-4 2xl:p-8`}>
            <div className="flex items-center justify-center gap-16">
               <p
                  className={`hover:cursor-pointer text-mobilePadrao md:text-1xl xl:text-2xl
               ${
                  tipoVenda === "venda"
                     ? "text-havprincipal"
                     : "text-cinzaNeutro"
               }`}
                  onClick={() => setTipoVenda("venda")}
               >
                  Venda
               </p>
               <p
                  className={`hover:cursor-pointer text-mobilePadrao md:text-1xl xl:text-2xl ${
                     tipoVenda === "aluguel"
                        ? "text-havprincipal"
                        : "text-cinzaNeutro"
                  }`}
                  onClick={() => setTipoVenda("aluguel")}
               >
                  Aluguel
               </p>
            </div>

            <div className="w-full h-[1px] bg-gray-400 my-2 lg:my-4 xl:mb-8"></div>

            <div
               className="flex px-2 border-b mt-2 pb-1 w-full
            md:border md:border-gray-300 md:p-3 md:items-center md:justify-start md:rounded-xl md:w-11/12
            2xl:w-10/12"
            >
               <Search className="2xl:w-7 h-7" />
               <input
                  type="text"
                  className="ml-2 placeholder:text-mobilePadrao text-xs
                  md:p-1 w-full lg:p-2 lg:text-base focus:outline-none"
                  placeholder="Fale um pouco sobre o imóvel"
                  value={imovelDescTitulo}
                  onChange={(e) => setimovelDescTitulo(e.target.value)}
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
                           placeholder="máximo"
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
                        Área
                     </p>

                     <div className="flex justify-center gap-6 mb-3 w-full">
                        <ComponenteInputFiltro
                           tipoInput="number"
                           onChange={setMetrosQuadradosMinimo}
                           valor={metrosQuadradosMinimo}
                           placeholder="mínimo"
                           htmlFor="metros-minimo"
                           label="m²"
                        />
                        <ComponenteInputFiltro
                           tipoInput="number"
                           onChange={setMetrosQuadradosMaximo}
                           valor={metrosQuadradosMaximo}
                           placeholder="máximo"
                           htmlFor="metros-maximo"
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
                        selecionado={quantidadeDeVagas}
                     />
                     <ComponenteRadioFiltro
                        titulo="Dormitório"
                        onChange={setQuantidadeQuartos}
                        selecionado={quantidadeDeQuartos}
                     />
                  </div>

                  <div
                     className="flex flex-col w-full justify-center items-center text-xs gap-3 
                  md:flex-row"
                  >
                     <div className="flex  flex-wrap gap-4 justify-center items-center">
                        <List
                           mudandoValor={(value) => {
                              setCidade(value);
                              setBairro(""); // Limpar bairro ao mudar de cidade
                           }}
                           opcoes={opcoesCidade}
                           buttonHolder={
                              carregandoCidades ? "Carregando..." : "Cidade"
                           }
                           placeholder="Cidade"
                           value={cidade}
                           disabled={carregandoCidades}
                        />
                        <List
                           mudandoValor={setBairro}
                           opcoes={opcoesBairro}
                           buttonHolder={
                              carregandoBairros ? "Carregando..." : "Bairro"
                           }
                           placeholder="Bairro"
                           value={bairro}
                           disabled={carregandoBairros || !cidade}
                        />
                        <List
                           mudandoValor={(value) => setTipoImovel(value.toUpperCase())}
                           opcoes={tipoImovelExemplo}
                           buttonHolder="Tipo imóvel"
                           placeholder="Casa"
                           
                           value={tipoImovel}
                        />
                     </div>
                  </div>
               </div>
            )}

            <div className="flex items-center justify-center gap-4 mt-3 lg:mt-4">
               <BotaoPadrao texto="BUSCAR" onClick={handleBusca} />
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
   