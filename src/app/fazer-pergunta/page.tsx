import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadraoClient";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioPergunta from "@/components/componentes_respostas_perguntas/FormularioPergunta";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";

export default async function Page() {
   console.log("Renderizando página fazer-pergunta");
   const session = await getServerSession(authOptions);
   console.log("Session na página:", session ? "Disponível" : "Não disponível");

   if (!session) {
      console.log("Usuário não autenticado, redirecionando para login");
      redirect("/login");
   }

   console.log("Renderizando conteúdo da página");
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Fazer Pergunta" className="w-full">
               <FormularioPergunta
                  onSubmit={(pergunta) => {
                     console.log("Pergunta enviada:", pergunta);
                  }}
               />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
