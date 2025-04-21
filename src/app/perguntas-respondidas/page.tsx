import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadraoClient";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import ListaPerguntasRespondidas from "@/components/componentes_respostas_perguntas/ListaPerguntasRespondidas";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { Roles } from "@/models/Enum/Roles";

export default async function Page() {
   console.log("Renderizando página perguntas-respondidas");
   const session = await getServerSession(authOptions);
   console.log("Session na página:", session ? "Disponível" : "Não disponível");

   if (!session) {
      console.log("Usuário não autenticado, redirecionando para login");
      redirect("/login");
   }

   console.log("Role do usuário:", session.user.role);
   if (
      session.user.role !== Roles.ADMINISTRADOR &&
      session.user.role !== Roles.EDITOR
   ) {
      console.log("Usuário não tem permissão, redirecionando para home");
      redirect("/");
   }

   console.log("Renderizando conteúdo da página");
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Perguntas Respondidas"
               className="w-full"
            >
               <ListaPerguntasRespondidas />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
