import React from "react";
import { Roles } from "@/models/Enum/Roles";
import HeaderVermelho from "../headers/HeaderVermelho";
import Footer from "../footer/Footer";

interface LayoutProps {
   children: React.ReactNode;
   className?: string;
   role?: Roles;
   footerRemove?: boolean;
}

const Layout = (props: LayoutProps) => {
   return (
      <div className="h-screen flex flex-col">
         <HeaderVermelho role={props.role} />
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
