import { buscarProprietarios } from "@/Functions/proprietario/buscaProprietario";
import ModelProprietarioListagem from "@/models/ModelProprietarioListagem";
import ProprietariosListagem from "./ProprietariosListagem";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import Layout from "@/components/layout/LayoutPadrao";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

interface PageProps {
   searchParams: Promise<{
      pagina?: string;
      nome?: string;
      status?: string;
   }>;
}

export default async function Page({ searchParams }: PageProps) {

   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR && session.user?.role !== Roles.EDITOR) {
      redirect("/");
   }  

   
   const parametros = await searchParams;

   const paginaAtual = parseInt(parametros.pagina || "0");
   const nomePesquisa = parametros.nome || "";
   const status = parametros.status || "Ativo";

   const { conteudoCompleto, proprietariosRenderizados } =
      await buscarProprietarios(paginaAtual, nomePesquisa, status === "Ativo");

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="OwnerManagement.title"
               className="w-full"
               isTranslationKey={true}
            >
               <ProprietariosListagem
                  proprietariosIniciais={proprietariosRenderizados || []}
                  totalPaginas={conteudoCompleto.totalPages}
                  ultimaPagina={conteudoCompleto.last}
                  paginaAtual={paginaAtual}
                  nomePesquisa={nomePesquisa}
                  status={status}
                  token={session.accessToken ?? ""}
               />
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
