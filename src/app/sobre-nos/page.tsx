"use client";

import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/Layout";
import React from "react";

const page = () => {
   return <Layout>
      <InputPadrao htmlFor="teste" placeholder="teste" label="teste" tipoInput="text"/>
   </Layout>;
};

export default page;
