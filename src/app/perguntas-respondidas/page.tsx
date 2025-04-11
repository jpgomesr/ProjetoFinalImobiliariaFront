import ListaPerguntasRespondidas from "@/components/componentes_perguntas_respondidas/ListaPerguntasRespondidas";
import LayoutPadrao from "@/components/layout/LayoutPadrao";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";

export default function PerguntasRespondidasPage() {
   return (
      <LayoutPadrao>
         <FundoBrancoPadrao titulo="Perguntas Respondidas">
            <ListaPerguntasRespondidas />
         </FundoBrancoPadrao>
      </LayoutPadrao>
   );
}
