"use client";
import CardReserva from "@/components/card/CardAgendamento";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import React from "react";
import FIltrosAgendamento from "./FIltrosAgendamento";

const page = () => {
   return (
      <Layout className="my-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Histórico de agendamentos"
               className="w-full px-2"
            >
               <InputPadrao search className="h-8" />

               <FIltrosAgendamento />
               <section className="grid grid-cols-1 w-full my-4 place-items-center">
                  <CardReserva
                     urlImagem="https://hav-bucket-c.s3.amazonaws.com/ed57a0d8-089d-41c0-b90d-743d7431935b_transferir%20%281%29.jfif"
                     horario="14:30"
                     data="20/12/2023"
                     corretor="Maria Silva"
                     localizacao="Centro"
                     endereco="Rua das Flores, 123"
                     onConfirm={() => console.log("Confirmado")}
                     onCancel={() => console.log("Cancelado")}
                  />
               </section>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;

{
}
