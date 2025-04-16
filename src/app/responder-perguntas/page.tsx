import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import ListaPerguntas from "@/components/componentes_respostas_perguntas/ListaPerguntas";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { Roles } from "@/models/Enum/Roles";

export default async function Page() {
   const session = await getServerSession(authOptions);
   if (!session) {
      redirect("/login");
   }
   if (
      session.user.role !== Roles.ADMINISTRADOR &&
      session.user.role !== Roles.EDITOR
   ) {
      redirect("/");
   }
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Respostas Perguntas" className="w-full">
               <ListaPerguntas />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
