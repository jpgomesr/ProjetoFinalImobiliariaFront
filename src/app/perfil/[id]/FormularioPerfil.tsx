"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { UseFetchPostFormData } from "@/hooks/UseFetchFormData";
import { UseErros } from "@/hooks/UseErros";
import InputPadrao from "@/components/InputPadrao";
import TextAreaPadrao from "@/components/TextAreaPadrao";
import BotaoPadrao from "@/components/BotaoPadrao";
import { createUsuarioValidator } from "@/validators/Validators";
import { useNotification } from "@/context/NotificationContext";
import { FaPencilAlt, FaUser } from "react-icons/fa";
import { Mail, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import AgendamentosPerfil from "./AgendamentosPerfil";
import { useLanguage } from "@/context/LanguageContext";

interface FormularioPerfilProps {
   id: string;
   BASE_URL: string;
   dadosIniciais?: {
      nome: string;
      email: string;
      telefone: string;
      descricao: string;
      foto: string;
      role: string;
   };
   token: string;
}

const FormularioPerfil = ({
   id,
   BASE_URL,
   dadosIniciais,
   token,
}: FormularioPerfilProps) => {
   const router = useRouter();
   const { showNotification } = useNotification();
   const { t } = useLanguage();
   const [preview, setPreview] = useState<string>(dadosIniciais?.foto || "");
   const [selectedContact, setSelectedContact] = useState("");
   const [selected2FA, setSelected2FA] = useState<"email" | "sms" | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

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
         nomeCompleto: dadosIniciais?.nome || "",
         email: dadosIniciais?.email || "",
         telefone: dadosIniciais?.telefone || "",
         descricao: dadosIniciais?.descricao || "",
         imagemPerfil: null,
         tipoUsuario: dadosIniciais?.role || "",
      },
   });

   useEffect(() => {
      if (dadosIniciais) {
         setValue("nomeCompleto", dadosIniciais.nome);
         setValue("email", dadosIniciais.email);
         setValue("telefone", dadosIniciais.telefone || "");
         setValue("descricao", dadosIniciais.descricao || "");
         setValue("tipoUsuario", dadosIniciais.role);
         setPreview(dadosIniciais.foto);

         if (dadosIniciais.email) {
            setSelectedContact("email");
         } else if (dadosIniciais.telefone) {
            setSelectedContact("telefone");
         }
      }
   }, [dadosIniciais, setValue]);

   const onSubmit = async (data: usuarioValidatorSchema) => {
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
            "PUT",
            token
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
            throw new Error(
               responseData.mensagem || "Erro ao atualizar usuário."
            );
         }

         showNotification("Perfil atualizado com sucesso!");
         clearErrors();
         router.refresh();
      } catch (error) {
         console.error("Erro ao atualizar o perfil:", error);
         showNotification("Erro ao atualizar o perfil");
      }
   };

   return (
      <div className="flex flex-col gap-8">
         <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col xl:flex-row-reverse gap-4 sm:gap-6 md:gap-8 xl:gap-24 max-w-5xl mx-auto ${
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
                           <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 xl:w-48 xl:h-48 rounded-full overflow-hidden">
                              {preview ? (
                                 <img
                                    src={preview}
                                    alt="Foto do perfil"
                                    className="w-full h-full object-cover"
                                 />
                              ) : (
                                 <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <FaUser className="text-gray-400 text-3xl sm:text-4xl" />
                                 </div>
                              )}
                           </div>
                           <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute bottom-0 left-0 xl:bottom-2 xl:left-2 bg-havprincipal text-white rounded-full p-2 cursor-pointer hover:bg-havprincipal/90"
                           >
                              <FaPencilAlt
                                 size={12}
                                 className="sm:size-[14px] xl:size-[16px]"
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
                                       setPreview(reader.result as string);
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
            <div className="w-full sm:w-[90%] xl:mr-20 md:w-[95%] xl:w-[600px] flex flex-col gap-4 order-last xl:order-none">
               <div className="flex flex-col gap-4">
                  <div className="col-span-2">
                     <InputPadrao
                        htmlFor="nomeCompleto"
                        label={t("perfil.name")}
                        type="text"
                        placeholder="Seu nome completo"
                        className="text-sm sm:text-base"
                        {...register("nomeCompleto")}
                        mensagemErro={errors.nomeCompleto?.message}
                     />
                  </div>

                  <div className="col-span-2">
                     <InputPadrao
                        htmlFor="email"
                        label={t("perfil.email")}
                        type="email"
                        placeholder="Seu e-mail"
                        className="text-sm sm:text-base"
                        {...register("email")}
                        mensagemErro={errors.email?.message}
                     />
                  </div>

                  <div className="col-span-2">
                     <InputPadrao
                        htmlFor="telefone"
                        label={t("perfil.phone")}
                        type="tel"
                        placeholder="Seu telefone"
                        className="text-sm sm:text-base"
                        {...register("telefone")}
                        mensagemErro={errors.telefone?.message}
                     />
                  </div>

                  <div className="col-span-2 sm:w-[300px] md:w-[500px] xl:w-[980px]">
                     <TextAreaPadrao
                        htmlFor="descricao"
                        label={t("perfil.bio")}
                        className="text-sm sm:text-base h-24 sm:h-28 md:h-32"
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
                           {t("perfil.contact")}
                        </label>
                        <select
                           id="contactOption"
                           className="w-full h-[30px] sm:h-[34px] px-4 sm:px-6 border border-gray-700 rounded-md xl:w-[980px] focus:outline-none bg-white appearance-none text-xs sm:text-sm"
                           value={selectedContact}
                           onChange={(e) => setSelectedContact(e.target.value)}
                        >
                           <option value="">{t("perfil.select")}</option>
                           <option value="email">{t("perfil.contactOptions.email")}</option>
                           <option value="telefone">{t("perfil.contactOptions.phone")}</option>
                        </select>
                        <div className="absolute right-1 top-[28px] sm:top-[30px] md:top-[32px] xl:top-[34px] xl:left-[950px] pointer-events-none">
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
                     <h2 className="text-xs sm:text-sm font-medium text-gray-700">
                        {t("perfil.auth")}
                     </h2>
                     <div className="w-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px] xl:w-[980px] bg-white border border-gray-300 rounded-md p-3 sm:p-4 md:p-5 flex flex-col xl:flex-row items-center justify-between relative z-10">
                        <div className="flex flex-col xl:flex-row items-center gap-2 sm:gap-3 xl:gap-4">
                           <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:ml-4 lg:h-20 bg-gray-300 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 sm:w-6 sm:h-6 xl:w-10 xl:h-10 text-havprincipal" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm sm:text-base font-medium text-center xl:text-start xl:ml-2">
                                 {t("perfil.authEmail")}
                              </span>
                              <p className="w-40 sm:w-48 xl:w-[600px] text-xs sm:text-sm xl:text-start text-gray-500 text-center px-2">
                                 {t("perfil.authEmailDescription")}
                              </p>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={() =>
                              setSelected2FA(
                                 selected2FA === "email" ? null : "email"
                              )
                           }
                           className={`mt-3 sm:mt-4 px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors relative z-20 ${
                              selected2FA === "email"
                                 ? "bg-havprincipal text-white"
                                 : "border border-gray-300 hover:bg-gray-50"
                           }`}
                        >
                           {selected2FA === "email" ? t("perfil.selected") : t("perfil.selection")}
                        </button>
                     </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                     <div className="w-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px] xl:w-[980px] bg-white border border-gray-300 rounded-md p-3 sm:p-4 md:p-5 flex flex-col xl:flex-row items-center justify-between relative z-10">
                        <div className="flex flex-col xl:flex-row items-center gap-2 sm:gap-3 xl:gap-4">
                           <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:ml-4 lg:h-20 bg-gray-300 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-havprincipal xl:w-10 xl:h-10" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm sm:text-base font-medium text-center xl:text-start xl:ml-2">
                                 {t("perfil.authPhone")}
                              </span>
                              <p className="w-40 sm:w-48 xl:w-[650px] text-xs sm:text-sm xl:text-start text-gray-500 text-center px-2">
                                 {t("perfil.authPhoneDescription")}
                              </p>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={() =>
                              setSelected2FA(selected2FA === "sms" ? null : "sms")
                           }
                           className={`mt-3 sm:mt-4 px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors relative z-20 ${
                              selected2FA === "sms"
                                 ? "bg-havprincipal text-white"
                                 : "border border-gray-300 hover:bg-gray-50"
                           }`}
                        >
                           {selected2FA === "sms" ? t("perfil.selected") : t("perfil.selection")}
                        </button>
                     </div>
                  </div>
               </div>

               {/* Seção de Agendamentos */}
               <div className="mt-8 w-full sm:w-[90%] md:w-[95%] xl:w-[980px]">
                  <AgendamentosPerfil id={id} role={dadosIniciais?.role || ""} token={token} />
               </div>

               <div className="flex justify-center gap-4 mt-4 xl:ml-96">
                  <BotaoPadrao
                     texto={t("perfil.save")}
                     className="border border-black text-sm sm:text-base px-4 sm:px-6 py-1 sm:py-2"
                     disabled={isSubmitting}
                     type="submit"
                  />
                  <BotaoPadrao
                     texto={t("perfil.cancel")}
                     className="bg-gray-200 text-gray-700 text-sm sm:text-base px-4 sm:px-6 py-1 sm:py-2"
                     onClick={() => router.back()}
                     type="button"
                  />
               </div>
            </div>
         </form>
      </div>
   );
};

export default FormularioPerfil;
