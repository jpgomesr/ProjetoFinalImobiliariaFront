import { ShowerHead, Bed, Car, Ruler } from "lucide-react";          

interface HomeProps {
   qtdBanheiros: number;
   qtdQuartos: number;
   qtdVagas: number;
   metragem: number;
   dark: boolean;
}

export default function CardInfo({
   qtdBanheiros,
   qtdQuartos,
   qtdVagas,
   metragem,
   dark,
}: HomeProps) {
   return (
      <div
         className={`flex flex-row ${
            !dark ? "text-havprincipal" : "text-white"
         }`}
      >
         <div className="flex flex-row items-center justify-center gap-1 mr-3">
            <ShowerHead width={18} height={18} />
            <p className="text-xs">{qtdBanheiros}</p>
         </div>
         <div
            className={`border-l h-[1.125rem] ${
               !dark ? "border-havprincipal" : "border-white"
            }`}
         ></div>
         <div className="flex flex-row items-center justify-center gap-1 mr-2 ml-3">
            <Bed width={18} height={18} />
            <p className="text-xs">{qtdQuartos}</p>
         </div>
         <div
            className={`border-l h-[1.125rem] ${
               !dark ? "border-havprincipal" : "border-white"
            }`}
         ></div>
         <div className="flex flex-row items-center justify-center gap-1 mr-2 ml-3">
            <Car width={20} height={20} />
            <p className="text-xs">{qtdVagas}</p>
         </div>
         <div
            className={`border-l h-[1.125rem] ${
               !dark ? "border-havprincipal" : "border-white"
            }`}
         ></div>
         <div className="flex flex-row items-center justify-center gap-1 ml-3">
            <Ruler width={18} height={18} />
            <p className="text-xs">{metragem}m²</p>
         </div>
      </div>
   );
}
