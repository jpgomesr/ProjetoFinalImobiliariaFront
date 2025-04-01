import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioCadastroImovel from "./FormularioCadastroImovel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
export default async function Page() {

   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (session.user?.role !== Roles.ADMINISTRADOR && session.user?.role !== Roles.EDITOR) {
      redirect("/");
   }

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FormularioCadastroImovel />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
