"use server";

import { fetchPerfilData } from "@/app/actions/perfil";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import PerfilClient from "./cliente";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const initialData = await fetchPerfilData(params.id);

  return (
    <Layout className="py-0">
      <SubLayoutPaginasCRUD>
        <FundoBrancoPadrao className="w-full" titulo="Perfil de Usuário">
          <PerfilClient initialData={initialData} />
        </FundoBrancoPadrao>
      </SubLayoutPaginasCRUD>
    </Layout>
  );
}
