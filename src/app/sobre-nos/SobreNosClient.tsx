"use client";

import React from "react";
import Image from "next/image";
import CardInfoSobreNos from "@/components/componentes_sobre_nos/CardInfoSobreNos";
import CorretoresSection from "@/components/componentes_sobre_nos/CorretoresSection";
import { useLanguage } from "@/context/LanguageContext";

interface SobreNosClientProps {
  // Se precisar passar props do servidor para o cliente, defina-as aqui
}

const SobreNosClient: React.FC<SobreNosClientProps> = () => {
   const { t } = useLanguage();

   return (
     <main className="px-[1%] flex items-center text-center flex-col bg-cinzaPadrao py-[1.6%]">
         <div className="flex flex-col md:flex-row-reverse gap-[0.004%] lg:mr-40 lg:gap-16">
            <div className="lg:w-[57%] w-[70%] justify-center flex flex-col self-center">
               <h1 className="text-4xl font-bold mb-[1rem] text-havprincipal xl:text-[2.7rem] xl:mt-[1.7rem]">
                  {t("aboutUs.title")}
               </h1>

               <p className="px-4 text-havprincipal text-base xl:text-xl max-w-[70rem]">
                  {t("aboutUs.text")}
               </p>
            </div>

            <div className="flex items-center justify-center">
               <Image
                  src={"/Group 743.png"}
                  alt="Cover image preview"
                  width={1920}
                  height={1080}
                  className=" self-center w-60 h-60 my-8 sm:h-64 sm:w-64 xl:h-100 xl:w-100"
               />
            </div>
         </div>

         <section className="flex gap-6 mb-16 lg:gap-3 flex-col xl:gap-10 justify-center py-0 sm:flex-row sm:flex-wrap">
            <CardInfoSobreNos
               imagemSrc={"/Vector.svg"}
               titulo={t("aboutUs.topic1")}
               altImagem="Imagem"
            />

            <CardInfoSobreNos
               imagemSrc={"/Vector (1).svg"}
               titulo={t("aboutUs.topic2")}
               altImagem="Imagem"
            />

            <CardInfoSobreNos
               imagemSrc={"/Group 737.svg"}
               titulo={t("aboutUs.topic3")}
               altImagem="Imagem"
            />

            <CardInfoSobreNos
               imagemSrc={"/Vector (2).svg"}
               titulo={t("aboutUs.topic4")}
               altImagem="Imagem"
            />

            <CardInfoSobreNos
               imagemSrc={"/Vector (3).svg"}
               titulo={t("aboutUs.topic5")}
               altImagem="Imagem"
            />
         </section>
         <div className="flex items-center lg:w-11/12 text-center justify-center">
            <h2 className="text-4xl font-bold mb-[1rem] text-havprincipal text-center">
               {t("aboutUs.title2")}
            </h2>
         </div>

         <section className="flex flex-col justify-center items-center gap-4  sm:flex-row   lg:justify-between lg:gap-12 lg:w-11/12 xl:items-start text-center text-havprincipal text-2xl leading-normal lg:mt-4">
            <div className="flex flex-col w-10/12 items-center justify-center min-h-[200px] gap-4">
               <h3 className="font-semibold">
                  {t("aboutUs.title3")}
               </h3>
               <p className="text-base lg:text-lg text-justify">
                  {t("aboutUs.properties")}
               </p>
            </div>

            <div className="flex flex-col w-10/12 items-center justify-center min-h-[200px] gap-4">
               <h3 className="font-semibold">
                  {t("aboutUs.title4")}
               </h3>
               <p className="text-base lg:text-lg text-justify">
                  {t("aboutUs.services")}
               </p>
            </div>

            <div className="flex flex-col w-10/12 items-center justify-center min-h-[200px] gap-4">
               <h3 className="font-semibold">
                  {t("aboutUs.title5")}
               </h3>
               <p className="text-base lg:text-lg text-justify">
                  {t("aboutUs.expansion")}
               </p>
            </div>
         </section>

         <h2 className="text-4xl font-bold mb-[1rem] text-havprincipal">
            {t("aboutUs.tittle6")}
         </h2>
         <CorretoresSection />
     </main>
   );
};

export default SobreNosClient; 