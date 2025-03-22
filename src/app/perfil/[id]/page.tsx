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
            
            // Define a opção de contato com base nos dados carregados
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
                  className={`flex flex-col md:flex-row-reverse gap-8 md:gap-24 max-w-5xl mx-auto ${
                     isSubmitting ? "opacity-40" : "opacity-100"
                  }`}
               >
                  {/* Coluna da Direita - Foto */}
                  <div className="w-full md:w-1/4 flex flex-col items-center md:mt-10 md:pl-20">
                     <div className="relative">
                        <Controller
                           name="imagemPerfil"
                           control={control}
                           render={({ field }) => (
                              <>
                                 <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                                    {preview ? (
                                       <img
                                          src={preview}
                                          alt="Foto do perfil"
                                          className="w-full h-full object-cover"
                                       />
                                    ) : (
                                       <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                          <FaUser className="text-gray-400 text-4xl" />
                                       </div>
                                    )}
                                 </div>
                                 <button
                                    type="button"
                                    onClick={() =>
                                       fileInputRef.current?.click()
                                    }
                                    className="absolute bottom-0 left-0 bg-havprincipal text-white rounded-full p-2 cursor-pointer hover:bg-havprincipal/90"
                                 >
                                    <FaPencilAlt size={14} />
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
                  <div className="w-full md:w-[600px] flex flex-col gap-4">
                     <div className="flex flex-col gap-4">
                        <div className="col-span-2">
                           <InputPadrao
                              htmlFor="nomeCompleto"
                              label="Nome"
                              type="text"
                              placeholder="Seu nome completo"
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
                              {...register("telefone")}
                              mensagemErro={errors.telefone?.message}
                           />
                        </div>

                        <div className="col-span-2 md:w-[980px]">
                           <TextAreaPadrao
                              htmlFor="descricao"
                              label="Biografia"
                              {...register("descricao")}
                              mensagemErro={errors.descricao?.message}
                           />
                        </div>

                        <div className="col-span-2">
                           <div className="relative">
                              <label
                                 htmlFor="contactOption"
                                 className="block text-xs font-medium text-gray-700 mb-1"
                              >
                                 Preferência de Contato
                              </label>
                              <select
                                 id="contactOption"
                                 className="w-full h-[30px] px-6 border border-gray-700 rounded-md lg xl:w-[980px] focus:outline-none bg-white appearance-none text-xs"
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
                              <div className="absolute right-1 top-[28px] pointer-events-none">
                                 <svg
                                    className="w-4 h-4 text-gray-400"
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
                        <div className="col-span-2 flex flex-col gap-2">
                           <h2 className="text-xs font-medium text-gray-700">
                              Autenticação de dois fatores (2FA)
                           </h2>
                           <div className="w-full min-h-[180px] bg-white border border-gray-300 rounded-md p-3 md:p-4 flex flex-col items-center justify-between">
                              <div className="flex flex-col items-center gap-2 md:gap-3">
                                 <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 md:w-7 md:h-7 text-havprincipal" />
                                 </div>
                                 <span className="text-sm md:text-base font-medium text-center">
                                    Autenticação Via E-mail
                                 </span>
                                 <p className="w-48 text-xs md:text-sm text-gray-500 text-center px-2 md:px-4">
                                    Use o código de segurança enviado para o seu
                                    e-mail como a sua autenticação de dois
                                    fatores (2FA). O código será enviado ao
                                    e-mail vinculado à sua conta
                                 </p>
                              </div>
                              <button
                                 type="button"
                                 onClick={() => setSelected2FA(selected2FA === "email" ? null : "email")}
                                 className={`mt-3 md:mt-4 px-6 py-2 text-xs font-medium rounded-md transition-colors ${
                                    selected2FA === "email"
                                       ? "bg-havprincipal text-white"
                                       : "border border-gray-300 hover:bg-gray-50"
                                 }`}
                              >
                                 {selected2FA === "email" ? "SELECIONADO" : "SELECIONAR"}
                              </button>
                           </div>
                        </div>
                        <div className="col-span-2 flex flex-col gap-2">
                           <div className="w-full min-h-[180px] bg-white border border-gray-300 rounded-md p-3 md:p-4 flex flex-col items-center justify-between">
                              <div className="flex flex-col items-center gap-2 md:gap-3">
                                 <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-havprincipal" />
                                 </div>
                                 <span className="text-sm md:text-base font-medium text-center">
                                    Autenticação Via SMS
                                 </span>
                                 <p className="w-48 text-xs md:text-sm text-gray-500 text-center px-2 md:px-4">
                                    Use o seu súmero de telefone como o seu
                                    código de autenticação de dois fatores
                                    (2FA). Você precisará fornecer o código de
                                    segurança que o enviamos via mensagem SMS
                                 </p>
                              </div>
                              <button
                                 type="button"
                                 onClick={() => setSelected2FA(selected2FA === "sms" ? null : "sms")}
                                 className={`mt-3 md:mt-4 px-6 py-2 text-xs font-medium rounded-md transition-colors ${
                                    selected2FA === "sms"
                                       ? "bg-havprincipal text-white"
                                       : "border border-gray-300 hover:bg-gray-50"
                                 }`}
                              >
                                 {selected2FA === "sms" ? "SELECIONADO" : "SELECIONAR"}
                              </button>
                           </div>
                        </div>
                     </div>

                     <div className="flex justify-center gap-4 mt-4">
                        <BotaoPadrao
                           texto="Salvar"
                           className="border border-black"
                           disabled={isSubmitting}
                           type="submit"
                        />
                        <BotaoPadrao
                           texto="Cancelar"
                           className="bg-gray-200 text-gray-700"
                           onClick={() => router.back()}
                           type="button"
                        />
                     </div>
                  </div>
               </form>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default Page; 