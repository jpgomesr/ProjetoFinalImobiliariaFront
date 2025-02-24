import Shower from "../../svg/icons/card/BenheirosIcon";
import Bedroom from "../../svg/icons/card/QuartoIcon";
import Car from "../../svg/icons/card/VagasIcon";
import Ruler from "../../svg/icons/card/MetragemIcon";

interface HomeProps {
   qtdBanheiros: number;
   qtdQuartos: number;
   qtdVagas: number;
   metragem: number;
}

export default function CardInfo({
   qtdBanheiros,
   qtdQuartos,
   qtdVagas,
   metragem,
}: HomeProps) {
   return (
      <div className="flex flex-row text-havprincipal">
         <div className="flex flex-row items-center justify-center gap-1 mr-3">
            <Shower width={18} height={18} />
            <p className="text-xs">{qtdBanheiros}</p>
         </div>
         <div className="border-l border-havprincipal h-[1.125rem]"></div>
         <div className="flex flex-row items-center justify-center gap-1 mr-2 ml-3">
            <Bedroom width={18} height={18} />
            <p className="text-xs">{qtdQuartos}</p>
         </div>
         <div className="border-l border-havprincipal h-[1.125rem]"></div>
         <div className="flex flex-row items-center justify-center gap-1 mr-2 ml-3">
            <Car width={20} height={18} />
            <p className="text-xs">{qtdVagas}</p>
         </div>
         <div className="border-l border-havprincipal h-[1.125rem]"></div>
         <div className="flex flex-row items-center justify-center gap-1 ml-3">
            <Ruler width={18} height={18} />
            <p className="text-xs">{metragem}m²</p>
         </div>
      </div>
   );
}
