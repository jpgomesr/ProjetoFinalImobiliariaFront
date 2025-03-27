import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import RelatorioClient from "./cliente";
import { fetchRelatorioData, prepararDadosParaGraficos } from "../actions/relatorio";

export default async function Page() {
   const initialData = await fetchRelatorioData();
   const graficosData = prepararDadosParaGraficos(initialData.imoveis);

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Relatório">
               <RelatorioClient
                  initialData={initialData}
                  graficosData={graficosData}
               />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
