import Shower from "../../svg/icons/BenheirosIcon";
import Bedroom from "../../svg/icons/QuartoIcon";
import Car from "../../svg/icons/VagasIcon";
import Ruler from "../../svg/icons/MetragemIcon";

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
      <div className="flex flex-row justify-between gap-2">
         <div className="flex flex-row items-center justify-center gap-2">
            <Shower />
            <p className="text-[0.9rem]">{qtdBanheiros}</p>
         </div>
         <div className="flex flex-row items-center justify-center gap-2">
            <Bedroom />
            <p className="text-[0.9rem]">{qtdQuartos}</p>
         </div>
         <div className="flex flex-row items-center justify-center gap-2">
            <Car />
            <p className="text-[0.9rem]">{qtdVagas}</p>
         </div>
         <div className="flex flex-row items-center justify-center gap-2">
            <Ruler />
            <p className="text-[0.8rem]">{metragem}m²</p>
         </div>
      </div>
   );
}
