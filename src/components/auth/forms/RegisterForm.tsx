"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

const registerSchema = z
   .object({
      name: z.string().min(1, { message: "Nome é obrigatório" }),
      email: z.string().email({ message: "Email inválido" }),
      password: z
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
         .min(1, { message: "Confirmar senha é obrigatório" }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
   });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const router = useRouter();

   const {
      register,
      handleSubmit,
      formState: { errors },
      clearErrors,
   } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   const onSubmit = (data: RegisterFormData) => {
      console.log(data);
   };

   return (
      <div className="flex justify-center items-center min-h-screen w-full max-w-[400px]">
         <div
            className={`flex flex-col gap-2 sm:gap-3 w-full bg-havprincipal text-white rounded-lg p-3 sm:p-4`}
         >
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
               Cadastro
            </h1>
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col gap-2"
            >
               <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-xs sm:text-sm">
                     Nome
                  </label>
                  <div className="flex items-center bg-white text-black p-1 sm:p-1.5 rounded-md">
                     <User className="text-havprincipal w-3 h-3 sm:w-4 sm:h-4" />
                     <input
                        type="text"
                        placeholder="Digite seu nome"
                        {...register("name")}
                        className="flex-1 bg-transparent outline-none px-1 sm:px-2 text-sm sm:text-base"
                     />
                  </div>
                  {errors.name && (
                     <span className="text-red-100 text-[8px] sm:text-[10px]">
                        {errors.name.message}
                     </span>
                  )}
               </div>

               <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-xs sm:text-sm">
                     Email
                  </label>
                  <div className="flex items-center bg-white text-black p-1 sm:p-1.5 rounded-md">
                     <Mail className="text-havprincipal w-3 h-3 sm:w-4 sm:h-4" />
                     <input
                        type="text"
                        placeholder="Digite seu email"
                        {...register("email")}
                        className="flex-1 bg-transparent outline-none px-1 sm:px-2 text-sm sm:text-base"
                     />
                  </div>
                  {errors.email && (
                     <span className="text-red-100 text-[8px] sm:text-[10px]">
                        {errors.email.message}
                     </span>
                  )}
               </div>

               <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-xs sm:text-sm">
                     Senha
                  </label>
                  <div className="flex items-center bg-white text-black p-1 sm:p-1.5 rounded-md">
                     <Lock className="text-havprincipal w-3 h-3 sm:w-4 sm:h-4" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        {...register("password")}
                        className="flex-1 bg-transparent outline-none px-1 sm:px-2 text-sm sm:text-base"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-havprincipal"
                     >
                        {showPassword ? (
                           <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                           <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                     </button>
                  </div>
                  {errors.password && (
                     <span className="text-red-100 text-[8px] sm:text-[10px]">
                        {errors.password.message}
                     </span>
                  )}
               </div>

               <div className="flex flex-col gap-1">
                  <label
                     htmlFor="confirmPassword"
                     className="text-xs sm:text-sm"
                  >
                     Confirmar senha
                  </label>
                  <div className="flex items-center bg-white text-black p-1 sm:p-1.5 rounded-md">
                     <Lock className="text-havprincipal w-3 h-3 sm:w-4 sm:h-4" />
                     <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar senha"
                        {...register("confirmPassword")}
                        className="flex-1 bg-transparent outline-none px-1 sm:px-2 text-sm sm:text-base"
                     />
                     <button
                        type="button"
                        onClick={() =>
                           setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-havprincipal"
                     >
                        {showConfirmPassword ? (
                           <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                           <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                     </button>
                  </div>
                  {errors.confirmPassword && (
                     <span className="text-red-100 text-[8px] sm:text-[10px]">
                        {errors.confirmPassword.message}
                     </span>
                  )}
               </div>

               <div className="flex justify-center items-center">
                  <button
                     type="submit"
                     className="bg-white text-havprincipal font-bold py-1 px-2 sm:py-1.5 sm:px-3 rounded-md text-xs sm:text-sm mt-1"
                  >
                     Cadastrar
                  </button>
               </div>
            </form>

            <div className="text-center">
               <p className="text-[10px] sm:text-xs">Já possui uma conta?</p>
               <button
                  className="font-semibold text-[10px] sm:text-xs text-white"
                  onClick={(e) => {
                     e.preventDefault();
                     router.push("/autentificacao/login");
                  }}
               >
                  clique aqui!
               </button>
            </div>
         </div>
      </div>
   );
};

export default RegisterForm;
