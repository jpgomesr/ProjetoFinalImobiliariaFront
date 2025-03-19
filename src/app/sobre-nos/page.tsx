
import Layout from "@/components/layout/LayoutPadrao";
import React from "react";
import Image from "next/image";
import CardInfoSobreNos from "@/components/componentes_sobre_nos/CardInfoSobreNos";
import ModelExibirCorretor from "@/models/ModelExibirCorretor";
import ExibirCorretores from "@/components/componentes_sobre_nos/ExibirCorretores";

const page = async () => { 
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/corretorApresentacao/CORRETOR`,
         { next: { revalidate: 60 } }
      );

   const corretores = (await response.json()) as ModelExibirCorretor[];

   return (
      <Layout className="my-0">
         <div className="px-[1%] flex items-center text-center flex-col bg-cinzaPadrao py-[1.6%]">
            <div className="flex flex-col md:flex-row-reverse gap-[0.004%] lg:mr-40 lg:gap-16">
               <div className="lg:w-[57%] w-[70%] justify-center flex flex-col self-center">
                  <h1 className="text-4xl font-bold mb-[1rem] text-havprincipal xl:text-[2.7rem] xl:mt-[1.7rem]">
                     Especialista no mercado imobiliário
                  </h1>

                  <p className="px-4 text-havprincipal xl:text-[1.4rem] max-w-[70rem]">
                     Lorem ipsum dolor sit amet. Aut praesentium voluptas est
                     magnam doloribus non sint neque ut officia voluptatem est
                     amet molestiae. Lorem ipsum dolor sit amet. Aut praesentium
                     voluptas est magnam doloribus non sint neque.
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

            <div className="flex gap-6 mb-16 lg:gap-3 flex-col xl:gap-10 justify-center py-0 sm:flex-row sm:flex-wrap">
               <CardInfoSobreNos
                  imagemSrc={"/Vector.svg"}
                  titulo="Nos encontramos em jaragá do sul"
                  altImagem="Imagem"
               />

               <CardInfoSobreNos
                  imagemSrc={"/Vector (1).svg"}
                  titulo="Campeões em venda no ano de 2024"
                  altImagem="Imagem"
               />

               <CardInfoSobreNos
                  imagemSrc={"/Group 737.svg"}
                  titulo="50 mil propriedades para locação e venda"
                  altImagem="Imagem"
               />

               <CardInfoSobreNos
                  imagemSrc={"/Vector (2).svg"}
                  titulo="7 mil corretores associados"
                  altImagem="Imagem"
               />

               <CardInfoSobreNos
                  imagemSrc={"/Vector (3).svg"}
                  titulo="4 lojas próprias"
                  altImagem="Imagem"
               />
            </div>

            <h2 className="text-4xl font-bold mb-[1rem] text-havprincipal">
               Nossos objetivos
            </h2>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center xl:items-start text-center text-havprincipal text-2xl leading-normal">
               <div className="flex flex-col max-w-xs min-h-[200px] gap-4">
                  <h3 className="font-semibold">
                     Imóveis de Qualidade e Acessíveis
                  </h3>
                  <p className="text-font16">
                     Lorem ipsum dolor sit amet. Aut praesentium voluptas est
                     magnam doloribus non sint neque ut officia voluptatem est
                     amet molestiae. Lorem ipsum dolor sit amet.
                  </p>
               </div>

               <div className="flex flex-col max-w-xs min-h-[200px] gap-4">
                  <h3 className="font-semibold">
                     Atendimento Personalizado e Eficiente
                  </h3>
                  <p className="text-font16 mb-5">
                     Lorem ipsum dolor sit amet. Aut praesentium voluptas est
                     magnam doloribus non sint neque ut officia voluptatem est
                     amet molestiae. Lorem ipsum dolor sit amet.
                  </p>
               </div>

               <div className="flex flex-col max-w-xs min-h-[200px] gap-4">
                  <h3 className="font-semibold">
                     Expansão de Clientes e Reforço de Marca
                  </h3>
                  <p className="text-font16">
                     Lorem ipsum dolor sit amet. Aut praesentium voluptas est
                     magnam doloribus non sint neque ut officia voluptatem est
                     amet molestiae. Lorem ipsum dolor sit amet. Aut praesentium
                     voluptas est magnam doloribus non sint neque.
                  </p>
               </div>
            </div>

            <h2 className="text-4xl font-bold mb-[1rem] text-havprincipal">
               Nossa equipe
            </h2>
            <div className="flex-row">
               <ExibirCorretores corretores={corretores} />
            </div>
         </div>
      </Layout>
   );
};

export default page;

