"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/Layout";
import React from "react";

const page = () => {
   return (
      <Layout className="py-0">
         <div className="bg-begeClaroPadrao w-full flex flex-col items-center justify-center  py-6">
            <FundoBrancoPadrao titulo="Gerenciamento de usuários">
               <InputPadrao
                  htmlFor="teste"
                  label="teste"
                  tipoInput="text"
                  placeholder="teste"
               />
            </FundoBrancoPadrao>
         </div>
      </Layout>
   );
};

export default page;
