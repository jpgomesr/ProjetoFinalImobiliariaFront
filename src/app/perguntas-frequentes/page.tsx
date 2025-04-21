import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import ListaPerguntasFrequentes from "@/components/componentes_perguntas_frequentes/ListaPerguntasFrequentes";
import PerguntasFrequentesClient from "./client";


const Page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
         <PerguntasFrequentesClient />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
