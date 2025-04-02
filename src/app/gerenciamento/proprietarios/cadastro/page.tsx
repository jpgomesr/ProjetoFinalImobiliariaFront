import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FormularioCadastroProprietario from "./FormularioCadastroProprietario";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { Roles } from "@/models/Enum/Roles";
export default async function Page() {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }
   if (
      session.user?.role !== Roles.ADMINISTRADOR &&
      session.user?.role !== Roles.EDITOR
   ) {
      redirect("/");
   }

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FormularioCadastroProprietario />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
