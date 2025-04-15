"use client";

import { useLanguage } from "@/context/LanguageContext";
import CardImovel from "./card/CardImovel";
import TituloBgDegrade from "./TituloBgDegrade";
import { ModelImovelGet } from "@/models/ModelImovelGet";

interface HomePageProps {
   imoveisDestaque: {
      imoveis: ModelImovelGet[];
   };
   imoveisCondicoesEspeciais: {
      imoveis: ModelImovelGet[];
   };
   imoveisRecentes: {
      imoveis: ModelImovelGet[];
   };
}

export default function HomePage({ imoveisDestaque, imoveisCondicoesEspeciais, imoveisRecentes }: HomePageProps) {
   const { t } = useLanguage();

   return (
      <>
         <section className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text={t("HomePage.featuredProperties")} boldText={t("HomePage.featuredProperties2")} />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveisDestaque.imoveis.map((imovel: ModelImovelGet, index: number) => (
                  <CardImovel key={index} imovel={imovel} />
               ))}
            </div>
         </section>
         <section className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade text={t("HomePage.specialProperties")} boldText={t("HomePage.specialProperties2")} />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveisCondicoesEspeciais.imoveis.map((imovel: ModelImovelGet, index: number) => {
                  imovel.permitirDestaque = false;
                  return <CardImovel key={index} imovel={imovel} />;
               })}
            </div>
         </section>
         <section className="mt-4 flex flex-col gap-6">
            <TituloBgDegrade
               text={t("HomePage.recentlyAddedProperties")}
               boldText={t("HomePage.recentlyAddedProperties2")}
            />
            <div className="flex flex-row gap-4 overflow-x-auto px-8 pb-2 bg-scroll hide-scrollbar">
               {imoveisRecentes.imoveis.map((imovel: ModelImovelGet, index: number) => {
                  imovel.permitirDestaque = false;
                  return <CardImovel key={index} imovel={imovel} />;
               })}
            </div>
         </section>
      </>
   );
} 