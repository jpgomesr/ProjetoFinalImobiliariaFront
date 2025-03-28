"use client";

import React from "react";
import { Roles } from "@/models/Enum/Roles";
import HeaderVermelho from "../headers/HeaderVermelho";
import Footer from "../footer/Footer";
import { useSession, SessionProvider } from "next-auth/react";

interface LayoutProps {
   children: React.ReactNode;
   className?: string;
   footerRemove?: boolean;
}

const LayoutContent = (props: LayoutProps) => {
   const { data: session } = useSession();

   return (
      <div className="h-screen flex flex-col">
         <HeaderVermelho
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

const LayoutPadraoClient = (props: LayoutProps) => {
   return (
      <SessionProvider>
         <LayoutContent {...props} />
      </SessionProvider>
   );
};

export default LayoutPadraoClient;
