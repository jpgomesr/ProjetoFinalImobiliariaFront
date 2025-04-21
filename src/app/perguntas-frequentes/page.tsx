import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import ListaPerguntasFrequentes from "@/components/componentes_perguntas_frequentes/ListaPerguntasFrequentes";
import BotaoPadrao from "@/components/BotaoPadrao";
import Link from "next/link";



const Page = () => {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <div className="flex my-4"></div>
            <FundoBrancoPadrao titulo="Perguntas Frequentes" className="w-full">
               <ListaPerguntasFrequentes />
               <div className="flex justify-center xl:mt-4">
                  <Link href="/suporte">
                     <BotaoPadrao
                     texto="Entre em contato com o suporte"
                  />
                  </Link>
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
