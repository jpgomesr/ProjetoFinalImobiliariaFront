"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const recContaSchema = z
   .object({
      email: z.string().email("Email inválido").optional().or(z.literal("")),
      telefone: z
         .string()
         .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")
         .optional()
         .or(z.literal("")),
   })
   .refine(
      (data) => {
         return data.email || data.telefone;
      },
      {
         message: "Email ou telefone é obrigatório",
         path: ["email"],
      }
   );

type RecContaFormData = z.infer<typeof recContaSchema>;

const RecContaForm = () => {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      clearErrors,
      setValue,
   } = useForm<RecContaFormData>({
      resolver: zodResolver(recContaSchema),
      defaultValues: {
         email: "",
         telefone: "",
      },
   });

   const [isEmailForm, setIsEmailForm] = useState(true);

   const onSubmit = (data: RecContaFormData) => {
      if (data.telefone) {
         data.telefone = data.telefone.replace(/\D/g, "");
      }
      console.log(data);
   };

   const handleTryAnotherForm = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isEmailForm) {
         setValue("email", "");
      } else {
         setValue("telefone", "");
      }
      setIsEmailForm(!isEmailForm);
      clearErrors();
   };

   const formatPhoneNumber = (value: string) => {
      const cleaned = value.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
         return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return value;
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[450px]">
         <div className="flex flex-col gap-3 sm:gap-4 w-full bg-havprincipal text-white rounded-lg p-4 sm:p-5 md:p-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
               Recuperação de senha
            </h1>
            {(errors.email || errors.telefone) && (
               <div className="w-full flex justify-center">
                  <span className="text-havprincipal bg-white px-2 py-1 rounded-lg text-sm sm:text-base font-montserrat">
                     {errors.email?.message || errors.telefone?.message}
                  </span>
               </div>
            )}
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col gap-3"
            >
               {isEmailForm ? (
                  <>
                     <div className="flex items-center bg-white text-black p-2 sm:p-2.5 rounded-md min-w-0">
                        <Mail className="text-havprincipal w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <input
                           type="text"
                           placeholder="Digite seu email"
                           {...register("email")}
                           className="min-w-0 w-full bg-transparent outline-none px-2 sm:px-3 text-sm sm:text-base"
                           onChange={() => clearErrors()}
                        />
                     </div>
                     <div>
                        <button
                           className="text-sm font-montserrat font-semibold pl-2"
                           onClick={handleTryAnotherForm}
                        >
                           Tente de outra forma
                        </button>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="flex items-center bg-white text-black p-2 sm:p-2.5 rounded-md min-w-0">
                        <Phone className="text-havprincipal w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <input
                           type="tel"
                           placeholder="Digite seu telefone"
                           {...register("telefone")}
                           className="min-w-0 w-full bg-transparent outline-none px-2 sm:px-3 text-sm sm:text-base"
                           onChange={(e) => {
                              const formattedValue = formatPhoneNumber(
                                 e.target.value
                              );
                              setValue("telefone", formattedValue);
                              clearErrors();
                           }}
                           maxLength={11}
                        />
                     </div>
                     <div>
                        <button
                           className="text-sm font-montserrat font-semibold pl-2"
                           onClick={handleTryAnotherForm}
                        >
                           Tente de outra forma
                        </button>
                     </div>
                  </>
               )}
               <div className="flex justify-center items-center">
                  <button
                     type="submit"
                     className="bg-white text-havprincipal font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-md text-sm sm:text-base mt-2"
                  >
                     Enviar código
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default RecContaForm;
