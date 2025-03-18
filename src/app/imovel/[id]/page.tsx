"use client";

import Layout from "@/components/layout/LayoutPadrao";
import { BedDouble, Car, Heart, Ruler, Share2, ShowerHead, WavesLadder } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";
// Importação dinâmica do MapboxMap para evitar problemas de SSR
const MapboxMap = dynamic(() => import("@/components/Mapboxmap"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>
});

// Defina a interface para o tipo Imovel
interface Imovel {
  id: number;
  titulo: string;
  descricao: string;
  preco: string;
  iptu: string;
  condominio: string;
  tamanho: string;
  qtdBanheiros: number;
  qtdQuartos: number;
  qtdGaragens: number;
  qtdPiscina: number;
  qtdChurrasqueira: number;
  imagemPrincipal: string;
  imagens: string[];
  endereco : EnderecoMapBox;
}

const Page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!BASE_URL) {
    throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
  }

  const { id } = useParams(); // Obtém o ID do imóvel da URL
  const [imovel, setImovel] = useState<Imovel | null>(null); // Define o tipo do estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Imagem padrão
  const IMAGEM_PADRAO = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg";

  // Função para buscar os dados do imóvel
  useEffect(() => {
    if (!id) return; // Verifica se o ID está disponível

    const fetchImovel = async () => {
      try {
        const response = await fetch(`${BASE_URL}/imoveis/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do imóvel");
        }
        const data = await response.json();
        setImovel(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImovel();
  }, [id]);

  console.log(imovel);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  if (!imovel) {
    return <p>Imóvel não encontrado.</p>;
  }

  return (
    <Layout className="bg-begepadrao py-8">
      <div className="flex flex-col items-center w-full gap-1 md:flex-row md:px-8 md:items-start">
        {/* Imagem principal */}
        <div className="flex flex-col gap-1 items-center md:items-start md:ml-36">
          <div className="flex justify-center md:justify-start">
            <Image
              src={IMAGEM_PADRAO}
              alt="House image"
              width={1920}
              height={1080}
              className="w-10/12 md:w-[400px]"
            />
          </div>

          {/* Grid de 3 imagens */}
          <div className="grid grid-cols-3 w-10/12 gap-1 md:w-[400px] md:justify-start">
            {[1, 2, 3].map((_, index) => (
              <Image
                key={index}
                src={IMAGEM_PADRAO}
                alt="House image"
                width={1920}
                height={1080}
                className="w-full"
              />
            ))}
          </div>
        </div>

        {/* Textos alinhados com as imagens */}
        <div className="w-10/12 font-inter text-havprincipal mt-3 md:mt-0 md:ml-24 md:w-[500px]">
          <p className="font-medium text-sm md:text-xl">À venda por</p>
          <h1 className="font-extrabold text-xl text-shadow md:text-3xl">R${imovel.preco}</h1>
          <p className="font-semibold md:text-xl">{imovel.titulo}</p>
          <p className="w-full md:w-full md:text-lg">{imovel.descricao}</p>
          {imovel.iptu && (
            <p className="mt-2">
              <strong>IPTU:</strong> R${imovel.iptu}
            </p>
          )}
          {imovel.condominio && (
            <p className="mt-2">
              <strong>Condominio:</strong> R${imovel.condominio}
            </p>
          )}
          <div className="flex gap-5 mt-2">
            <button className="w-5/12 bg-havprincipal h-8 rounded-lg">
              <p className="text-white text-center p-1 text-[15px]">Agendar visita</p>
            </button>
            <div className="mt-1 flex gap-3">
              <Share2 />
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
            qtdChurrasqueira: imovel.qtdChurrasqueira
          }}
        />
      </div>
    </Layout>
  );
};

export default Page;