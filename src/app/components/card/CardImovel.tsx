import FavButton from "../FavBotao";
import ObjetivoImovel from "./ObjetivoImovel";
import CardInfo from "./CardInfo";
import SaibaMaisBotao from "./SaibaMaisBotao";
import ModelImovel from "../../models/ModelImovel";

interface HomeProps {
   imovel: ModelImovel;
}

export default function CardImovel(props: HomeProps) {
   return (
      <div className="w-[70%] h-[515px] max-w-[305px] bg-begepadrao rounded-2xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]">
         <div>
            <img
               src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
               alt="a"
               className="w-full  max-h-[40%] max-w-[350px] rounded-t-2xl"
            />
         </div>
         <div className="mx-6 mt-4 flex flex-col gap-3">
            <div className="flex flex-col">
               <div className="flex flex-row justify-between w-full pr-1 items-center">
                  <h3 className="text-havprincipal text-fontcard1">{props.imovel.tipo}</h3>
                  <FavButton favorited={props.imovel.favoritado} />
               </div>
               <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-row gap-1 items-center">
                     <ObjetivoImovel objImovel={props.imovel.objImovel} />
                     <div className="flex flex-row gap-1 items-center justify-center">
                        <p className="text-xs">
                           <strong>R$</strong>
                        </p>
                        <p className="text-xs">
                           <strong>{props.imovel.valor.toFixed(2)}</strong>
                        </p>
                     </div>
                  </div>
                  <p className="text-xs p-1">{props.imovel.qtdFav}</p>
               </div>
            </div>
            {/* ESSA DAQUI TA MEIO ESTRANHA, MAS TBM DA PARA TESTAR
         
            <div className="mx-6 mt-4 flex flex-row items-center justify-between">
               <div>
                  <h3 className="text-havprincipal text-fontcard1">{tipo}</h3>
                  <div className="flex flex-row gap-[0.25rem] justify-center items-center">
                     <ObjetivoImovel objImovel={objImovel} />
                     <div className="flex flex-row gap-[0.25rem]">
                        <p className="text-[0.75rem]">R$</p>
                        <p className="text-[0.75rem]">{valor.toFixed(2)}</p>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col justify-between">
                  <FavButton favorited={favorited} />
                  <p className="text-[0.75rem] p-[0.25rem]">{qtdFav}</p>
               </div>
            </div> */}
            <div className="text-[0.625rem] text-havprincipal flex flex-col gap-2 text-justify">
               <p>Código: {props.imovel.codigo}</p>
               <div className="flex flex-col gap-1">
                  <p>
                     {props.imovel.endereco}, {props.imovel.bairro}
                  </p>
                  <p>{props.imovel.cidade}</p>
               </div>
               <p>{props.imovel.descricao}</p>
            </div>
            <div>
               <CardInfo
                  qtdBanheiros={props.imovel.qtdBanheiros}
                  qtdQuartos={props.imovel.qtdQuartos}
                  qtdVagas={props.imovel.qtdVagas}
                  metragem={props.imovel.metragem}
               />
            </div>
            <div className="flex justify-center">
               <SaibaMaisBotao codigo={props.imovel.codigo} />
            </div>
         </div>
      </div>
   );
}
