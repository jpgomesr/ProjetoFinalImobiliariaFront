"use client"

import Layout from "@/components/layout/LayoutPadrao"
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD"
import { Calendario } from "@/components/calendario/Calendario"

const Page = () => {
  return (
    <Layout className={"py-0"}>
      <SubLayoutPaginasCRUD>
        <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-base text-center mb-4">
          <h1>Agendamento de Visitas com</h1>
          <h1 className="font-bold">HAV</h1>
        </div>
        <div className="w-full px-4 flex-grow flex flex-col">
          <div className="bg-havprincipal w-full rounded-xl flex-grow flex flex-col overflow-hidden">
            <Calendario />
          </div>
        </div>
      </SubLayoutPaginasCRUD>
    </Layout>
  )
}

export default Page

