"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import UploadGaleriaImagens from "@/components/ComponentesCrud/UploadGaleriaImagens";
import Switch from "@/components/ComponentesCrud/Switch";
import TextArea from "@/components/ComponentesCrud/TextArea";
import List from "@/components/List";
import { TipoBanner } from "@/models/Enum/TipoBanner";
import { createImovelValidator } from "@/validators/Validators";
import { restaurarCampos, preencherCampos } from "@/Functions/requisicaoViaCep";
import { useNotification } from "@/context/NotificationContext";
import { salvarImovel } from "./actions";
import { ModelProprietarioList } from "@/models/ModelProprietarioList";
import { ModelCorretor } from "@/models/ModelCorretor";
import SearchSelect from "@/components/SearchSelect";
import Link from "next/link";
interface FormularioCadastroImovelProps {
   token: string;
}

const FormularioCadastroImovel = (props: FormularioCadastroImovelProps) => {
   const router = useRouter();
   const { showNotification } = useNotification();
   const proprietarioModel: ModelProprietarioList[] = [];
   const corretoresModel: ModelCorretor[] = [];

   const [step, setStep] = useState(1);
   const [camposDesabilitados, setCamposDesabilitados] = useState({
      cidadeDesabilitada: true,
      bairroDesabilitado: true,
      ruaDesabilitada: true,
      estadoDesabilitado: true,
   });

   const [coverImage, setCoverImage] = useState<string | null>(null);
   const [galleryImages, setGalleryImages] = useState<File[]>([]);

   const imovelValidator = createImovelValidator();
   type imovelValidatorSchema = z.infer<typeof imovelValidator>;

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
      console.log(errors);
   });

   useEffect(() => {
      if (watch("cep")) {
         const cepMock = watch("cep").toString();

         if (cepMock?.length === 8) {
            preencherCampos(cepMock, setCamposDesabilitados, setValue);
         } else {
            restaurarCampos(setCamposDesabilitados, setValue);
         }
      }
   }, [watch("cep")]);

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
      const subscription = watch((value, { name }) => {
         if (name === "valorPromo" || name === "valor") {
            trigger("valorPromo");
         }
      });
      return () => subscription.unsubscribe();
   }, [watch, trigger]);

   const handlePrevStep = (e: React.MouseEvent) => {
      e.preventDefault();
      setStep((prev) => prev - 1);
   };

   const handleCriarImovel = async (data: imovelValidatorSchema) => {
      const jsonRequest = {
         imovel: {
            titulo: data.titulo,
            descricao: data.descricao,
            tamanho: data.metragem.toString(),
            qtdQuartos: data.qtdQuartos.toString(),
            qtdBanheiros: data.qtdBanheiros.toString(),
            qtdGaragens: data.qtdVagas.toString(),
            qtdChurrasqueira: data.qtdChurrasqueiras?.toString() || "",
            qtdPiscina: data.qtdPiscinas?.toString() || "",
            finalidade: data.objImovel,
            academia: data.academia,
            preco: data.valor.toString(),
            precoPromocional: data.valorPromo?.toString() || "",
            permitirDestaque: data.destaque,
            visibilidade: data.visibilidade,
            banner: data.banner,
            tipoBanner: data.tipoBanner || "",
            iptu: data.iptu?.toString() || "",
            valorCondominio: data.valorCondominio?.toString() || "",
            idProprietario: data.proprietario.id,
            ativo: true,
            endereco: {
               rua: data.rua,
               bairro: data.bairro,
               cidade: data.cidade,
               estado: data.estado,
               tipoResidencia: data.tipo,
               cep: data.cep.toString(),
               numeroCasaPredio: data.numero.toString(),
               numeroApartamento: data.numeroApto?.toString() || "",
            },
            corretores: data.corretores,
         },
         imagens: {
            imagemPrincipal: data.imagens.imagemPrincipal,
            imagensGaleria: data.imagens.imagensGaleria,
         },
      };
      const response = await salvarImovel(jsonRequest);
      if (response.ok) {
         showNotification("Imóvel cadastrado com sucesso");
         clearErrors();
         setCoverImage(null);
         setGalleryImages([]);
         router.push("/gerenciamento/imoveis");
      }
   };

   const handleInputChange = (variable: keyof imovelValidatorSchema) => {
      clearErrors(variable);
   };

   return (
      <FundoBrancoPadrao
         titulo="Cadastro de imóvel"
         className={`w-full ${isSubmitting ? "opacity-40" : "opacity-100"}`}
      >
         <form
            onSubmit={handleSubmit(handleCriarImovel)}
            className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6"
         >
            {step === 1 && (
               <>
                  <InputPadrao
                     htmlFor="Titulo"
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
                                 checked={field.value}
                                 onChange={(e) =>
                                    field.onChange(e.target.checked)
                                 }
                                 className="w-12 h-6 sm:w-14 sm:h-7 xl:w-16 xl:h-8"
                              />
                           )}
                        />
                        {watch("banner") && (
                           <div className="flex h-[60%]">
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
                                 onChange={(e) =>
                                    field.onChange(e.target.checked)
                                 }
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
                                 onChange={(e) =>
                                    field.onChange(e.target.checked)
                                 }
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
                                 onChange={(e) =>
                                    field.onChange(e.target.checked)
                                 }
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
                              title="Tipo"
                              value={field.value}
                              mudandoValor={(value) => field.onChange(value)}
                              differentSize="h-8"
                           />
                        )}
                     />
                  </div>
                  <div className="flex justify-center mt-4 gap-2">
                     <Link href={"/gerenciamento/imoveis"}>
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
                     defaultValue={{
                        imagemPrincipal: undefined as unknown as File,
                        imagensGaleria: [],
                     }}
                     render={({ field }) => {
                        return (
                           <UploadGaleriaImagens
                              coverImage={coverImage}
                              galleryImages={galleryImages.map((img) =>
                                 URL.createObjectURL(img)
                              )}
                              onImageChange={(file, index) => {
                                 const newValue = { ...field.value };
                                 if (index === undefined) {
                                    if (file instanceof File) {
                                       newValue.imagemPrincipal = file;
                                       setCoverImage(URL.createObjectURL(file));
                                    }
                                 } else {
                                    const newGallery = [...galleryImages];
                                    if (file === null) {
                                       newGallery.splice(index, 1);
                                    } else {
                                       if (file instanceof File) {
                                          newGallery[index] = file;
                                       }
                                    }
                                    newValue.imagensGaleria = newGallery;
                                    setGalleryImages(newGallery);
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
                              type="text"
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
                              htmlFor="Bairro"
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
                              {watch("tipo") === "APARTAMENTO" && (
                                 <InputPadrao
                                    htmlFor="numero_apartamento"
                                    label={`Número do apartamento`}
                                    placeholder="Digite o número do apartamento"
                                    type="number"
                                    {...register("numeroApto", {
                                       setValueAs: (value) =>
                                          parseInt(value, 10),
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
                        onClick={handleNextStep}
                     />
                  </div>
               </>
            )}
            {step === 3 && (
               <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2">
                     <SearchSelect
                        token={props.token}
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
                        token={props.token}
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
                        texto="Criar imóvel"
                        disabled={isSubmitting}
                     />
                  </div>
               </div>
            )}
         </form>
      </FundoBrancoPadrao>
   );
};

export default FormularioCadastroImovel;
