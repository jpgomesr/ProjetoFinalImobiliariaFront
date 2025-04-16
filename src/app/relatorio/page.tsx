import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import RelatorioClient from "./cliente";
import { fetchRelatorioData, prepararDadosParaGraficos } from "../actions/relatorio";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
export default async function Page() { 

   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR) {
      redirect("/");
   }

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
