import { fetchPerfilData } from "@/app/actions/perfil";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import PerfilClient from "./cliente";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const initialData = await fetchPerfilData(id);

  return (
    <Layout>
      <SubLayoutPaginasCRUD>
        <FundoBrancoPadrao titulo="Perfil de Usuário">
          <PerfilClient initialData={initialData} />
        </FundoBrancoPadrao>
      </SubLayoutPaginasCRUD>
    </Layout>
  );
}
