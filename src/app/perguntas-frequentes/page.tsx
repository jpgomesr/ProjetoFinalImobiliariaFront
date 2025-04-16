import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import ListaPerguntasFrequentes from "@/components/componentes_perguntas_frequentes/ListaPerguntasFrequentes";


const page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <div className="flex my-4"></div>
            <FundoBrancoPadrao titulo="Perguntas Frequentes" className="w-full">
               <ListaPerguntasFrequentes />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
