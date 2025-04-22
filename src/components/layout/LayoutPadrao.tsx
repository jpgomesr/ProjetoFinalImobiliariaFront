import React from "react";
import { Roles } from "@/models/Enum/Roles";
import Footer from "../footer/Footer";
import ClientLanguageProvider from "@/components/headers/ClienteLanguageProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

interface LayoutProps {
   children: React.ReactNode;
   className?: string;
   footerRemove?: boolean;
}

const Layout = async (props: LayoutProps) => {
   const session = await getServerSession(authOptions);

   return (
      <div className="h-screen flex flex-col">
         <ClientLanguageProvider
            role={
               session?.user?.role
                  ? (session.user.role as unknown as Roles)
                  : Roles.USUARIO
            }
            id={session?.user?.id}
            foto={session?.user?.image}
         />
         <div
            className={`${props.className ? props.className : "py-8"} flex-1`}
         >
            {props.children}
         </div>
         {props.footerRemove ? null : <Footer />}
      </div>
   );
};

export default Layout;
