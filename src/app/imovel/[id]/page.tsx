import Layout from "@/components/layout/LayoutPadrao";
import { Heart } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import GaleriaImagens from "@/components/galeria/GaleriaImagens";
import Image from "next/image";
import Link from "next/link";
import CardImovel from "@/components/card/CardImovel";
import {
   buscarIdsImoveis,
   buscarImoveisSemelhantes,
   buscarImovelPorIdPaginaImovel,
} from "@/Functions/imovel/buscaImovel";
import Share from "@/components/Share";
import MapboxMap from "@/components/Mapboxmap";
import ExibirCorretores from "@/components/componentes_sobre_nos/ExibirCorretores";

interface PageProps {
   params: Promise<{
      id: string;
   }>;
}
export async function generateStaticParams() {
   const ids = await buscarIdsImoveis();
   return ids.map((id) => ({ id: id.toString() }));
}

const Page = async ({ params }: PageProps) => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   if (!BASE_URL) {
      throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
   }
   const paramsResolvidos = await params;

   const { id } = paramsResolvidos;
   const imovel = await buscarImovelPorIdPaginaImovel(id, 60);
   const imoveisSemelhantes = await buscarImoveisSemelhantes(imovel, 60);

   if (!imovel) {
      return <p>Imóvel não encontrado.</p>;
   }

   const valorFormatado = (valor: number) => {
      return valor.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL",
      });
   };

   return (
      <Layout className="bg-begeClaroPadrao py-8">
         <div className="flex flex-col items-center w-full gap-1 md:flex-row md:px-8 md:items-start">
            <div className="w-11/12 lg:ml-24 md:ml-20">
               <GaleriaImagens imagens={imovel.imagens} />
            </div>

            {/* Textos alinhados com as imagens */}
            <div className="w-9/12 font-inter text-havprincipal mt-3 md:mt-0 md:ml-24 lg:ml-0">
               <p className="font-medium text-sm md:text-xl">À venda por</p>
               {imovel.precoPromocional ? (
                  <>
                     <h1 className="font-extrabold text-xl text-shadow md:text-3xl">
                        {valorFormatado(imovel.precoPromocional)}
                     </h1>
                     <p className="text-sm line-through opacity-75">
                        {valorFormatado(imovel.preco)}
                     </p>
                  </>
               ) : (
                  <h1 className="font-extrabold text-xl text-shadow md:text-3xl">
                     {valorFormatado(imovel.preco)}
                  </h1>
               )}
               <p className="font-semibold md:text-xl">{imovel.titulo}</p>
               <p className="w-full text-start md:w-9/12 md:text-lg">
                  {imovel.descricao}
               </p>
               {imovel.iptu && (
                  <p className="mt-2">
                     <strong>IPTU:</strong>{" "}
                     {valorFormatado(Number(imovel.iptu))}
                  </p>
               )}
               {imovel.condominio && (
                  <p className="mt-2">
                     <strong>Condominio:</strong>{" "}
                     {valorFormatado(Number(imovel.condominio))}
                  </p>
               )}
               <div className="flex gap-5 mt-2">
                  <button className="w-52 bg-havprincipal md:w-40 h-8 rounded-lg">
                     <Link href={`/agendamentos/${imovel.id}`}>
                        <p className="text-white text-center p-1 text-[15px]">
                           Agendar visita
                        </p>
                     </Link>
                  </button>
                  <div className="mt-1 flex gap-3 relative">
                     <Share />
                     <Heart />
                  </div>
               </div>
            </div>
         </div>
         <div className="w-full">
            <MapboxMap
               endereco={imovel.endereco}
               detalhesImovel={{
                  tamanho: imovel.tamanho,
                  qtdQuartos: imovel.qtdQuartos,
                  qtdGaragens: imovel.qtdGaragens,
                  qtdBanheiros: imovel.qtdBanheiros,
                  qtdPiscina: imovel.qtdPiscina,
                  qtdChurrasqueira: imovel.qtdChurrasqueira,
               }}
            />
         </div>

         <h2
            className="text-havprincipal text-center w-2/3 md:w-2/6 text-lg md:text-2xl 
                        font-semibold flex justify-center items-center mx-auto mt-8 mb-8"
         >
            Selecione um de nossos corretores e tenha uma conversa via chat
         </h2>
         <ExibirCorretores
            corretores={imovel.corretores.map((corretor) => ({
               ...corretor,
               agendamentos: 0, // Changed from empty array to number to match ExibirCorretor type
            }))}
         />
         <h2
            className="text-havprincipal text-center w-2/3 md:w-2/6 text-lg md:text-2xl 
                        font-semibold flex justify-center items-center mx-auto mt-8 mb-8"
         >
            Converse conosco via WhatsApp
         </h2>
         <div className="flex justify-center items-center mb-8">
            <Link
               href="https://wa.me/5551999999999"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:scale-110 transition-transform"
            >
               <Image
                  src="/icons8-whatsapp (1).svg"
                  alt="WhatsApp"
                  width={64}
                  height={64}
                  className="cursor-pointer"
               />
            </Link>
         </div>

         {/* Seção de Imóveis Semelhantes */}
         {imoveisSemelhantes && imoveisSemelhantes.length > 0 && (
            <div className="mt-10 px-8">
               <h2 className="text-2xl font-semibold text-havprincipal mb-6 flex justify-center items-center">
                  Imóveis Semelhantes
               </h2>
               <div className="flex flex-row gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {imoveisSemelhantes.map((imovelSemelhante) => (
                     <CardImovel
                        key={imovelSemelhante.id}
                        imovel={imovelSemelhante as any}
                     />
                  ))}
               </div>
            </div>
         )}
      </Layout>
   );
};

export default Page;
