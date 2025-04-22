
import RelatorioPage from "./RelatorioPage";
import { fetchRelatorioData, prepararDadosParaGraficos } from "../actions/relatorio";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";

import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";

export default async function Page() {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
    }
    if (session.user?.role !== Roles.ADMINISTRADOR) {
      redirect("/");
    }

    const initialData = await fetchRelatorioData(session.accessToken ?? "");
    const graficosData = prepararDadosParaGraficos(initialData.imoveis);

    return (
      <Layout className="py-0">
        <SubLayoutPaginasCRUD>
          <RelatorioPage  
            initialData={initialData} 
            graficosData={graficosData}
          />
        </SubLayoutPaginasCRUD>
      </Layout>
    );
}
