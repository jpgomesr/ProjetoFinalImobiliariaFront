import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import AgendamentoForm from "./AgendamentoForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Roles } from "@/models/Enum/Roles";
interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

const Page = async ({ params }: PageProps) => {

   const session = await getServerSession(authOptions)
   const { id } = await params;
   let idUsuario : number | undefined = undefined
   if(!session){
      redirect("/api/auth/signin")
   }
   if(session.user.id){
      idUsuario = +session.user.id
   }else{
      redirect("/")
   }
   if(session.user.role !== Roles.USUARIO){
      redirect("/")
   }

   return (
      <Layout className={"py-0"}>
         <SubLayoutPaginasCRUD>
            <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl md:text-2xl lg:text-3xl text-center mb-4 md:mb-6 lg:mb-8">
               <h1>Agendamento de Visitas com</h1>
               <h1 className="font-bold">HAV</h1>
            </div>
            <AgendamentoForm id={id} idUsuario={idUsuario} />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
