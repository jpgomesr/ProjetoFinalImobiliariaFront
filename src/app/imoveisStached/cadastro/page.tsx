"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import SelectPadrao from "@/components/SelectPadrao";
import React, { useState } from "react";
import BotaoPadrao from "@/components/BotaoPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import UploadGaleriaImagens from "@/components/ComponentesCrud/UploadGaleriaImagens";
import Switch from "@/components/ComponentesCrud/Switch";

const page = () => {

   const [titulo, setTitulo] = useState("");
   const [descricao, setDescricao] = useState("");
   const [tamanho, setTamanho] = useState("");
   const [caracteristicas, setCaracteristicas] = useState("");
   const [finalidade, setFinalidade] = useState("");
   const [preco, setPreco] = useState("");
   const [precoPromocional, setPrecoPromocional] = useState("");
   const [cep, setCep] = useState("");
   const [tipoImovel, setTipoImovel] = useState("CASA");
   const [numero, setNumero] = useState("");
   const [complemento, setComplemento] = useState("");
   const [estado, setEstado] = useState("SC");
   const [cidade, setCidade] = useState("");
   const [rua, setRua] = useState("");
   const [bairro, setBairro] = useState("");
   const [imagemImovel, setImagemImovel] = useState<File | null>(null);
   const [iptu, setIptu] = useState("");
   const [proprietario, setProprietario] = useState("");
   const [corretor, setCorretor] = useState("Pedro");
   const [visibilidade, setVisibilidade] = useState(false);
   const [destaque, setDestaque] = useState(false);

   const [step, setStep] = useState(1);

   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

   const tiposDeImovel = ["CASA", "APARTAMENTO", "TERRENO", "GEMINADO"];
   const estados = ["SC", "SP", "PR", "RS"];
   const corretores = ["Pedro", "Scheid", "Carlos", "João"];

   const handleNextStep = (e: any) => {
      e.preventDefault();
      setStep((prev) => prev + 1);
   };

   const handlePrevStep = (e: any) => {
      e.preventDefault();
      setStep((prev) => prev - 1);
   };

   const handleMudarVisibilidade = () => {
      setVisibilidade(!visibilidade);
   };

   const handleMudarDestaque = () => {
      setDestaque(!destaque);
   };

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao titulo="Cadastro de imóvel" className="w-full">
               {step === 1 && (
                  <>
                     <form
                        //   onSubmit={(e) => enviandoFormulario(e)}
                        className="flex flex-col gap-2
                                    md:gap-3
                                    lg:gap-4
                                    xl:gap-5
                                    2xl:gap-6"
                     >
                        <InputPadrao
                           htmlFor="titulo"
                           label="Titulo da propriedade"
                           required={true}
                           tipoInput="text"
                           placeholder="Ex:Casa Média"
                           onChange={setTitulo}
                        />
                        <TextAreaPadrao
                           htmlFor="descricao"
                           label="Descricao"
                           onChange={setDescricao}
                        />
                        <InputPadrao
                           htmlFor="tamanho"
                           label="Tamanho"
                           required={true}
                           tipoInput="number"
                           placeholder="Ex:32m²"
                           onChange={setTamanho}
                        />
                        <InputPadrao
                           htmlFor="caracteristicas"
                           label="Características"
                           required={true}
                           tipoInput="text"
                           placeholder="Ex:2 quartos, 3 cozinhas, 10 vagas..."
                           onChange={setCaracteristicas}
                        />
                        <InputPadrao
                           htmlFor="finalidade"
                           label="Finalidade"
                           required={true}
                           tipoInput="text"
                           placeholder="Ex:Venda e/ou aluguel"
                           onChange={setFinalidade}
                        />
                        <InputPadrao
                           htmlFor="preco"
                           label="Preço"
                           required={true}
                           tipoInput="number"
                           placeholder="Ex:12.342,00"
                           onChange={setPreco}
                        />
                        <InputPadrao
                           htmlFor="preco-promo"
                           label="Preço promocional"
                           required={true}
                           tipoInput="number"
                           placeholder="Ex:11.342,00"
                           onChange={setPrecoPromocional}
                        />
                        <InputPadrao
                           htmlFor="cep"
                           label="CEP"
                           required={true}
                           tipoInput="number"
                           placeholder="Ex:18220-000"
                           onChange={setCep}
                        />
                        <div
                           className="flex flex-col items-center justify-center gap-2 w-full
                                md:gap-4 md:items-center md:flex-row"
                        >
                           <div
                              className="flex flex-col w-full
                                        md:w-1/2"
                           >
                              <label
                                 htmlFor="tipo-usuario"
                                 className="opacity-90 text-xs truncate
                                        font-montserrat
                                        md:text-sm
                                        lg:text-base lg:rounded-lg
                                        2xl:text-xl 2xl:rounded-xl"
                              >
                                 Tipo usuario
                              </label>
                              <SelectPadrao
                                 opcoes={tiposDeImovel}
                                 onChange={setTipoImovel}
                                 placeholder="Tipo imóvel"
                                 selecionado={tipoImovel}
                                 className="w-full lg:max-w-sm"
                              />
                           </div>
                           <div className="w-full">
                              <InputPadrao
                                 htmlFor="numero"
                                 label="Número"
                                 required={true}
                                 tipoInput="number"
                                 placeholder="Ex:302"
                                 onChange={setNumero}
                              />
                           </div>
                           <div className="w-full">
                              <InputPadrao
                                 htmlFor="complemento"
                                 label="Complemento"
                                 required={true}
                                 tipoInput="text"
                                 placeholder="Ex:Apto 302, bloco 2"
                                 onChange={setNumero}
                              />
                           </div>
                           <div
                              className="flex flex-col w-full
                                        md:w-1/2"
                           >
                              <label
                                 htmlFor="tipo-usuario"
                                 className="opacity-90 text-xs
                                        font-montserrat
                                        md:text-sm
                                        lg:text-base lg:rounded-lg
                                        2xl:text-xl 2xl:rounded-xl"
                              >
                                 Estado
                              </label>
                              <SelectPadrao
                                 opcoes={estados}
                                 onChange={setEstado}
                                 placeholder="Tipo imóvel"
                                 selecionado={estado}
                                 className="w-full lg:max-w-sm"
                              />
                           </div>
                        </div>
                        <div className="flex justify-center">
                           <BotaoPadrao
                              texto="Próximo"
                              className="border border-black"
                              handler={handleNextStep}
                           />
                        </div>
                     </form>
                  </>
               )}

               {step === 2 && (
                  <form
                     className="flex flex-col gap-2
                                md:gap-3
                                lg:gap-4
                                xl:gap-5
                                2xl:gap-6"
                  >
                     <UploadGaleriaImagens
                        onCoverImageChange={(file) =>
                           console.log("Cover image:", file)
                        }
                        onGalleryImageChange={(files) =>
                           console.log("Gallery images:", files)
                        }
                     />
                     <div
                        className="flex flex-col gap-2
                                    md:gap-3
                                    lg:gap-4
                                    xl:gap-5
                                    2xl:gap-6"
                     >
                        <InputPadrao
                           htmlFor="iptu"
                           label="Valores de IPTU"
                           required={true}
                           tipoInput="number"
                           placeholder="Ex:1.342,00"
                           onChange={setIptu}
                        />
                        <InputPadrao
                           htmlFor="proprietario"
                           label="Proprietário"
                           required={true}
                           tipoInput="text"
                           placeholder="Ex:João"
                           onChange={setProprietario}
                        />
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-center">
                           <div
                              className="flex flex-col w-full gap
                                        sm:w-1/3
                                        lg:max-w-sm"
                           >
                              <label
                                 htmlFor="tipo-usuario"
                                 className="opacity-90 text-xs
                                        font-montserrat
                                        md:text-sm
                                        lg:text-base lg:rounded-lg
                                        2xl:text-xl 2xl:rounded-xl"
                              >
                                 Corretores
                              </label>
                              <SelectPadrao
                                 opcoes={corretores}
                                 onChange={setCorretor}
                                 placeholder="Corretores"
                                 selecionado={corretor}
                                 className="w-full"
                              />
                           </div>
                           <div className="flex flex-row justify-between w-full sm:justify-normal sm:gap-4">
                              <div className="flex flex-col">
                                 <label
                                    htmlFor="visibilidade"
                                    className="opacity-90 text-xs
                                        font-montserrat
                                        md:text-sm
                                        lg:text-base lg:rounded-lg
                                        2xl:text-xl 2xl:rounded-xl"
                                 >
                                    Habilitar visibilidade
                                 </label>
                                 <Switch
                                    className="w-8 h-4 sm:w-12 sm:h-6 md:w-14 md:h-7 lg:w-16 lg:h-8"
                                    handleAcao={handleMudarVisibilidade}
                                 />
                              </div>
                              <div className="flex flex-col">
                                 <label
                                    htmlFor="tipo-usuario"
                                    className="opacity-90 text-xs
                                        font-montserrat
                                        md:text-sm
                                        lg:text-base lg:rounded-lg
                                        2xl:text-xl 2xl:rounded-xl"
                                 >
                                    Permitir destaque
                                 </label>
                                 <Switch
                                    className="w-8 h-4 sm:w-12 sm:h-6 md:w-14 md:h-7 lg:w-16 lg:h-8"
                                    handleAcao={handleMudarDestaque}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-2">
                        <div className="flex justify-center gap-4">
                           <BotaoPadrao
                              texto="Voltar"
                              className="border border-black"
                              handler={handlePrevStep}
                           />
                           <BotaoPadrao
                              texto="Concluir"
                              className="border border-black"
                           />
                        </div>
                     </div>
                  </form>
               )}
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
