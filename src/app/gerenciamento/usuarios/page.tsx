import { Suspense } from "react";
import { listarUsuarios } from "@/Functions/usuario/buscaUsuario";
import Filtros from "./Filtros";
import ListaUsuarios from "./ListaUsuarios";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Loading from "@/components/Loading"; // Componente de carregamento
import { Roles } from "@/models/Enum/Roles";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
interface PageProps {
   searchParams: Promise<{
      status?: string;
      tipoUsuario?: string;
      nomePesquisa?: string;
      numeroPaginaAtual?: string;
   }>;
}

async function ConteudoPrincipal({ searchParams }: PageProps) {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR) {
      redirect("/");
   }

   const parametros = await searchParams;

   const status = parametros.status || "Ativo";
   const tipoUsuario = parametros.tipoUsuario || "USUARIO";
   const nomePesquisa = parametros.nomePesquisa || "";
   const numeroPaginaAtual = Number(parametros.numeroPaginaAtual) || 0;

   // Converte o status para booleano
   const statusBooleano = status === "Ativo";

   // Busca os dados no servidor
   const { usuariosRenderizados, conteudoCompleto } = await listarUsuarios(
      numeroPaginaAtual,
      tipoUsuario,
      statusBooleano,
      nomePesquisa,
      10,
   );

   // Informações de paginação
   const peageableinfo = {
      totalPaginas: conteudoCompleto.totalPages,
      ultima: conteudoCompleto.last,
      maximoPaginasVisiveis: 5,
   };

   return (
      <FundoBrancoPadrao className="w-full" titulo="Gerenciamento de usuários">
         <Filtros
            status={status}
            tipoUsuario={tipoUsuario}
            nomePesquisa={nomePesquisa}
         />
         <ListaUsuarios
            usuarios={usuariosRenderizados}
            peageableinfo={peageableinfo}
            numeroPaginaAtual={numeroPaginaAtual}
            token={session.accessToken ?? ""}
         />
      </FundoBrancoPadrao>
   );
}

export default function Page({ searchParams }: PageProps) {
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <Suspense fallback={<Loading />}>
               <ConteudoPrincipal searchParams={searchParams} />
            </Suspense>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
