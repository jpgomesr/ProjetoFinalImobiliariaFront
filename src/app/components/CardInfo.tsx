import Shower from "../icons/Shower";

interface HomeProps {
   qtdBanheiro: number;
   qtdQuartos: number;
   qtdVagas: number;
}

export default function CardInfo() {
   return (
      <div>
         <Shower />
      </div>
   );
}
