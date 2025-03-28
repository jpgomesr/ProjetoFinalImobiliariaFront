"use client";

import React from "react";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import { useSearchParams } from "next/navigation";
import ListFiltroPadrao from "@/components/ListFiltroPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import InputsPergunta from "@/components/componentes_perguntas_frequentes/InputsPergunta";
import ListText from "@/components/ListText";

const page = () => {
   const searchParams = useSearchParams();
   const opcaoSelecionada = searchParams.get("opcao");

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Faça uma pergunta" className="w-full">
               <ListFiltroPadrao
                  width="w-full"
                  opcoes={[
                     { id: "1", label: "Login ou Cadastro" },
                     { id: "2", label: "Pagamentos" },
                     { id: "3", label: "Promoções" },
                     { id: "4", label: "Outros" },
                  ]}
                  buttonHolder="Assunto"
                  value={opcaoSelecionada || ""}
                  url="/perguntas-frequentes"
                  nomeAributo="opcao"
                  bordaPreta
               />
               {opcaoSelecionada === "1" && (
                  <div>
                     <InputsPergunta placeholder="Ex: Como faço para cadastrar-me no site?" />
                  </div>
               )}
               {opcaoSelecionada === "2" && (
                  <div>
                     <InputsPergunta placeholder="Ex: Aceita pix?" />
                  </div>
               )}
               {opcaoSelecionada === "3" && (
                  <div>
                     <InputsPergunta placeholder="Ex: Até quando a promoção estará disponível?" />
                  </div>
               )}
               {opcaoSelecionada === "4" && (
                  <div>
                     <InputsPergunta placeholder="Ex: Qual o dono da empresa?" />
                  </div>
               )}
               <BotaoPadrao
                  texto="Enviar"
                  className="bg-havprincipal text-white w-[120px] sm:w-[120px] md:w-[120px] lg:w-[120px] xl:w-[120px] self-center whitespace-nowrap"
                  onClick={() => {}}
               />
            </FundoBrancoPadrao>
            <div className="flex my-4"></div>
            <FundoBrancoPadrao titulo="Perguntas Frequentes" className="w-full">
               <div className="flex flex-col gap-4">
                  <ListText
                     titulo="Como agendar uma visita a um imóvel?"
                     texto="Você pode agendar diretamente pelo nosso site, escolhendo o imóvel e selecionando um horário disponível. Caso prefira, também é possível marcar uma visita pelo WhatsApp ou entrando em contato com um de nossos corretores."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="Quais documentos são necessários para alugar um imóvel?"
                     texto="Para alugar um imóvel, é necessário apresentar RG, CPF, comprovante de renda e comprovante de residência. Dependendo do contrato, também pode ser exigido um fiador, caução ou seguro-fiança para garantir o pagamento do aluguel."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="Qual o prazo para aprovação do cadastro de locação?"
                     texto="O prazo para análise do cadastro varia conforme a demanda, mas geralmente leva até 48 horas após o envio de todos os documentos necessários. Caso seja preciso complementar alguma informação, a análise pode demorar um pouco mais."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="Posso alugar um imóvel sem fiador?"
                     texto="Sim, oferecemos outras garantias como caução, seguro-fiança e título de capitalização. Essas opções permitem que você alugue um imóvel sem precisar de um fiador, tornando o processo mais rápido e acessível. Consulte-nos para saber qual alternativa é mais adequada para você."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="Como funciona o financiamento de um imóvel?"
                     texto="O financiamento imobiliário é concedido por bancos, que avaliam sua renda e crédito para definir o valor das parcelas. Após a aprovação, o imóvel fica vinculado ao financiamento até a quitação da dívida. Oferecemos suporte para ajudar você a escolher a melhor opção."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="O IPTU está incluso no valor do aluguel?"
                     texto="Isso depende do contrato de locação. Em alguns casos, o proprietário já inclui o IPTU no valor do aluguel, enquanto em outros, o inquilino deve pagá-lo separadamente. Antes de assinar o contrato, verifique essa informação com a imobiliária."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="O que fazer se o imóvel alugado precisar de reparos?"
                     texto="Se houver necessidade de reparos, entre em contato com a imobiliária para relatar o problema. Reparos estruturais, como infiltrações e problemas elétricos, são de responsabilidade do proprietário, enquanto manutenções decorrentes do uso, como troca de lâmpadas ou pequenos consertos, são do inquilino."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="Posso negociar o valor do aluguel?"
                     texto="Sim, você pode apresentar uma proposta ao proprietário para avaliação. A negociação depende da aceitação do dono do imóvel, que pode considerar fatores como a demanda, o tempo de contrato e as garantias oferecidas. Nossa equipe auxilia nesse processo para obter a melhor condição para ambas as partes."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="Como funciona a rescisão do contrato de aluguel?"
                     texto="Caso queira rescindir o contrato antes do prazo acordado, é necessário comunicar a imobiliária com antecedência, geralmente 30 dias. Pode haver a cobrança de multa rescisória, conforme estipulado no contrato. Recomendamos verificar essas condições antes de tomar qualquer decisão."
                     divClassName="w-full"
                     bordaPreta
                  />
                  <ListText
                     titulo="A imobiliária cobra taxa de serviço?"
                     texto="Sim, cobramos taxa de administração para locação e comissão sobre a venda de imóveis. No caso do aluguel, a taxa cobre serviços como intermediação, análise de crédito e suporte ao inquilino e proprietário. Para vendas, a comissão é um percentual sobre o valor do imóvel."
                     divClassName="w-full"
                     bordaPreta
                  />
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
