import React from "react";
import HeaderVermelho from "./headers/HeaderVermelho";

interface LayoutProps {
   children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
   return (
      <div>
         <HeaderVermelho />
         <div>{props.children}</div>
      </div>
   );
};

export default Layout;
