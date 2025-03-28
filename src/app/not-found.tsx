import React from "react";
import Layout from "@/components/layout/LayoutPadrao";

export default function NotFound() {
   return (
      <Layout footerRemove>
         <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-bold text-havprincipal mb-4">404</h1>
            <p className="text-xl text-gray-600">Página não encontrada</p>
            <p className="text-gray-500 mt-2">
               A página que você está procurando não existe.
            </p>
         </div>
      </Layout>
   );
}
