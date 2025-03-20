import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

const loginSchema = z.object({
   login: z.string().min(1, { message: "Login é obrigatório" }),
   password: z.string().min(1, { message: "Senha é obrigatória" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
   onClose?: () => void;
   onRegister?: () => void;
}

const LoginForm = ({ onClose, onRegister }: LoginFormProps) => {
   const [showPassword, setShowPassword] = useState(false);
   const {
      register,
      handleSubmit,
      formState: { errors },
      clearErrors,
   } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         login: "",
         password: "",
      },
   });

   const onSubmit = (data: LoginFormData) => {
      console.log(data);
   };

   return (
      <div className="flex justify-center items-center">
         <div className="flex flex-col gap-3 w-full max-w-md bg-havprincipal text-white rounded-lg p-5">
            <h1 className="text-xl font-bold text-center">Login</h1>
            {(errors.login || errors.password) && (
               <span className="text-havprincipal bg-white px-2 py-1 rounded-lg text-sm font-montserrat">
                  Login ou senha incorretos
               </span>
            )}
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col gap-2"
            >
               <div className="flex flex-col gap-1">
                  <label htmlFor="login" className="text-xs">
                     Login
                  </label>
                  <div className="flex items-center bg-white text-black p-1.5 rounded-md">
                     <User className="text-havprincipal w-4 h-4" />
                     <input
                        type="text"
                        placeholder="Email ou nome de usuário"
                        {...register("login")}
                        className="flex-1 bg-transparent outline-none px-2 text-sm"
                        onChange={() => {
                           clearErrors("login");
                           clearErrors("password");
                        }}
                     />
                  </div>
                  <label htmlFor="password" className="text-xs">
                     Senha
                  </label>
                  <div className="flex items-center bg-white text-black p-1.5 rounded-md">
                     <Lock className="text-havprincipal w-4 h-4" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        {...register("password")}
                        className="flex-1 bg-transparent outline-none px-2 text-sm"
                        onChange={() => {
                           clearErrors("login");
                           clearErrors("password");
                        }}
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-havprincipal"
                     >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                  </div>
                  <span className="text-xs font-light ml-2 font-montserrat">
                     Esqueceu sua senha?
                  </span>
               </div>
               <div className="flex justify-center items-center gap-4">
                  <button
                     type="submit"
                     className="bg-white text-havprincipal font-bold py-1.5 px-2 rounded-md text-sm mt-1"
                  >
                     Entrar
                  </button>
                  <p className="text-sm">ou</p>
                  <button
                     className="flex items-center bg-white text-havprincipal gap-1 px-2 py-1.5 
                              rounded-md font-bold text-sm mt-1"
                  >
                     <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                     />
                     Google
                  </button>
               </div>
               <div className="text-center">
                  <p className="text-xs">Não possui uma conta?</p>
                  <button
                     className="font-semibold text-xs text-white"
                     onClick={onRegister}
                  >
                     clique aqui!
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default LoginForm;
