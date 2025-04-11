import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioCadastroUsuario from "./FormularioCadastroUsuario";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
const Page = async () => {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR) {
      redirect("/");
   }
   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FormularioCadastroUsuario token={session.accessToken || ""} />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
