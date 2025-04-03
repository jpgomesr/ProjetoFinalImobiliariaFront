import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import FormPerguntas from "@/components/componentes_perguntas_frequentes/FormPerguntas";
import ListaPerguntasFrequentes from "@/components/componentes_perguntas_frequentes/ListaPerguntasFrequentes";

interface PageProps {
   searchParams: { [key: string]: string | string[] | undefined };
}

const page = ({ searchParams }: PageProps) => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Faça uma pergunta" className="w-full">
               <FormPerguntas />
            </FundoBrancoPadrao>
            <div className="flex my-4"></div>
            <FundoBrancoPadrao titulo="Perguntas Frequentes" className="w-full">
               <ListaPerguntasFrequentes />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
