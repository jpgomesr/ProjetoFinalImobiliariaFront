"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { UseErros } from "@/hooks/UseErros";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import UploadImagem from "@/components/ComponentesCrud/UploadImagem";
import { createUsuarioValidator } from "@/validators/Validators";
import { useNotification } from "@/context/NotificationContext";
import { FaPencilAlt } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { Mail, MessageSquare } from 'lucide-react';
import CardReserva from "@/components/card/CardAgendamento";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Usuario {
   foto: string;
   nome: string;
   email: string;
   telefone: string;
   descricao?: string;
   role: string;
}

const Page = () => {
   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
   const { id } = useParams();
   const router = useRouter();
   const { showNotification } = useNotification();
   const [preview, setPreview] = useState<string>();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isEditingImage, setIsEditingImage] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [selectedContact, setSelectedContact] = useState("");
   const [selected2FA, setSelected2FA] = useState<"email" | "sms" | null>(null);

   const usuarioValidator = createUsuarioValidator(false);
   type usuarioValidatorSchema = z.infer<typeof usuarioValidator>;

   const {
      register,
      handleSubmit,
      setValue,
      control,
      setError: setFormError,
      setFocus,
      clearErrors,
      formState: { errors, isSubmitting },
   } = useForm<usuarioValidatorSchema>({
      resolver: zodResolver(usuarioValidator),
      defaultValues: {
         nomeCompleto: "",
         email: "",
         telefone: "",
         descricao: "",
         imagemPerfil: null,
         tipoUsuario: "",
      },
   });

   if (!BASE_URL) {
      throw new Error("A variável NEXT_PUBLIC_BASE_URL não está definida.");
   }
   useEffect(() => {
      console.log(errors);
   },[errors]);

   const handleSelect2FA = (method: "email" | "sms") => {
      if (selected2FA === method) {
         setSelected2FA(null);
         showNotification("Método 2FA desativado");
      } else {
         setSelected2FA(method);
         showNotification("Método 2FA ativado com sucesso!");
      }
   };

   useEffect(() => {
      if (!id) return;

      const fetchUsuario = async () => {
         try {
            const response = await fetch(`${BASE_URL}/usuarios/${id}`);
            if (!response.ok) {
               throw new Error("Erro ao buscar os dados do usuário");
            }
            const data = await response.json();
            
            setValue("nomeCompleto", data.nome);
            setValue("email", data.email);
            setValue("telefone", data.telefone || "");
            setValue("descricao", data.descricao || "");
            setValue("tipoUsuario", data.role);
            setPreview(data.foto);
            setSelected2FA(data.metodo2FA || null);
            
            if (data.email) {
               setSelectedContact("email");
            } else if (data.telefone) {
               setSelectedContact("telefone");
            }
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

      fetchUsuario();
   }, [id, BASE_URL, setValue]);
   const onSubmit = async (data: usuarioValidatorSchema) => {
      console.log(data.tipoUsuario)
      try {
         const response = await UseFetchPostFormData(
            `${BASE_URL}/usuarios/${id}`,
            {
               nome: data.nomeCompleto,
               email: data.email,
               telefone: data.telefone?.trim() === "" ? null : data.telefone,
               descricao: data.descricao,
               role: data.tipoUsuario,
            },
            "usuario",
            "novaImagem",
            data.imagemPerfil,
            "PUT"
         );

         if (!response.ok) {
            const responseData = await response.json();
            if (responseData.erros) {
               const errosFormatados = UseErros(responseData);
               Object.keys(errosFormatados).forEach((campo) => {
                  setFormError(campo as keyof usuarioValidatorSchema, {
                     type: "manual",
                     message: errosFormatados[campo],
                  });
               });
               const primeiroCampoComErro = Object.keys(
                  errosFormatados
               )[0] as keyof usuarioValidatorSchema;
               if (primeiroCampoComErro) {
                  setFocus(primeiroCampoComErro);
               }
            }
            throw new Error(responseData.mensagem || "Erro ao atualizar usuário.");
         }

         showNotification("Perfil atualizado com sucesso!");
         clearErrors();
         router.refresh();
      } catch (error) {
         console.error("Erro ao atualizar o perfil:", error);
         showNotification("Erro ao atualizar o perfil");
      }
   };

   if (loading) {
      return (
         <Layout className="py-0">
            <SubLayoutPaginasCRUD>
               <FundoBrancoPadrao className="w-full" titulo="Perfil de Usuário">
                  <div className="flex justify-center items-center h-64">
                     <p className="text-havprincipal">Carregando...</p>
                  </div>
               </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
         </Layout>
      );
   }

   if (error) {
      return (
         <Layout className="py-0">
            <SubLayoutPaginasCRUD>
               <FundoBrancoPadrao className="w-full" titulo="Perfil de Usuário">
                  <div className="flex justify-center items-center h-64">
                     <p className="text-red-500">{error}</p>
                  </div>
               </FundoBrancoPadrao>
            </SubLayoutPaginasCRUD>
         </Layout>
      );
   }

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao className="w-full" titulo="Perfil de Usuário">
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={`flex flex-col xl:flex-row-reverse gap-2 sm:gap-4 md:gap-6 xl:gap-24 max-w-5xl mx-auto ${
                     isSubmitting ? "opacity-40" : "opacity-100"
                  }`}
               >
                  {/* Coluna da Direita - Foto */}
                  <div className="w-full xl:w-1/4 flex flex-col items-center order-first xl:order-none xl:mt-10">
                     <div className="relative">
                        <Controller
                           name="imagemPerfil"
                           control={control}
                           render={({ field }) => (
                              <>
                                 <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 xl:w-48 xl:h-48 rounded-full overflow-hidden">
                                    {preview ? (
                                       <img
                                          src={preview}
                                          alt="Foto do perfil"
                                          className="w-full h-full object-cover"
                                       />
                                    ) : (
                                       <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                          <FaUser className="text-gray-400 text-2xl sm:text-3xl" />
                                       </div>
                                    )}
                                 </div>
                                 <button
                                    type="button"
                                    onClick={() =>
                                       fileInputRef.current?.click()
                                    }
                                    className="absolute bottom-0 left-0 xl:bottom-2 xl:left-2 bg-havprincipal text-white rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-havprincipal/90"
                                 >
                                    <FaPencilAlt
                                       size={10}
                                       className="sm:size-[12px] xl:size-[16px]"
                                    />
                                 </button>
                                 <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                       const file = e.target.files?.[0] || null;
                                       field.onChange(file);
                                       if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                             setPreview(
                                                reader.result as string
                                             );
                                          };
                                          reader.readAsDataURL(file);
                                       }
                                    }}
                                    className="hidden"
                                    accept="image/*"
                                 />
                              </>
                           )}
                        />
                     </div>
                  </div>

                  {/* Coluna da Esquerda - Campos de texto */}
                  <div className="w-full sm:w-[90%] xl:mr-20 md:w-[95%] xl:w-[600px] flex flex-col gap-2 sm:gap-3 md:gap-4 order-last xl:order-none">
                     <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                        <div className="col-span-2">
                           <InputPadrao
                              htmlFor="nomeCompleto"
                              label="Nome"
                              type="text"
                              placeholder="Seu nome completo"
                              className="text-xs sm:text-sm md:text-base"
                              {...register("nomeCompleto")}
                              mensagemErro={errors.nomeCompleto?.message}
                           />
                        </div>

                        <div className="col-span-2">
                           <InputPadrao
                              htmlFor="email"
                              label="E-mail"
                              type="email"
                              placeholder="Seu e-mail"
                              className="text-xs sm:text-sm md:text-base"
                              {...register("email")}
                              mensagemErro={errors.email?.message}
                           />
                        </div>

                        <div className="col-span-2">
                           <InputPadrao
                              htmlFor="telefone"
                              label="Telefone"
                              type="tel"
                              placeholder="Seu telefone"
                              className="text-xs sm:text-sm md:text-base"
                              {...register("telefone")}
                              mensagemErro={errors.telefone?.message}
                           />
                        </div>

                        <div className="col-span-2 w-full sm:w-[300px] md:w-[500px] xl:w-[980px]">
                           <TextAreaPadrao
                              htmlFor="descricao"
                              label="Biografia"
                              className="text-xs sm:text-sm md:text-base h-20 sm:h-24 md:h-28"
                              {...register("descricao")}
                              mensagemErro={errors.descricao?.message}
                           />
                        </div>

                        <div className="col-span-2">
                           <div className="relative">
                              <label
                                 htmlFor="contactOption"
                                 className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                              >
                                 Preferência de Contato
                              </label>
                              <select
                                 id="contactOption"
                                 className="w-full h-[28px] sm:h-[30px] md:h-[48px] xl:w-[980px] px-3 sm:px-4 md:px-6 border border-gray-700 rounded-md focus:outline-none bg-white appearance-none text-xs sm:text-sm md:text-base"
                                 value={selectedContact}
                                 onChange={(e) =>
                                    setSelectedContact(e.target.value)
                                 }
                              >
                                 <option value="">
                                    Selecione a opção de contato
                                 </option>
                                 <option value="email">E-mail</option>
                                 <option value="telefone">Telefone</option>
                              </select>
                              <div className="absolute right-2 top-[28px] sm:top-[32px] md:top-[40px] xl:top-[42px] xl:left-[950px] pointer-events-none">
                                 <svg
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth="2"
                                       d="M19 9l-7 7-7-7"
                                    />
                                 </svg>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </form>

               {/* Seção 2FA */}
               <div className="mt-8 max-w-5xl mx-auto">
                  <div className="flex flex-col gap-4">
                     <h2 className="text-xs sm:text-sm font-medium text-gray-700">
                        Autenticação de dois fatores (2FA)
                     </h2>
                     <div className="w-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] xl:w-[980px] bg-white border border-gray-300 rounded-md p-2 sm:p-3 md:p-4 flex flex-col xl:flex-row items-center justify-between">
                        <div className="flex flex-col xl:flex-row items-center gap-1 sm:gap-2 md:gap-3 xl:gap-4">
                           <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gray-300 rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 text-havprincipal" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs sm:text-sm md:text-base font-medium text-center xl:text-start xl:ml-2">
                                 Autenticação Via E-mail
                              </span>
                              <p className="w-32 sm:w-40 md:w-48 xl:w-[600px] text-xs sm:text-sm xl:text-start text-gray-500 text-center px-1 sm:px-2">
                                 Use o código de segurança enviado para o seu
                                 e-mail como a sua autenticação de dois fatores
                                 (2FA). O código de segurança será enviado ao
                                 e-mail vinculado à sua conta
                              </p>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={() => handleSelect2FA("email")}
                           className={`mt-2 sm:mt-3 px-3 sm:px-4 md:px-6 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                              selected2FA === "email"
                                 ? "bg-havprincipal text-white"
                                 : "border border-gray-300 hover:bg-gray-50"
                           }`}
                        >
                           {selected2FA === "email"
                              ? "SELECIONADO"
                              : "SELECIONAR"}
                        </button>
                     </div>

                     <div className="w-full sm:w-[290px] md:w-[500px] min-h-[140px] sm:min-h-[160px] md:min-h-[180px] xl:w-[980px] bg-white border border-gray-300 rounded-md p-2 sm:p-3 md:p-4 flex flex-col xl:flex-row items-center justify-between">
                        <div className="flex flex-col xl:flex-row items-center gap-1 sm:gap-2 md:gap-3 xl:gap-4">
                           <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gray-300 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 text-havprincipal" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs sm:text-sm md:text-base font-medium text-center xl:text-start xl:ml-2">
                                 Autenticação Via SMS
                              </span>
                              <p className="w-32 sm:w-40 md:w-48 xl:w-[650px] text-xs sm:text-sm xl:text-start text-gray-500 text-center px-1 sm:px-2">
                                 Use o seu número de telefone como o seu código
                                 de autenticação de dois fatores (2FA).Você
                                 precisará fornecer o código de segurança que o
                                 enviamos via mensagem SMS
                              </p>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={() => handleSelect2FA("sms")}
                           className={`mt-2 sm:mt-3 px-3 sm:px-4 md:px-6 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                              selected2FA === "sms"
                                 ? "bg-havprincipal text-white"
                                 : "border border-gray-300 hover:bg-gray-50"
                           }`}
                        >
                           {selected2FA === "sms"
                              ? "SELECIONADO"
                              : "SELECIONAR"}
                        </button>
                     </div>
                  </div>
               </div>

               {/* Seção de Agendamentos */}
               <div className="mt-4 sm:mt-6 md:mt-8 xl:mt-12">
                  <h2 className="text-sm sm:text-base md:text-lg font-medium mb-7 flex justify-center text-gray-700  sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4">
                     Meus Agendamentos
                  </h2>
                  <div className="px-2 sm:px-3 md:px-4">
                     <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        className="w-full"
                        breakpoints={{
                           1280: {
                              slidesPerView: 2,
                              spaceBetween: 30,
                           },
                        }}
                     >
                        <SwiperSlide className="flex justify-center items-center">
                           <CardReserva
                              id={1}
                              urlImagem="/placeholder.svg?height=300&width=500"
                              horario="16:00"
                              data="10/12/2024"
                              corretor="João Pedro"
                              status="PENDENTE"
                              localizacao="Vila Lenzi"
                              endereco="Rua Hermann Schulz 210"
                           />
                        </SwiperSlide>
                        <SwiperSlide className="flex justify-center items-center">
                           <CardReserva
                              id={2}
                              urlImagem="/placeholder.svg?height=300&width=500"
                              horario="10:00"
                              data="10/12/2024"
                              corretor="João Pedro"
                              status="PENDENTE"
                              localizacao="Vila Lenzi"
                              endereco="Rua Hermann Schulz 210"
                           />
                        </SwiperSlide>
                        <SwiperSlide className="flex justify-center items-center">
                           <CardReserva
                              id={3}
                              urlImagem="/placeholder.svg?height=300&width=500"
                              horario="14:30"
                              data="11/12/2024"
                              corretor="João Pedro"
                              status="PENDENTE"
                              localizacao="Vila Lenzi"
                              endereco="Rua Hermann Schulz 210"
                           />
                        </SwiperSlide>
                     </Swiper>
                  </div>
               </div>

               {/* Botões de Ação */}
               <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-4 md:mt-4">
                  <BotaoPadrao
                     texto="HISTÓRICO DE AGENDAMENTOS"
                     className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1 mb-4 border border-gray-300 hover:bg-gray-50"
                     onClick={() => router.push("/historico-agendamentos")}
                     type="button"
                  />
                  <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                     <BotaoPadrao
                        texto="Salvar"
                        className="border border-black text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        type="button"
                     />
                     <BotaoPadrao
                        texto="Cancelar"
                        className="bg-gray-200 text-gray-700 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1"
                        onClick={() => router.back()}
                        type="button"
                     />
                  </div>
               </div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page;