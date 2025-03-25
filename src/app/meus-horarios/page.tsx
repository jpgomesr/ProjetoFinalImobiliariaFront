"use client";

import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import { useState, useEffect } from "react";

interface Horario {
   id: number;
   dataHora: string;
}

export default function MeusHorarios() {
   const [data, setData] = useState("");
   const [horario, setHorario] = useState("");
   const [horarios, setHorarios] = useState<Horario[]>([]);
   const [horariosAgrupados, setHorariosAgrupados] = useState<{
      [key: string]: Horario[];
   }>({});

   const buscarHorarios = async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/corretores/horarios/meus-horarios`
         );
         if (!response.ok) throw new Error("Erro ao buscar horários");
         const data = await response.json();
         setHorarios(data);

         const grupos = data.reduce(
            (acc: { [key: string]: Horario[] }, horario: Horario) => {
               const data = horario.dataHora.split("T")[0];
               if (!acc[data]) acc[data] = [];
               acc[data].push(horario);
               return acc;
            },
            {}
         );
         setHorariosAgrupados(grupos);
      } catch (error) {
         console.error("Erro:", error);
      }
   };

   useEffect(() => {
      buscarHorarios();
   }, []);

   const handleSubmit = async () => {
      if (!data || !horario) return;

      const dataHora = `${data}T${horario}:00`;

      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/corretores/horarios`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ dataHora }),
            }
         );

         if (!response.ok) throw new Error("Erro ao cadastrar horário");

         buscarHorarios();
         setHorario("");
      } catch (error) {
         console.error("Erro:", error);
      }
   };

   return (
      <Layout>
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Meus horários">
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <h2 className="text-xl text-havprincipal">
                        Cadastro de horário
                     </h2>
                     <div className="flex gap-4 items-end">
                        <div className="flex-1">
                           <input
                              type="date"
                              value={data}
                              onChange={(e) => setData(e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-havprincipal"
                           />
                        </div>
                        <div className="flex-1">
                           <input
                              type="time"
                              value={horario}
                              onChange={(e) => setHorario(e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-havprincipal"
                           />
                        </div>
                        <button
                           onClick={handleSubmit}
                           className="bg-havprincipal text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                        >
                           Adicionar +
                        </button>
                     </div>
                  </div>

                  {Object.entries(horariosAgrupados).map(([data, horarios]) => (
                     <div key={data} className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-havprincipal">
                           Dia {new Date(data).toLocaleDateString("pt-BR")}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                           {horarios.map((horario) => (
                              <div
                                 key={horario.id}
                                 className="bg-havprincipal text-white px-4 py-2 rounded-lg"
                              >
                                 {horario.dataHora
                                    .split("T")[1]
                                    .substring(0, 5)}
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
}
