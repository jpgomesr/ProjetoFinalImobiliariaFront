import React from "react";
import HeaderVermelho from "./headers/HeaderVermelho";
import Footer from "./footer/Footer";

interface LayoutProps {
   children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
   return (
      <div>
         <HeaderVermelho />
         <div className="py-8">{props.children}</div>
         <Footer />
      </div>
   );
};

export default Layout;
