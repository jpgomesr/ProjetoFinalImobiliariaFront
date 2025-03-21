"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const trocaSenhaSchema = z
   .object({
      newPassword: z
         .string()
         .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
         .regex(/[A-Z]/, {
            message: "A senha deve conter pelo menos uma letra maiúscula.",
         })
         .regex(/[a-z]/, {
            message: "A senha deve conter pelo menos uma letra minúscula.",
         })
         .regex(/[0-9]/, {
            message: "A senha deve conter pelo menos um número.",
         })
         .regex(/[^A-Za-z0-9]/, {
            message: "A senha deve conter pelo menos um caractere especial.",
         }),
      confirmPassword: z
         .string()
         .min(1, { message: "Confirmar senha é obrigatória" }),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "As senhas não coincidem",
   });

type TrocaSenhaFormData = z.infer<typeof trocaSenhaSchema>;

const TrocaSenhaForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
      clearErrors,
   } = useForm<TrocaSenhaFormData>({
      resolver: zodResolver(trocaSenhaSchema),
      defaultValues: {
         newPassword: "",
         confirmPassword: "",
      },
   });

   const onSubmit = (data: TrocaSenhaFormData) => {
      console.log(data);
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[400px] 2xl:max-w-xl">
         <div className="flex flex-col gap-2 sm:gap-3 2xl:gap-4 w-full bg-havprincipal text-white rounded-lg p-4 sm:p-5 md:p-6 2xl:p-8">
            <h1 className="text-base sm:text-lg md:text-xl 2xl:text-2xl font-bold text-center">
               Troca de senha
            </h1>
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col gap-2"
            >
               <div className="flex flex-col gap-1">
                  <label
                     htmlFor="newPassword"
                     className="text-[10px] sm:text-xs 2xl:text-base"
                  >
                     Nova senha
                  </label>
                  <div className="flex items-center bg-white text-black p-2 sm:p-2.5 rounded-md min-w-0">
                     <Lock className="text-havprincipal w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        {...register("newPassword")}
                        className="min-w-0 w-full bg-transparent outline-none px-2 sm:px-3 text-xs sm:text-sm 2xl:text-base placeholder:truncate"
                        onChange={() => {
                           clearErrors("newPassword");
                           clearErrors("confirmPassword");
                        }}
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-havprincipal flex-shrink-0"
                     >
                        {showPassword ? (
                           <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                           <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                     </button>
                  </div>
                  {errors.newPassword && (
                     <span className="text-red-100 text-[8px] sm:text-[10px]">
                        {errors.newPassword.message}
                     </span>
                  )}
                  <label
                     htmlFor="confirmPassword"
                     className="text-[10px] sm:text-xs 2xl:text-base"
                  >
                     Confirmar senha
                  </label>
                  <div className="flex items-center bg-white text-black p-2 sm:p-2.5 rounded-md min-w-0">
                     <Lock className="text-havprincipal w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                     <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar senha"
                        {...register("confirmPassword")}
                        className="min-w-0 w-full bg-transparent outline-none px-2 sm:px-3 text-xs sm:text-sm 2xl:text-base"
                        onChange={() => {
                           clearErrors("newPassword");
                           clearErrors("confirmPassword");
                        }}
                     />
                     <button
                        type="button"
                        onClick={() =>
                           setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-havprincipal flex-shrink-0"
                     >
                        {showConfirmPassword ? (
                           <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                           <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                     </button>
                  </div>
                  {errors.confirmPassword && (
                     <span className="text-red-100 text-[8px] sm:text-[10px]">
                        {errors.confirmPassword.message}
                     </span>
                  )}
               </div>
               <div className="flex justify-center items-center gap-2 sm:gap-4">
                  <button
                     type="submit"
                     className="bg-white text-havprincipal font-bold py-2 px-4 sm:py-2.5 sm:px-5 2xl:py-3 2xl:px-6 rounded-md text-xs sm:text-sm 2xl:text-base mt-1"
                  >
                     Alterar
                  </button>
                  <p className="text-xs sm:text-sm 2xl:text-sm">ou</p>
                  <button
                     className="flex items-center bg-white text-havprincipal gap-1 px-2 py-2 sm:py-2.5 
                              rounded-md font-bold text-xs sm:text-sm mt-1"
                     onClick={() => router.push("/")}
                  >
                     Cancelar
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default TrocaSenhaForm;
