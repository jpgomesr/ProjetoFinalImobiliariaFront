"use client";

import { useSearchParams } from "next/navigation";
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import FiltroList from "@/components/componetes_filtro/FiltroList";
import InputPadrao from "@/components/InputPadrao";
import ButtonMapa from "@/components/ButtonMapa";

const FiltrosImoveis = () => {
   const searchParams = useSearchParams();

   const params = {
      precoMinimo: searchParams.get("precoMinimo") ?? "0",
      precoMaximo: searchParams.get("precoMaximo") ?? "0",
      metrosQuadradosMinimo: searchParams.get("metrosQuadradosMinimo") ?? "0",
      metrosQuadradosMaximo: searchParams.get("metrosQuadradosMaximo") ?? "0",
      quantidadeDeQuartos: searchParams.get("quantidadeDeQuartos") ?? "0",
      quantidadeDeVagas: searchParams.get("quantidadeDeVagas") ?? "0",
      cidade: searchParams.get("cidade") ?? "",
      bairro: searchParams.get("bairro") ?? "",
      tipoImovel: searchParams.get("tipoImovel") ?? "",
      finalidade: searchParams.get("finalidade") ?? "",
      view: searchParams.get("view") ?? "cards",
   };

   return (
      <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_7fr_1fr] xl:grid-cols-[1fr_6fr_1fr]">
         <FiltroList
            opcoes={[
               { id: "venda", label: "Venda" },
               { id: "aluguel", label: "Aluguel" },
               { id: "todos", label: "Todos" },
            ]}
            finalidade={params.finalidade}
            precoMinimo={params.precoMinimo}
            precoMaximo={params.precoMaximo}
            metrosQuadradosMinimo={params.metrosQuadradosMinimo}
            metrosQuadradosMaximo={params.metrosQuadradosMaximo}
            quantidadeDeQuartos={params.quantidadeDeQuartos}
            quantidadeDeVagas={params.quantidadeDeVagas}
            cidade={params.cidade}
            bairro={params.bairro}
            tipoImovel={params.tipoImovel}
            url="/imoveis"
            value={params.finalidade}
         />

         <InputPadrao
            type="text"
            placeholder="Pesquise aqui"
            search={true}
            className="w-full"
         />

         <div className="w-36 min-h-full place-self-end md:place-self-auto">
            <ButtonFiltro
               precoMinimo={params.precoMinimo}
               precoMaximo={params.precoMaximo}
               metrosQuadradosMinimo={params.metrosQuadradosMinimo}
               metrosQuadradosMaximo={params.metrosQuadradosMaximo}
               quantidadeDeQuartos={params.quantidadeDeQuartos}
               quantidadeDeVagas={params.quantidadeDeVagas}
               cidade={params.cidade}
               bairro={params.bairro}
               tipoImovel={params.tipoImovel}
               finalidade={params.finalidade}
               url={"/imoveis"}
            />
         </div>
         <div className="flex justify-center gap-4 mt-4 col-span-full">
            <ButtonMapa
               texto="Cards"
               href={`/imoveis?view=cards`}
               className={`w-32 h-10 ${
                  params.view === "cards"
                     ? "bg-havprincipal text-white"
                     : "bg-havprincipal/50 text-white"
               }`}
            />
            <ButtonMapa
               texto="Mapa"
               href={`/imoveis?view=map`}
               className={`w-32 h-10  ${
                  params.view === "map"
                     ? "bg-havprincipal text-white"
                     : "bg-havprincipal/50 text-white"
               }`}
            />
         </div>
      </div>
   );
};

export default FiltrosImoveis;
