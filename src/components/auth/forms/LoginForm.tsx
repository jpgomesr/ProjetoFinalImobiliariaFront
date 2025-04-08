"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const loginSchema = z.object({
   login: z.string().min(1, { message: "Login é obrigatório" }),
   password: z.string().min(1, { message: "Senha é obrigatória" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
   callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: LoginFormProps) => {
   const [showPassword, setShowPassword] = useState(false);
   const [loginError, setLoginError] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
      clearErrors,
      setError,
   } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         login: "",
         password: "",
      },
   });

   const onSubmit = async (data: LoginFormData) => {
      try {
         setIsLoading(true);
         const finalCallbackUrl = callbackUrl || "/";

         const response = await signIn("credentials", {
            email: data.login,
            password: data.password,
            callbackUrl: finalCallbackUrl,
            redirect: false,
         });

         if (response?.error) {
            setLoginError(true);
            setError("login", {
               message: "Login ou senha incorretos",
               type: "manual",
            });
            setError("password", {
               message: "Login ou senha incorretos",
               type: "manual",
            });
            console.log(errors);
         } else {
            setLoginError(false);
            router.push(finalCallbackUrl);
         }
      } catch (error) {
         setLoginError(true);
         console.error("Erro ao fazer login:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[400px]">
         <div className="flex flex-col gap-3 sm:gap-4 w-full bg-havprincipal text-white rounded-lg p-4 sm:p-5 md:p-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
               Login
            </h1>
            {loginError && (
               <div className="w-full flex justify-center">
                  <span className="text-havprincipal bg-white px-2 py-1 rounded-lg text-sm sm:text-base font-montserrat">
                     Login ou senha incorretos
                  </span>
               </div>
            )}
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
               }}
               className="flex flex-col gap-3"
            >
               <div className="flex flex-col gap-2">
                  <label htmlFor="login" className="text-xs sm:text-sm">
                     Login
                  </label>
                  <div className="flex items-center bg-white text-black p-2 sm:p-2.5 rounded-md min-w-0">
                     <User className="text-havprincipal w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                     <input
                        type="text"
                        placeholder="Email ou nome de usuário"
                        {...register("login")}
                        className="min-w-0 w-full bg-transparent outline-none px-2 sm:px-3 text-sm sm:text-base placeholder:truncate"
                        onChange={() => {
                           clearErrors("login");
                           clearErrors("password");
                           setLoginError(false);
                        }}
                        disabled={isLoading}
                     />
                  </div>
                  <label htmlFor="password" className="text-xs sm:text-sm">
                     Senha
                  </label>
                  <div className="flex items-center bg-white text-black p-2 sm:p-2.5 rounded-md min-w-0">
                     <Lock className="text-havprincipal w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        {...register("password")}
                        className="min-w-0 w-full bg-transparent outline-none px-2 sm:px-3 text-sm sm:text-base"
                        onChange={() => {
                           clearErrors("login");
                           clearErrors("password");
                           setLoginError(false);
                        }}
                        disabled={isLoading}
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-havprincipal flex-shrink-0"
                        disabled={isLoading}
                     >
                        {showPassword ? (
                           <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                           <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                     </button>
                  </div>
                  <Link href="/autenticacao/recuperacao">
                     <span className="text-xs sm:text-sm font-light ml-2 font-montserrat">
                        Esqueceu sua senha?
                     </span>
                  </Link>
               </div>
               <div className="flex justify-center items-center gap-3 sm:gap-4">
                  <button
                     type="submit"
                     className={`bg-white text-havprincipal font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-md text-sm sm:text-base mt-2 ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                     }`}
                     disabled={isLoading}
                  >
                     {isLoading ? "Carregando..." : "Entrar"}
                  </button>
                  <p className="text-sm sm:text-base">ou</p>
                  <button
                     className={`flex items-center bg-white text-havprincipal gap-2 px-3 py-2 sm:py-2.5 
                              rounded-md font-bold text-sm sm:text-base mt-2 ${
                                 isLoading
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                              }`}
                     disabled={isLoading}
                  >
                     <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                     />
                     Google
                  </button>
               </div>
               <div className="text-center">
                  <p className="text-xs sm:text-sm">Não possui uma conta?</p>
                  <Link href="/autenticacao/cadastro">
                     <button
                        className="font-semibold text-xs sm:text-sm text-white"
                        disabled={isLoading}
                     >
                        clique aqui!
                     </button>
                  </Link>
               </div>
            </form>
         </div>
      </div>
   );
};

export default LoginForm;
