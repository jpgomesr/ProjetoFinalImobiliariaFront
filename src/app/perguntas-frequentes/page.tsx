import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import List from "@/components/List";

const page = () => {
   return (
      <Layout className="py-0 w-full">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Perguntas Frequentes" className="w-full">
                  <div className="w-full">
                     <List
                        title="Selecione o assunto para entrar em contato"
                        bordaPreta
                        divClassName="w-full"
                        opcoes={[
                           { id: 1, label: "Login" },
                           { id: 2, label: "Cadastro" },
                           { id: 3, label: "Pagamentos" },
                           { id: 4, label: "Pedidos" },
                           { id: 5, label: "Produtos" },
                           { id: 6, label: "Serviços" },
                           { id: 7, label: "Promoções" },
                           { id: 8, label: "Suporte" },
                           { id: 9, label: "Outros" },
                        ]}
                     />
                     <h1>Selecione o assunto para entrar em contato</h1>
                  </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
