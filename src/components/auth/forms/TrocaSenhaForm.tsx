import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

const trocaSenhaSchema = z.object({
   newPassword: z.string().min(1, { message: "Nova senha é obrigatória" }),
   confirmPassword: z
      .string()
      .min(1, { message: "Confirmar senha é obrigatória" }),
});

type TrocaSenhaFormData = z.infer<typeof trocaSenhaSchema>;

const TrocaSenhaForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <div className="flex justify-center items-center w-full max-w-[300px] 2xl:max-w-xl">
         <div className="flex flex-col gap-2 sm:gap-3 2xl:gap-4 w-full bg-havprincipal text-white rounded-lg p-3 sm:p-4 md:p-5 2xl:p-8">
            <h1 className="text-base sm:text-lg md:text-xl 2xl:text-2xl font-bold text-center">
               Troca de senha
            </h1>
            {(errors.newPassword || errors.confirmPassword) && (
               <div className="w-full flex justify-center">
                  <span className="text-havprincipal bg-white px-2 py-1 rounded-lg text-xs sm:text-sm font-montserrat">
                     Nova senha ou confirmar senha incorretos
                  </span>
               </div>
            )}
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
                  <div className="flex items-center bg-white text-black p-1 sm:p-1.5 rounded-md min-w-0">
                     <Lock className="text-havprincipal w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        {...register("newPassword")}
                        className="min-w-0 w-full bg-transparent outline-none px-1 sm:px-2 text-xs sm:text-sm 2xl:text-base placeholder:truncate"
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
                           <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                           <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                     </button>
                  </div>
                  <label
                     htmlFor="confirmPassword"
                     className="text-[10px] sm:text-xs 2xl:text-base"
                  >
                     Confirmar senha
                  </label>
                  <div className="flex items-center bg-white text-black p-1 sm:p-1.5 rounded-md min-w-0">
                     <Lock className="text-havprincipal w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                     <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar senha"
                        {...register("confirmPassword")}
                        className="min-w-0 w-full bg-transparent outline-none px-1 sm:px-2 text-xs sm:text-sm 2xl:text-base"
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
                           <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                           <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                     </button>
                  </div>
               </div>
               <div className="flex justify-center items-center gap-2 sm:gap-4">
                  <button
                     type="submit"
                     className="bg-white text-havprincipal font-bold py-1 px-2 sm:py-1.5 sm:px-3 2xl:py-2 2xl:px-4 rounded-md text-xs sm:text-sm 2xl:text-base mt-1"
                  >
                     Alterar
                  </button>
                  <p className="text-xs sm:text-sm 2xl:text-sm">ou</p>
                  <button
                     className="flex items-center bg-white text-havprincipal gap-1 px-2 py-1 sm:py-1.5 
                              rounded-md font-bold text-xs sm:text-sm mt-1"
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
