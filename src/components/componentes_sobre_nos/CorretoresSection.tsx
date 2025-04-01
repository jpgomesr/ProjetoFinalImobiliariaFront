"use client";

import React, { useEffect, useState } from "react";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import ExibirCorretores from "@/components/componentes_sobre_nos/ExibirCorretores";
import { renderizarUsuariosApi } from "@/app/sobre-nos/action";

const CorretoresSection = () => {
   const [corretores, setCorretores] = useState<ModelExibirCorretor[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchCorretores = async () => {
         try {
            setLoading(true);
            setError(null);
            const data = await renderizarUsuariosApi();
            setCorretores(data);
         } catch (error) {
            setError(
               "Erro ao carregar corretores. Por favor, tente novamente mais tarde."
            );
            console.error("Erro ao buscar corretores:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchCorretores();
   }, []);

   return (
      <section className="flex-row">
         {loading ? (
            <div className="text-havprincipal text-xl">
               Carregando corretores...
            </div>
         ) : error ? (
            <div className="text-red-500 text-xl">{error}</div>
         ) : (
            <ExibirCorretores corretores={corretores} />
         )}
      </section>
   );
};

export default CorretoresSection;
