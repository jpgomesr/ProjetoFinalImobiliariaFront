"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputPadrao from "@/components/InputPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import UploadGaleriaImagens from "@/components/ComponentesCrud/UploadGaleriaImagens";
import Switch from "@/components/ComponentesCrud/Switch";
import TextArea from "@/components/ComponentesCrud/TextArea";
import List from "@/components/List";
import { TipoBanner } from "@/models/Enum/TipoBanner";
import { createImovelValidator } from "@/validators/Validators";
import { useRouter } from "next/navigation";
import { ModelImovelGet } from "@/models/ModelImovelGet";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";
import Erro404 from "@/components/Erro404";
import { restaurarCampos, preencherCampos } from "@/Functions/requisicaoViaCep";
import SearchSelect from "@/components/SearchSelect";
import { ModelCorretor } from "@/models/ModelCorretor";
import { ModelProprietarioList } from "@/models/ModelProprietarioList";

interface FormularioProps {
   imovel: ModelImovelGet;
}

const Formulario = ({ imovel }: FormularioProps) => {
   const router = useRouter();
   const proprietarioModel: ModelProprietarioList[] = [];
   const corretoresModel: ModelCorretor[] = [];

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const { showNotification } = useNotification();
   const [loading, setLoading] = useState(true);
   const [erro404, setErro404] = useState(false);

   const [refImagensDeletadas, setRefImagensDeletadas] = useState<string[]>();
   const [step, setStep] = useState(1);
   const [camposDesabilitados, setCamposDesabilitados] = useState({
      cidadeDesabilitada: true,
      bairroDesabilitado: true,
      ruaDesabilitada: true,
      estadoDesabilitado: true,
   });

   const imovelValidator = createImovelValidator();
   type imovelValidatorSchema = z.infer<typeof imovelValidator>;

   const hadleRefImagensDel = (ref: string) => {
      setRefImagensDeletadas((prev: string[] | undefined) => {
         return [ref, ...(prev || [])];
      });
   };

   const tipoBanner = [
      { id: TipoBanner.ADQUIRIDO, label: "Adquirido" },
      { id: TipoBanner.ALUGADO, label: "Alugado" },
      { id: TipoBanner.DESCONTO, label: "Desconto" },
      { id: TipoBanner.MELHOR_PRECO, label: "Melhor Preço" },
      { id: TipoBanner.PROMOCAO, label: "Promoção" },
   ];
   const objImovel = [
      { id: "VENDA", label: "Venda" },
      { id: "ALUGUEL", label: "Aluguel" },
   ];
   const tiposDeImovel = [
      { id: "CASA", label: "Casa" },
      { id: "APARTAMENTO", label: "Apartamento" },
   ];

   const {
      register,
      handleSubmit,
      control,
      watch,
      trigger,
      formState: { errors, isSubmitting },
      clearErrors,
      setValue,
      setError,
   } = useForm<imovelValidatorSchema>({
      resolver: zodResolver(imovelValidator),
   });

   useEffect(() => {
      if (!imovel) {
         setErro404(true);
         return;
      }

      const buscarImovel = async () => {
         try {
            if (imovel) {
               preencherFormulario(imovel);
            } else {
               setErro404(true);
               console.error("Erro ao buscar os dados do imóvel");
            }
         } catch (error) {
            console.error("Erro ao buscar os dados do imóvel:", error);
            setErro404(true);
         } finally {
            setLoading(false);
         }
      };

      buscarImovel();
   }, []);

   const preencherFormulario = (imovel: ModelImovelGet) => {
      console.log(imovel.proprietario);
      console.log(imovel.corretores);

      setValue("id", imovel.id.toString());
      setValue("titulo", imovel.titulo);
      setValue("descricao", imovel.descricao);
      setValue("metragem", Number(imovel.tamanho));
      setValue("qtdQuartos", Number(imovel.qtdQuartos));
      setValue("qtdBanheiros", Number(imovel.qtdBanheiros));
      setValue("qtdVagas", Number(imovel.qtdGaragens));
      setValue("qtdChurrasqueiras", Number(imovel.qtdChurrasqueira));
      setValue("qtdPiscinas", Number(imovel.qtdPiscina));
      setValue("valor", Number(imovel.preco));
      setValue("valorPromo", Number(imovel.precoPromocional));
      setValue("iptu", Number(imovel.iptu));
      setValue("valorCondominio", Number(imovel.valorCondominio));
      setValue("objImovel", imovel.finalidade || objImovel[0].id);
      setValue("tipo", imovel.endereco.tipoResidencia);
      setValue("banner", imovel.banner || false);
      setValue("tipoBanner", imovel.tipoBanner || tipoBanner[0].id);
      setValue("destaque", imovel.permitirDestaque || false);
      setValue("visibilidade", imovel.habilitarVisibilidade || false);
      setValue("academia", imovel.academia || false);
      setValue("cep", Number(imovel.endereco.cep));
      setValue("bairro", imovel.endereco.bairro);
      setValue("estado", imovel.endereco.estado || "");
      setValue("cidade", imovel.endereco.cidade);
      setValue("rua", imovel.endereco.rua);
      setValue("numero", Number(imovel.endereco.numeroCasaPredio));
      setValue("numeroApto", Number(imovel.endereco.numeroApartamento));
      setValue("proprietario", imovel.proprietario);
      setValue("corretores", imovel.corretores);
      setValue("imagens", {
         imagemPrincipal:
            imovel.imagens.find((img) => img.imagemCapa)?.referencia || "",
         imagensGaleria:
            imovel.imagens
               .filter((img) => !img.imagemCapa)
               .map((img) => img.referencia) || [],
      });
      console.log(watch("proprietario"));
      console.log(watch("corretores"));
   };

   const handleNextStep = async (e: React.MouseEvent) => {
      e.preventDefault();
      if (step === 1) {
         const valor = watch("valor");
         const valorPromo = watch("valorPromo");
         if (
            valor !== undefined &&
            valorPromo !== undefined &&
            valor <= valorPromo
         ) {
            setError("valorPromo", {
               message: "Valor promocional deve ser menor que o valor",
            });
         } else {
            const isValid = await trigger(
               [
                  "titulo",
                  "descricao",
                  "metragem",
                  "qtdQuartos",
                  "qtdBanheiros",
                  "qtdVagas",
                  "valor",
                  "valorPromo",
                  "iptu",
                  "valorCondominio",
                  "objImovel",
                  "tipo",
               ],
               { shouldFocus: true }
            );
            if (isValid) {
               setStep((prev) => prev + 1);
            }
         }
      }
      if (step === 2) {
         const isValid = await trigger(
            [
               "cep",
               "bairro",
               "estado",
               "cidade",
               "rua",
               "imagens",
               "imagens.imagemPrincipal",
               "imagens.imagensGaleria",
               "numero",
               "numeroApto",
            ],
            { shouldFocus: true }
         );

         if (isValid) {
            setStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
         }
      }
   };

   useEffect(() => {
      if (watch("cep")) {
         const cepMock = watch("cep").toString();

         if (cepMock?.length === 8) {
            preencherCampos(cepMock, setCamposDesabilitados, setValue, true);
         } else {
            restaurarCampos(setCamposDesabilitados, setValue);
         }
      }
   }, [watch("cep")]);

   const handlePrevStep = (e: React.MouseEvent) => {
      e.preventDefault();
      setStep((prev) => prev - 1);
   };

   useEffect(() => {
      console.log(errors);
      console.log(typeof watch("numero"));
   }, [errors]);

   const handleEditarImovel = async (data: imovelValidatorSchema) => {
      console.log(data);

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

      const formData = new FormData();
      const params = new URLSearchParams();
      formData.append(
         "imovel",
         new Blob([JSON.stringify(jsonRequest)], { type: "application/json" })
      );
      if (
         data.imagens.imagemPrincipal &&
         data.imagens.imagemPrincipal instanceof File
      ) {
         formData.append("imagemPrincipal", data.imagens.imagemPrincipal);
      }
      if (
         data.imagens.imagensGaleria &&
         data.imagens.imagensGaleria.length > 0
      ) {
         data.imagens.imagensGaleria.forEach((imagem) => {
            if (imagem instanceof File) {
               formData.append("imagens", imagem);
            }
         });
      }
      if (refImagensDeletadas) {
         refImagensDeletadas.forEach((ref) => {
            params.append(`refImagensDeletadas`, ref);
         });
      }

      const url = new URL(`${BASE_URL}/imoveis/${data.id}`);
      url.search = params.toString();

      const response = await fetch(url, {
         method: "PUT",
         body: formData,
      });
      console.log(await response.json());

      if (response.ok) {
         showNotification("Imóvel editado com sucesso");
         clearErrors();

         // Força revalidação e redireciona
         router.refresh();
         router.push("/gerenciamento/imoveis");
      } else {
         console.error("Erro ao salvar o imóvel");
      }
   };

   if (loading) {
      return <div>Carregando...</div>; // Exibe um indicador de carregamento
   }

   if (erro404) {
      return <Erro404 />; // Exibe a página de erro 404
   }

   const handleInputChange = (variable: keyof imovelValidatorSchema) => {
      clearErrors(variable);
   };

   return (
      <form
         onSubmit={handleSubmit(handleEditarImovel)}
         className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6"
      >
         {step === 1 && (
            <>
               <InputPadrao
                  htmlFor="titulo"
                  label="Titulo"
                  placeholder="Digite o titulo"
                  {...register("titulo")}
                  mensagemErro={errors.titulo?.message}
                  onChange={() => handleInputChange("titulo")}
               />
               <TextArea
                  label="Descrição"
                  placeholder="Digite a descrição"
                  {...register("descricao")}
                  mensagemErro={errors.descricao?.message}
                  onChange={() => handleInputChange("descricao")}
               />
               <div className="flex flex-col md:flex-row gap-2 w-full">
                  <div className="flex flex-col gap-2 w-full">
                     <div className="w-full">
                        <InputPadrao
                           htmlFor="tamanho"
                           label="Tamanho"
                           placeholder="Área privada"
                           {...register("metragem", {
                              valueAsNumber: true,
                           })}
                           mensagemErro={errors.metragem?.message}
                           onChange={() => handleInputChange("metragem")}
                           type="number"
                        />
                     </div>
                     <div className="w-full">
                        <InputPadrao
                           htmlFor="quartos"
                           label="Quartos"
                           placeholder="Quantidade quartos"
                           {...register("qtdQuartos", {
                              valueAsNumber: true,
                           })}
                           mensagemErro={errors.qtdQuartos?.message}
                           onChange={() => handleInputChange("qtdQuartos")}
                           type="number"
                        />
                     </div>
                     <div className="w-full">
                        <InputPadrao
                           htmlFor="banheiros"
                           label="Banheiros"
                           placeholder="Quantidade banheiros"
                           {...register("qtdBanheiros", {
                              valueAsNumber: true,
                           })}
                           mensagemErro={errors.qtdBanheiros?.message}
                           onChange={() => handleInputChange("qtdBanheiros")}
                           type="number"
                        />
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <div className="w-full">
                        <InputPadrao
                           htmlFor="garagem"
                           label="Garagens"
                           placeholder="Quantidade vagas"
                           type="number"
                           {...register("qtdVagas", {
                              valueAsNumber: true,
                           })}
                           mensagemErro={errors.qtdVagas?.message}
                           onChange={() => handleInputChange("qtdVagas")}
                        />
                     </div>
                     <div className="w-full">
                        <InputPadrao
                           htmlFor="churrasqueiras"
                           label="Churrasqueira"
                           placeholder="Quantidade churrasqueiras"
                           {...register("qtdChurrasqueiras", {
                              setValueAs(value) {
                                 if (value === "" || isNaN(value)) {
                                    return undefined;
                                 }
                                 return Number(value);
                              },
                           })}
                           mensagemErro={errors.qtdChurrasqueiras?.message}
                           onChange={() =>
                              handleInputChange("qtdChurrasqueiras")
                           }
                           type="number"
                        />
                     </div>
                     <div className="w-full">
                        <InputPadrao
                           htmlFor="piscinas"
                           label="Piscinas"
                           placeholder="Quantidade piscinas"
                           {...register("qtdPiscinas", {
                              setValueAs(value) {
                                 if (value === "" || isNaN(value)) {
                                    return undefined;
                                 }
                                 return Number(value);
                              },
                           })}
                           mensagemErro={errors.qtdPiscinas?.message}
                           onChange={() => handleInputChange("qtdPiscinas")}
                           type="number"
                        />
                     </div>
                  </div>
               </div>
               <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                  <InputPadrao
                     htmlFor="preco"
                     label="Preço"
                     placeholder="Digite o preço"
                     type="number"
                     {...register("valor", {
                        valueAsNumber: true,
                     })}
                     mensagemErro={errors.valor?.message}
                     onChange={() => handleInputChange("valor")}
                  />
                  <InputPadrao
                     htmlFor="promocao"
                     label="Preço Promocional"
                     placeholder="Digite o preço promocional"
                     type="number"
                     {...register("valorPromo", {
                        setValueAs(value) {
                           if (value === "" || isNaN(value)) {
                              return undefined;
                           }
                           return Number(value);
                        },
                     })}
                     mensagemErro={errors.valorPromo?.message}
                     onChange={() => handleInputChange("valorPromo")}
                  />
                  <InputPadrao
                     htmlFor="iptu"
                     label="IPTU"
                     placeholder="Valor do IPTU"
                     type="number"
                     {...register("iptu", {
                        setValueAs(value) {
                           if (value === "" || isNaN(value)) {
                              return undefined;
                           }
                           return Number(value);
                        },
                     })}
                     mensagemErro={errors.iptu?.message}
                     onChange={() => handleInputChange("iptu")}
                  />
                  <InputPadrao
                     htmlFor="valor_condominio"
                     label="Condomínio"
                     placeholder="Digite o valor do condomínio"
                     type="number"
                     {...register("valorCondominio", {
                        setValueAs(value) {
                           if (value === "" || isNaN(value)) {
                              return undefined;
                           }
                           return Number(value);
                        },
                     })}
                     mensagemErro={errors.valorCondominio?.message}
                     onChange={() => handleInputChange("valorCondominio")}
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex flex-col gap-2 xl:flex-row">
                     <Controller
                        name="banner"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                           <Switch
                              label="Banner"
                              checked={watch("banner")}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-12 h-6 sm:w-14 sm:h-7 xl:w-16 xl:h-8"
                           />
                        )}
                     />
                     {watch("banner") && (
                        <div className="flex">
                           <Controller
                              name="tipoBanner"
                              control={control}
                              defaultValue={tipoBanner[0].id.toString()}
                              render={({ field }) => (
                                 <List
                                    opcoes={tipoBanner}
                                    value={field.value}
                                    mudandoValor={(value) =>
                                       field.onChange(value)
                                    }
                                    bordaPreta={true}
                                    divClassName="justify-end"
                                    differentSize="h-8"
                                 />
                              )}
                           />
                        </div>
                     )}
                  </div>
                  <div className="flex w-full">
                     <Controller
                        name="destaque"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                           <Switch
                              label="Destaque"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-12 h-6 sm:w-14 sm:h-7 xl:w-16 xl:h-8"
                           />
                        )}
                     />
                  </div>
                  <div className="flex w-full">
                     <Controller
                        name="visibilidade"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                           <Switch
                              label="Visibilidade"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-12 h-6 sm:w-14 sm:h-7 xl:w-16 xl:h-8"
                           />
                        )}
                     />
                  </div>
                  <div className="flex w-full">
                     <Controller
                        name="academia"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                           <Switch
                              label="Academia"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-12 h-6 sm:w-14 sm:h-7 xl:w-16 xl:h-8"
                           />
                        )}
                     />
                  </div>
               </div>
               <div className="flex flex-row gap-2">
                  <Controller
                     name="objImovel"
                     control={control}
                     defaultValue={objImovel[0].id}
                     render={({ field }) => (
                        <List
                           opcoes={objImovel}
                           bordaPreta={true}
                           title="Objetivo"
                           value={field.value}
                           mudandoValor={(value) => field.onChange(value)}
                           differentSize="h-8"
                        />
                     )}
                  />
                  <Controller
                     name="tipo"
                     control={control}
                     defaultValue={tiposDeImovel[0].id}
                     render={({ field }) => (
                        <List
                           opcoes={tiposDeImovel}
                           bordaPreta={true}
                           title="Tipo"
                           value={field.value}
                           mudandoValor={(value) => field.onChange(value)}
                           differentSize="h-8"
                        />
                     )}
                  />
               </div>
               <div className="flex justify-center mt-4 gap-2">
                  <Link href={"/imoveis"}>
                     <BotaoPadrao type="button" texto="Cancelar" />
                  </Link>
                  <BotaoPadrao
                     type="button"
                     texto="Próximo"
                     onClick={handleNextStep}
                  />
               </div>
            </>
         )}

         {step === 2 && (
            <>
               <Controller
                  name="imagens"
                  control={control}
                  render={({ field }) => {
                     const imagensGaleria = field.value.imagensGaleria || [];

                     return (
                        <UploadGaleriaImagens
                           onImageChange={(file, index) => {
                              const newValue = { ...field.value };
                              if (index === undefined) {
                                 newValue.imagemPrincipal = file || "";
                              } else {
                                 const newGallery = [...imagensGaleria];
                                 if (file === null) {
                                    newGallery.splice(index, 1);
                                 } else {
                                    newGallery[index] = file;
                                 }
                                 newValue.imagensGaleria = newGallery;
                              }
                              field.onChange(newValue);
                           }}
                           mensagemErroPrincipal={
                              errors.imagens?.imagemPrincipal?.message
                           }
                           mensagemErroGaleria={
                              errors.imagens?.imagensGaleria?.message
                           }
                           clearErrors={clearErrors}
                           coverImage={
                              typeof field.value.imagemPrincipal === "string"
                                 ? field.value.imagemPrincipal
                                 : field.value.imagemPrincipal
                                 ? URL.createObjectURL(
                                      field.value.imagemPrincipal
                                   )
                                 : null
                           }
                           galleryImages={imagensGaleria.map((file) =>
                              typeof file === "string"
                                 ? file
                                 : file
                                 ? URL.createObjectURL(file)
                                 : null
                           )}
                           refImagensDeletadas={hadleRefImagensDel}
                        />
                     );
                  }}
               />
               <div className="flex flex-col">
                  <div className="flex flex-col gap-2">
                     <div className="flex flex-col gap-2">
                        <InputPadrao
                           htmlFor="cep"
                           label="CEP"
                           placeholder="Digite o cep"
                           type="number"
                           {...register("cep", {
                              setValueAs(value) {
                                 if (value === "" || isNaN(value)) {
                                    return undefined;
                                 }
                                 return Number(value);
                              },
                           })}
                           mensagemErro={errors.cep?.message}
                           onChange={(e) => {
                              const value =
                                 e.target.value === ""
                                    ? 0
                                    : parseInt(e.target.value, 10);
                              setValue("cep", value);
                              handleInputChange("cep");
                           }}
                        />
                        <InputPadrao
                           htmlFor="bairro"
                           label="Bairro"
                           placeholder="Digite o bairro"
                           type="text"
                           {...register("bairro")}
                           mensagemErro={errors.bairro?.message}
                           onChange={() => handleInputChange("bairro")}
                           disabled={camposDesabilitados.bairroDesabilitado}
                        />
                        <InputPadrao
                           htmlFor="estado"
                           label="Estado"
                           placeholder="Digite o estado"
                           type="text"
                           {...register("estado")}
                           mensagemErro={errors.estado?.message}
                           onChange={() => handleInputChange("estado")}
                           disabled={camposDesabilitados.estadoDesabilitado}
                        />
                        <InputPadrao
                           htmlFor="cidade"
                           label="Cidade"
                           placeholder="Digite a cidade"
                           type="text"
                           {...register("cidade")}
                           mensagemErro={errors.cidade?.message}
                           onChange={() => handleInputChange("cidade")}
                           disabled={camposDesabilitados.cidadeDesabilitada}
                        />
                        <InputPadrao
                           htmlFor="rua"
                           label="Rua"
                           placeholder="Digite a rua"
                           type="text"
                           {...register("rua")}
                           mensagemErro={errors.rua?.message}
                           onChange={() => handleInputChange("rua")}
                           disabled={camposDesabilitados.ruaDesabilitada}
                        />
                     </div>
                     <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <div className="w-full">
                           <InputPadrao
                              htmlFor="numero_imovel"
                              label={`Número do imóvel`}
                              placeholder="Digite o número do imóvel"
                              type="number"
                              {...register("numero", {
                                 setValueAs: (value) => parseInt(value, 10),
                              })}
                              mensagemErro={errors.numero?.message}
                              onChange={() => handleInputChange("numero")}
                           />
                        </div>
                        <div className="w-full">
                           {watch("tipo") === "apartamento" && (
                              <InputPadrao
                                 htmlFor="numero_apartamento"
                                 label={`Número do apartamento`}
                                 placeholder="Digite o número do apartamento"
                                 type="number"
                                 {...register("numeroApto", {
                                    setValueAs: (value) => parseInt(value, 10),
                                 })}
                                 mensagemErro={errors.numeroApto?.message}
                                 onChange={() =>
                                    handleInputChange("numeroApto")
                                 }
                              />
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-row gap-2 mt-4 justify-center">
                  <BotaoPadrao
                     type="button"
                     texto="Voltar"
                     onClick={handlePrevStep}
                  />
                  <BotaoPadrao
                     type="button"
                     texto="Próximo"
                     onClick={(e: React.MouseEvent) => {
                        handleNextStep(e);
                     }}
                  />
               </div>
            </>
         )}
         {step === 3 && (
            <div className="flex flex-col gap-4">
               <div className="flex flex-row gap-2">
                  <SearchSelect
                     register={register("proprietario")}
                     mensagemErro={errors.proprietario?.message}
                     title="Proprietário"
                     url="/proprietarios/lista-select"
                     method="GET"
                     model={
                        proprietarioModel as unknown as new () => {
                           id: number;
                           nome: string;
                        }
                     }
                     startSelected={watch("proprietario")}
                     isSingle
                  />
                  <SearchSelect
                     register={register("corretores")}
                     mensagemErro={errors.corretores?.message}
                     title="Corretores"
                     url="/usuarios/corretores-lista-select"
                     method="GET"
                     model={
                        corretoresModel as unknown as new () => {
                           id: number;
                           nome: string;
                        }
                     }
                     startSelected={watch("corretores")}
                  />
               </div>
               <div className="flex flex-row gap-2 justify-center">
                  <BotaoPadrao
                     type="button"
                     texto="Voltar"
                     onClick={() => setStep(step - 1)}
                  />
                  <BotaoPadrao
                     type="submit"
                     texto="Salvar imóvel"
                     disabled={isSubmitting}
                  />
               </div>
            </div>
         )}
      </form>
   );
};

export default Formulario;
