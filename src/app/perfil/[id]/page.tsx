import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioPerfil from "./FormularioPerfil";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { fetchComAutorizacao } from "@/hooks/FetchComAuthorization";
interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

const Page = async ({ params }: PageProps) => {
   const { id } = await params;
   const session = await getServerSession(authOptions);
   if (!session) {
      redirect("/api/auth/signin");
   }
   if (session.user.id !== id) {
      redirect("/");
   }


   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   if (!BASE_URL) {
      throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
   }

   try {
      const response = await fetchComAutorizacao(`${BASE_URL}/usuarios/${id}`);
      if (!response.ok) {
         throw new Error("Erro ao buscar os dados do usuário");
      }
      const dadosIniciais = await response.json();

      return (
         <Layout className="py-0">
            <SubLayoutPaginasCRUD>
               <FundoBrancoPadrao className="w-full" titulo="Perfil de Usuário">
                  <FormularioPerfil
                     id={id}
                     BASE_URL={BASE_URL}
                     dadosIniciais={dadosIniciais}
                  />
               </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
         </Layout>
      );
   } catch (error) {
      return (
         <Layout className="py-0">
            <SubLayoutPaginasCRUD>
               <FundoBrancoPadrao className="w-full" titulo="Perfil de Usuário">
                  <div className="flex justify-center items-center h-64">
                     <p className="text-red-500">
                        {error instanceof Error
                           ? error.message
                           : "Ocorreu um erro desconhecido"}
                     </p>
                  </div>
               </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
         </Layout>
      );
   }
};

export default Page;
