"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Schema de validação para os dados do imóvel
const imovelSchema = z.object({
   id: z.string().optional(),
   titulo: z.string(),
   descricao: z.string(),
   metragem: z.number(),
   qtdQuartos: z.number(),
   qtdBanheiros: z.number(),
   qtdVagas: z.number(),
   qtdChurrasqueiras: z.number().optional().default(0),
   qtdPiscinas: z.number().optional().default(0),
   objImovel: z.string(),
   academia: z.boolean().optional().default(false),
   valor: z.number(),
   valorPromo: z.number().optional().nullable(),
   destaque: z.boolean().optional().default(false),
   visibilidade: z.boolean().optional().default(true),
   banner: z.string().optional().nullable(),
   tipoBanner: z.string().optional().nullable(),
   iptu: z.number().optional().nullable(),
   valorCondominio: z.number().optional().nullable(),
   proprietario: z.object({
      id: z.number(),
   }),
   rua: z.string(),
   bairro: z.string(),
   cidade: z.string(),
   estado: z.string(),
   tipo: z.string(),
   cep: z.string(),
   numero: z.string(),
   numeroApto: z.string().optional().nullable(),
   corretores: z.array(z.number()).optional(),
   imagens: z.object({
      imagemPrincipal: z.any().optional(),
      imagensGaleria: z.array(z.any()).optional(),
   }),
});

export type ImovelEditPayload = z.infer<typeof imovelSchema>;

// Função auxiliar para converter os dados do formulário para o formato esperado pela action
export const formatarDadosFormulario = async (data: any): Promise<ImovelEditPayload> => {
   return {
      id: data.id?.toString(),
      titulo: data.titulo,
      descricao: data.descricao,
      metragem: Number(data.metragem),
      qtdQuartos: Number(data.qtdQuartos),
      qtdBanheiros: Number(data.qtdBanheiros),
      qtdVagas: Number(data.qtdVagas),
      qtdChurrasqueiras:
         data.qtdChurrasqueiras !== undefined
            ? Number(data.qtdChurrasqueiras)
            : 0,
      qtdPiscinas:
         data.qtdPiscinas !== undefined ? Number(data.qtdPiscinas) : 0,
      objImovel: data.objImovel,
      academia: data.academia || false,
      valor: Number(data.valor),
      valorPromo: data.valorPromo ? Number(data.valorPromo) : null,
      destaque: data.destaque || false,
      visibilidade: data.visibilidade || true,
      banner: data.banner,
      tipoBanner: data.tipoBanner,
      iptu: data.iptu ? Number(data.iptu) : null,
      valorCondominio: data.valorCondominio
         ? Number(data.valorCondominio)
         : null,
      proprietario: data.proprietario,
      rua: data.rua,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      tipo: data.tipo,
      cep: data.cep,
      numero: data.numero,
      numeroApto: data.numeroApto,
      corretores: data.corretores,
      imagens: data.imagens,
   };
};

/**
 * Função para editar um imóvel utilizando server actions
 */
export async function editarImovel(
   formData: any,
   token: string,
   refImagensDeletadas?: string[]
) {
   try {
      // Formatar os dados para garantir o formato correto
      const data = await formatarDadosFormulario(formData);

      // Prepara os dados para envio
      const jsonRequest = {
         titulo: data.titulo,
         descricao: data.descricao,
         tamanho: data.metragem,
         qtdQuartos: data.qtdQuartos,
         qtdBanheiros: data.qtdBanheiros,
         qtdGaragens: data.qtdVagas,
         qtdChurrasqueira: data.qtdChurrasqueiras,
         qtdPiscina: data.qtdPiscinas,
         finalidade: data.objImovel,
         academia: data.academia,
         preco: data.valor,
         precoPromocional: data.valorPromo,
         permitirDestaque: data.destaque,
         habilitarVisibilidade: data.visibilidade,
         banner: data.banner,
         tipoBanner: data.tipoBanner,
         iptu: data.iptu,
         valorCondominio: data.valorCondominio,
         idProprietario: data.proprietario.id,
         ativo: data.visibilidade,
         endereco: {
            rua: data.rua,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            tipoResidencia: data.tipo,
            cep: data.cep,
            numeroCasaPredio: data.numero,
            numeroApartamento: data.numeroApto,
         },
         corretores: data.corretores,
      };

      // Cria um FormData para enviar os arquivos junto com o JSON
      const formDataToSend = new FormData();
      const params = new URLSearchParams();

      // Adiciona o objeto JSON ao FormData
      formDataToSend.append(
         "imovel",
         new Blob([JSON.stringify(jsonRequest)], { type: "application/json" })
      );

      // Adiciona a imagem principal se existir e for um arquivo
      if (
         data.imagens.imagemPrincipal &&
         data.imagens.imagemPrincipal instanceof File
      ) {
         formDataToSend.append("imagemPrincipal", data.imagens.imagemPrincipal);
      }

      // Adiciona as imagens da galeria se existirem
      if (
         data.imagens.imagensGaleria &&
         data.imagens.imagensGaleria.length > 0
      ) {
         data.imagens.imagensGaleria.forEach((imagem) => {
            if (imagem instanceof File) {
               formDataToSend.append("imagens", imagem);
            }
         });
      }

      // Adiciona referências de imagens deletadas aos parâmetros da URL se existirem
      if (refImagensDeletadas && refImagensDeletadas.length > 0) {
         refImagensDeletadas.forEach((ref) => {
            params.append("refImagensDeletadas", ref);
         });
      }

      // Cria a URL com os parâmetros
      const url = new URL(`${BASE_URL}/imoveis/${data.id}`);
      url.search = params.toString();

      // Executa a requisição PUT com o token de autorização
      const response = await fetch(url, {
         method: "PUT",
         headers: {
            Authorization: `Bearer ${token}`,
         },
         body: formDataToSend,
      });

      // Revalida os caminhos para atualizar a página
      revalidatePath(`/gerenciamento/imoveis/edicao/${data.id}`);
      revalidatePath(`/imovel/${data.id}`);
      revalidatePath(`/gerenciamento/imoveis`);

      // Retorna o resultado para o cliente
      if (!response.ok) {
         const errorData = await response.json();
         return {
            success: false,
            message: "Erro ao editar imóvel",
            error: errorData,
         };
      }

      const result = await response.json();
      return {
         success: true,
         message: "Imóvel editado com sucesso",
         data: result,
      };
   } catch (error) {
      console.error("Erro ao editar imóvel:", error);
      return {
         success: false,
         message: "Erro ao processar a requisição",
         error: error instanceof Error ? error.message : String(error),
      };
   }
}
