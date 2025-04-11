"use server";

import { revalidatePath } from "next/cache";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { fetchComAutorizacao } from "@/hooks/FetchComAuthorization";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface salvarImovelProps {
   imovel: {
      titulo: string;
      descricao: string;
      tamanho: string;
      qtdQuartos: string;
      qtdBanheiros: string;
      qtdGaragens: string;
      qtdChurrasqueira: string;
      qtdPiscina: string;
      finalidade: string;
      academia: boolean;
      preco: string;
      precoPromocional: string;
      permitirDestaque: boolean;
      habilitarVisibilidade: boolean;
      banner: boolean;
      tipoBanner: string;
      iptu: string;
      valorCondominio: string;
      idProprietario: number;
      ativo: boolean;
      endereco: {
         rua: string;
         bairro: string;
         cidade: string;
         estado: string;
         tipoResidencia: string;
         cep: string;
         numeroCasaPredio: string;
         numeroApartamento: string;
      };
      corretores: {
         id: number;
         nome: string;
      }[];
   };
   imagens: {
      imagemPrincipal: string | File | null;
      imagensGaleria: (string | File)[] | null;
   };
}

export async function salvarImovel(props: salvarImovelProps) {

   const { imovel, imagens } = props;

   const imovelFormatado = {
      ...imovel,
      tamanho: imovel.tamanho === "" ? undefined : parseFloat(imovel.tamanho),
      qtdQuartos:
         imovel.qtdQuartos === "" ? undefined : parseInt(imovel.qtdQuartos),
      qtdBanheiros:
         imovel.qtdBanheiros === "" ? undefined : parseInt(imovel.qtdBanheiros),
      qtdGaragens:
         imovel.qtdGaragens === "" ? undefined : parseInt(imovel.qtdGaragens),
      qtdChurrasqueira:
         imovel.qtdChurrasqueira === ""
            ? undefined
            : parseInt(imovel.qtdChurrasqueira),
      qtdPiscina:
         imovel.qtdPiscina === "" ? undefined : parseInt(imovel.qtdPiscina),
      preco: imovel.preco === "" ? undefined : parseFloat(imovel.preco),
      precoPromocional:
         imovel.precoPromocional === ""
            ? undefined
            : parseFloat(imovel.precoPromocional),

      tipoBanner: imovel.tipoBanner === "" ? undefined : imovel.tipoBanner,
      iptu: imovel.iptu === "" ? undefined : parseFloat(imovel.iptu),
      valorCondominio:
         imovel.valorCondominio === ""
            ? undefined
            : parseFloat(imovel.valorCondominio),
      endereco: {
         ...imovel.endereco,
         numeroApartamento:
            imovel.endereco.numeroApartamento === ""
               ? undefined
               : imovel.endereco.numeroApartamento,
      },
   };

   try {
      const formData = new FormData();
      formData.append(
         "imovel",
         new Blob([JSON.stringify(imovelFormatado)], {
            type: "application/json",
         })
      );
      if (imagens.imagemPrincipal) {
         formData.append("imagemPrincipal", imagens.imagemPrincipal);
      }
      if (imagens.imagensGaleria && imagens.imagensGaleria.length > 0) {
         console.log(imagens.imagensGaleria);
         imagens.imagensGaleria.forEach((imagem) => {
            if (imagem != null) {
               formData.append("imagens", imagem);
            }
         });
      }
      const response = await fetchComAutorizacao(`${BASE_URL}/imoveis`, {
         method: "POST",
         body: formData, 
      });

      const data = await response.json();

      data.ok = response.ok;

      const imovelSalvo: ModelImovelGet = await data;
      revalidatePath(`/gerenciamento/imoveis/edicao/${imovelSalvo.id}`);
      revalidatePath(`/imovel/${imovelSalvo.id}`);

      return await data;
   } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      throw error;
   }
}
