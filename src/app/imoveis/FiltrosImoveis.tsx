
import ButtonFiltro from "@/components/componetes_filtro/filtro_pesquisa/ButtonFiltro";
import FiltroList from "@/components/componetes_filtro/FiltroList";
import InputPadrao from "@/components/InputPadrao";
import ButtonMapa from "@/components/ButtonMapa";


interface FiltrosImoveisProps {
   precoMinimo?: string;
   precoMaximo?: string;
   metrosQuadradosMinimo?: string;
   metrosQuadradosMaximo?: string;
   quantidadeDeQuartos?: string;
   quantidadeDeVagas?: string;
   cidade?: string;
   bairro?: string;
   tipoImovel?: string;
   finalidade?: string;
   view?: string;
   url?: string;
}


const FiltrosImoveis = (props: FiltrosImoveisProps) => {


   const params = {  
      precoMinimo: props.precoMinimo ?? "0",
      precoMaximo: props.precoMaximo ?? "0",
      metrosQuadradosMinimo: props.metrosQuadradosMinimo ?? "0",
      metrosQuadradosMaximo: props.metrosQuadradosMaximo ?? "0",
      quantidadeDeQuartos: props.quantidadeDeQuartos ?? "0",
      quantidadeDeVagas: props.quantidadeDeVagas ?? "0",
      cidade: props.cidade ?? "",
      bairro: props.bairro ?? "",
      tipoImovel: props.tipoImovel ?? "",
      finalidade: props.finalidade ?? "",
      view: props.view ?? "cards",
   };

   return (
      <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_7fr_1fr] xl:grid-cols-[1fr_6fr_1fr]">
         <FiltroList
            opcoes={[
               { id: "venda", label: "Venda" },
               { id: "aluguel", label: "Aluguel" },
               { id: "", label: "Todos" },
            ]}
            bordaPreta={true}
            nome="finalidade"
            value={params.finalidade}
            defaultPlaceholder="Todos"
            url={props.url ?? "/imoveis"}
         />

         <InputPadrao
            type="text"
            placeholder="Pesquise aqui"
            search={true}
            className="w-full"
         />

         <div className="w-36 min-h-full place-self-end md:place-self-auto">
            <ButtonFiltro
               bordaPreta={true}
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
               url={props.url ?? "/imoveis"}
            />
         </div>
         <div className="flex justify-center gap-4 mt-4 col-span-full">
            <ButtonMapa
               texto="Cards"
               href={`${props.url ?? "/imoveis"}?view=cards`}
               className={`w-32 h-10 ${
                  params.view === "cards"
                     ? "bg-havprincipal text-white"
                     : "bg-havprincipal/50 text-white"
               }`}
            />
            <ButtonMapa
               texto="Mapa"
               href={`${props.url ?? "/imoveis"}?view=map`}
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
