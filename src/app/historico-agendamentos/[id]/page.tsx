import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { buscarIdsUsuarios } from "@/Functions/usuario/buscaUsuario";
import { ModelAgendamento } from "@/models/ModelAgendamento";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
import { fetchComAutorizacao } from "@/hooks/FetchComAuthorization";
import HistoricoAgendamentosClient from "./HistoricoAgendamentosClient";

interface PageProps {
   params: Promise<{
      id: string;
   }>;
   searchParams?: Promise<{
      page?: string;
      status?: string;
      data?: string;
   }>;
}

export async function generateStaticParams() {
   const ids = await buscarIdsUsuarios();
   return ids.map((id) => ({ id: id.toString() }));
}

const page = async ({ params, searchParams }: PageProps) => {
   const { id } = await params;
   const searchParamsRenderizados = await searchParams;
   const currentPage = Number(searchParamsRenderizados?.page) || 0;
   const parametrosRenderizados = await searchParamsRenderizados;
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/api/auth/signin");
   }
   if (session.user.id !== id) {
      redirect("/");
   }
   if (
      session.user.role !== Roles.USUARIO &&
      session.user.role !== Roles.CORRETOR
   ) {
      redirect("/");
   }

   const fetchAgendamentos = async (role: Roles) => {
      try {
         const response = await fetchComAutorizacao(
            `http://localhost:8082/agendamentos/${
               role === Roles.CORRETOR ? "corretor" : "usuario"
            }/${id}?status=${parametrosRenderizados?.status || ""}&data=${
               parametrosRenderizados?.data || ""
            }&page=${currentPage}&size=9&sort=dataHora,desc`
         );
         const data = await response.json();

         return {
            content: data.content as ModelAgendamento[],
            totalPages: data.totalPages as number,
         };
      } catch (error) {
         console.error("Erro ao buscar agendamentos:", error);
         return {
            content: [],
            totalPages: 0,
         };
      }
   };

   const { content: agendamentos, totalPages } = await fetchAgendamentos(
      session.user.role as Roles
   );

   return (
      <Layout className="my-0">
         <SubLayoutPaginasCRUD>
            <HistoricoAgendamentosClient
               id={id}
               role={session.user.role as Roles}
               parametrosRenderizados={parametrosRenderizados || {}}
               currentPage={currentPage}
               agendamentos={agendamentos}
               totalPages={totalPages}
               token={session.accessToken ?? ""}
            />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
