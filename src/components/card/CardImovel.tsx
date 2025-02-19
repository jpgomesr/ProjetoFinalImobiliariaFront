import FavButton from "../FavBotao";
import CardInfo from "./CardInfo";
import SaibaMaisBotao from "./SaibaMaisBotao";
import ModelImovel from "../../models/ModelImovel";
import { useState } from "react";
import CardBanner from "./CardBanner";

interface HomeProps {
   imovel: ModelImovel;
}

export default function CardImovel(props: HomeProps) {
   const [isBannerVisible] = useState(props.imovel.banner);
   const valor = props.imovel.valor;
   const valorFormatado = valor.toLocaleString("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   });

   return (
      <div className="w-[70%] h-full max-w-[305px] bg-begepadrao rounded-2xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)] relative">
         {isBannerVisible && <CardBanner tipo={props.imovel.tipoBanner} />}
         <div>
            <img
               src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
               alt="a"
               className="w-full  max-h-[40%] max-w-[350px] rounded-t-2xl"
            />
         </div>
         <div className="mx-5 mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
               <div className="flex flex-col">
                  <div className="flex flex-row justify-between w-full pr-1 items-center">
                     <p className="text-havprincipal text-xs font-medium">
                        {props.imovel.objImovel === "Venda"
                           ? "Venda por"
                           : "Locação por"}
                     </p>
                     <FavButton favorited={props.imovel.favoritado} />
                  </div>
                  <div className="flex flex-row justify-between w-full">
                     <div className="flex flex-row gap-1 items-center">
                        <div className="flex flex-row gap-1 items-center justify-center text-havprincipal">
                           <p
                              className="text-base font-bold"
                              style={{
                                 textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                              }}
                           >
                              R$
                           </p>
                           <p
                              className="text-base font-bold"
                              style={{
                                 textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                              }}
                           >
                              {valorFormatado}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div>
                  <p className="text-xs text-havprincipal">
                     {props.imovel.tipo}
                  </p>
                  <CardInfo
                     qtdBanheiros={props.imovel.qtdBanheiros}
                     qtdQuartos={props.imovel.qtdQuartos}
                     qtdVagas={props.imovel.qtdVagas}
                     metragem={props.imovel.metragem}
                  />
               </div>
            </div>
            <div className="text-[0.625rem] text-havprincipal flex flex-col gap-1 text-justify">
               <p>Código: {props.imovel.codigo}</p>
               <div className="flex flex-col gap-1">
                  <p>
                     {props.imovel.endereco}, {props.imovel.bairro}
                  </p>
                  <p>{props.imovel.cidade}</p>
               </div>
               <p>{props.imovel.descricao}</p>
            </div>
            <div className="flex justify-center pb-5">
               <SaibaMaisBotao codigo={props.imovel.codigo} />
            </div>
         </div>
      </div>
   );
}
