"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import FormPerguntas from "@/components/componentes_suporte/FormPerguntas";

const SuporteClient = () => {
   return (
      <SessionProvider>
         <FormPerguntas />
      </SessionProvider>
   );
};

export default SuporteClient;
