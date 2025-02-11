import FavButton from "./FavButton";
import ObjetivoImovel from "./ObjetivoImovel";
import CardInfo from "./CardInfo";

interface HomeProps {
   tipo: string;
   favorited: boolean;
   objImovel: string;
   valor: number;
   qtdFav: number;
   codigo: number;
   endereco: string;
   bairro: string;
   cidade: string;
   descricao: string;
}

export default function CardImovel({
   tipo,
   favorited,
   objImovel,
   valor,
   qtdFav,
   codigo,
   endereco,
   bairro,
   cidade,
   descricao,
}: HomeProps) {
   return (
      <div className="w-[70%] h-[497px] max-w-[350px] bg-begepadrao rounded-2xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]">
         <div>
            <img
               src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
               alt="a"
               className="w-[100%]  max-h-[40%] max-w-[350px] rounded-t-2xl"
            />
         </div>
         <div className="mx-6 mt-4 flex flex-col gap-3">
            <div className="flex flex-col">
               <div className="flex flex-row justify-between w-full pr-1 items-center">
                  <h3 className="text-havprincipal text-fontcard1">{tipo}</h3>
                  <FavButton favorited={favorited} />
               </div>
               <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-row gap-[0.25rem] items-center">
                     <ObjetivoImovel objImovel={objImovel} />
                     <div className="flex flex-row gap-[0.25rem]">
                        <p className="text-[0.75rem]">R$</p>
                        <p className="text-[0.75rem]">{valor.toFixed(2)}</p>
                     </div>
                  </div>
                  <p className="text-[0.75rem] p-[0.25rem]">{qtdFav}</p>
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
               <p>Código: {codigo}</p>
               <div className="flex flex-col gap-1">
                  <p>
                     {endereco}, {bairro}
                  </p>
                  <p>{cidade}</p>
               </div>
               <p>{descricao}</p>
            </div>
            <div>
               <CardInfo />
            </div>
         </div>
      </div>
   );
}
