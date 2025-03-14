"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import BotaoPadrao from "@/components/BotaoPadrao";
import UploadGaleriaImagens from "@/components/ComponentesCrud/UploadGaleriaImagens";
import Switch from "@/components/ComponentesCrud/Switch";
import TextArea from "@/components/ComponentesCrud/TextArea";
import List from "@/components/List";
import { TipoBanner } from "@/models/Enum/TipoBanner";
import { createImovelValidator } from "@/validators/Validators";
import { restaurarCampos, preencherCampos } from "@/Functions/requisicaoViaCep";
import SearchProprietarioList from "@/components/SearchProprietarioList";
import CorretoresBoxSelect from "@/components/CorretoresBoxSelect";
import { useNotification } from "@/context/NotificationContext";

const Page = () => {
   const router = useRouter();
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const { showNotification } = useNotification();

   const [step, setStep] = useState(1);
   const [camposDesabilitados, setCamposDesabilitados] = useState({
      cidadeDesabilitada: true,
      bairroDesabilitado: true,
      ruaDesabilitada: true,
      estadoDesabilitado: true,
   });

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
   } = useForm<imovelValidatorSchema>({
      resolver: zodResolver(imovelValidator),
   });

   useEffect(() => {
      console.log(errors);
   });

   useEffect(() => {
      console.log(watch("valorPromo"));
   }, [watch("valorPromo"), watch("banner")]);

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
         const isValid = await trigger([
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
         ]);
         if (isValid) {
            setStep((prev) => prev + 1);
         }
      }

      if (step === 2) {
         const isValid = await trigger([
            "cep",
            "bairro",
            "estado",
            "cidade",
            "rua",
            "imagens",
            "numero",
            "numeroApto",
         ]);
         if (isValid) {
            setStep((prev) => prev + 1);
         }
      }
   };

   const handlePrevStep = (e: React.MouseEvent) => {
      e.preventDefault();
      setStep((prev) => prev - 1);
   };

   const handleCriarImovel = async (data: imovelValidatorSchema) => {
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
         idProprietario: data.proprietario,
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
      formData.append(
         "imovel",
         new Blob([JSON.stringify(jsonRequest)], { type: "application/json" })
      );
      if (data.imagens.imagemPrincipal) {
         formData.append("imagemPrincipal", data.imagens.imagemPrincipal);
      }
      if (
         data.imagens.imagensGaleria &&
         data.imagens.imagensGaleria.length > 0
      ) {
         data.imagens.imagensGaleria.forEach((imagem) => {
            if (imagem != null) {
               formData.append("imagens", imagem);
            }
         });
      }
      const response = await fetch(`${BASE_URL}/imoveis`, {
         method: "POST",
         body: formData,
      });
      if (response.ok) {
         showNotification("Imóvel cadastrado com sucesso");
         clearErrors();
         router.push("/imoveis");
      }
      console.log(response.json());
   };

   const handleInputChange = (variable: keyof imovelValidatorSchema) => {
      clearErrors(variable);
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Cadastro de imóvel"
               className={`w-full ${
                  isSubmitting ? "opacity-40" : "opacity-100"
               }`}
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
                                    onChange={() =>
                                       handleInputChange("metragem")
                                    }
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
                                    onChange={() =>
                                       handleInputChange("qtdQuartos")
                                    }
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
                                    onChange={() =>
                                       handleInputChange("qtdBanheiros")
                                    }
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
                                    onChange={() =>
                                       handleInputChange("qtdVagas")
                                    }
                                 />
                              </div>
                              <div className="w-full">
                                 <InputPadrao
                                    htmlFor="churrasqueiras"
                                    label="Churrasqueira"
                                    placeholder="Quantidade churrasqueiras"
                                    {...register("qtdChurrasqueiras", {
                                       valueAsNumber: true,
                                    })}
                                    mensagemErro={
                                       errors.qtdChurrasqueiras?.message
                                    }
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
                                       valueAsNumber: true,
                                    })}
                                    mensagemErro={errors.qtdPiscinas?.message}
                                    onChange={() =>
                                       handleInputChange("qtdPiscinas")
                                    }
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
                              onChange={() =>
                                 handleInputChange("valorCondominio")
                              }
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
                                    bordaPreta={true}
                                    title="Objetivo"
                                    value={field.value}
                                    mudandoValor={(value) =>
                                       field.onChange(value)
                                    }
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
                                    mudandoValor={(value) =>
                                       field.onChange(value)
                                    }
                                    differentSize="h-8"
                                 />
                              )}
                           />
                        </div>
                        <div className="flex justify-center mt-4">
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
                              imagemPrincipal: null,
                              imagensGaleria: [],
                           }}
                           render={({ field }) => {
                              const imagensGaleria =
                                 field.value.imagensGaleria || [];

                              return (
                                 <UploadGaleriaImagens
                                    onImageChange={(file, index) => {
                                       const newValue = { ...field.value };
                                       if (index === undefined) {
                                          newValue.imagemPrincipal = file;
                                       } else {
                                          const newGallery = [
                                             ...imagensGaleria,
                                          ];
                                          if (file === null) {
                                             newGallery.splice(index, 1);
                                          } else {
                                             newGallery[index] = file;
                                          }
                                          newValue.imagensGaleria = newGallery;
                                       }
                                       field.onChange(newValue);
                                    }}
                                    mensagemErro={
                                       errors.imagens?.imagemPrincipal?.message
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
                                    disabled={
                                       camposDesabilitados.bairroDesabilitado
                                    }
                                 />
                                 <InputPadrao
                                    htmlFor="estado"
                                    label="Estado"
                                    placeholder="Digite o estado"
                                    type="text"
                                    {...register("estado")}
                                    mensagemErro={errors.estado?.message}
                                    onChange={() => handleInputChange("estado")}
                                    disabled={
                                       camposDesabilitados.estadoDesabilitado
                                    }
                                 />
                                 <InputPadrao
                                    htmlFor="cidade"
                                    label="Cidade"
                                    placeholder="Digite a cidade"
                                    type="text"
                                    {...register("cidade")}
                                    mensagemErro={errors.cidade?.message}
                                    onChange={() => handleInputChange("cidade")}
                                    disabled={
                                       camposDesabilitados.cidadeDesabilitada
                                    }
                                 />
                                 <InputPadrao
                                    htmlFor="rua"
                                    label="Rua"
                                    placeholder="Digite a rua"
                                    type="text"
                                    {...register("rua")}
                                    mensagemErro={errors.rua?.message}
                                    onChange={() => handleInputChange("rua")}
                                    disabled={
                                       camposDesabilitados.ruaDesabilitada
                                    }
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
                                          setValueAs: (value) =>
                                             parseInt(value, 10),
                                       })}
                                       mensagemErro={errors.numero?.message}
                                       onChange={() =>
                                          handleInputChange("numero")
                                       }
                                    />
                                 </div>
                                 <div className="w-full">
                                    {watch("tipo") === "apartamento" && (
                                       <InputPadrao
                                          htmlFor="numero_apartamento"
                                          label={`Número do apartamento`}
                                          placeholder="Digite o número do apartamento"
                                          type="numberApto"
                                          {...register("numeroApto")}
                                          mensagemErro={
                                             errors.numeroApto?.message
                                          }
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
                        <SearchProprietarioList
                           registerProps={register("proprietario")}
                           mensagemErro={errors.proprietario?.message}
                        />
                        <CorretoresBoxSelect
                           registerProps={register("corretores")}
                           mensagemErro={errors.corretores?.message}
                        />
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
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;
