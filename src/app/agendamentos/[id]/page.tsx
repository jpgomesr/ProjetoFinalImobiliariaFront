import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import AgendamentoForm from "./AgendamentoForm";

interface PageProps {
   params: {
      id: string;
   };
}

const Page = ({ params }: PageProps) => {
   return (
      <Layout className={"py-0"}>
         <SubLayoutPaginasCRUD>
            <div className="flex flex-col items-center text-havprincipal font-montserrat w-full text-xl md:text-2xl lg:text-3xl text-center mb-4 md:mb-6 lg:mb-8">
               <h1>Agendamento de Visitas com</h1>
               <h1 className="font-bold">HAV</h1>
            </div>
            <AgendamentoForm id={params.id} />
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
