import React from "react";
import HeaderVermelho from "./headers/HeaderVermelho";
import Footer from "./footer/Footer";
import { Roles } from "@/models/Enum/Roles";

interface LayoutProps {
   children: React.ReactNode;
   className?: string;
   role: Roles;
}

const Layout = (props: LayoutProps) => {
   return (
      <div>
         <HeaderVermelho role={props.role} />
         <div className={`${props.className ? props.className : "py-8"}`}>
            {props.children}
         </div>
         <Footer />
      </div>
   );
};

export default Layout;
