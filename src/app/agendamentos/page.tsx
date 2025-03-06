"use client";

import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React from "react";
import { Calendario } from "@/components/calendario/Calendario";

const page = () => {
   return (
      <Layout className={"py-0"}>
         <SubLayoutPaginasCRUD>
            <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-base text-center">
               <h1>Agendamento de Visitas com</h1>
               <h1 className="font-bold">HAV</h1>
            </div>
            <div className="w-full px-9">
               <div className="bg-havprincipal w-full h-[43vh] rounded-xl">
                  <Calendario />
               </div>
            </div>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
