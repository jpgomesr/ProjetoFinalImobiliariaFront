"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";

const codRecContaSchema = z.object({
   codigo: z.string().length(6, { message: "Código inválido" }),
});

type CodRecContaFormData = z.infer<typeof codRecContaSchema>;

interface CodRecContaFormProps {
   email: string;
   senha : string;
   callbackUrl?: string;
}

const CodRecContaForm = ({ email, senha, callbackUrl }: CodRecContaFormProps) => {
   const [codigo, setCodigo] = useState<string[]>(["", "", "", "", "", ""]);

   const {
      handleSubmit,
      formState: { errors },
      clearErrors,
      setValue,
   } = useForm<CodRecContaFormData>({
      resolver: zodResolver(codRecContaSchema),
      defaultValues: {
         codigo: "",
      },
   });

   const onSubmit = async (data: CodRecContaFormData) => {
      const response = await signIn("credentials", {
         email: email,
         password: senha,
         codigo: data.codigo,
         callbackUrl: callbackUrl || "/",
         redirect: true,
      });
   };

   const handleChange = (index: number, value: string) => {
      if (value.length > 1) return;

      const newCodigo = [...codigo];
      newCodigo[index] = value;
      setCodigo(newCodigo);

      setValue("codigo", newCodigo.join(""));

      if (value && index < 5) {
         const nextInput = document.getElementById(`codigo-${index + 1}`);
         if (nextInput) {
            (nextInput as HTMLInputElement).focus();
         }
      }
   };

   const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
   ) => {
      if (e.key === "Backspace" && !codigo[index] && index > 0) {
         const prevInput = document.getElementById(`codigo-${index - 1}`);
         if (prevInput) {
            (prevInput as HTMLInputElement).focus();
         }
      }
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[450px]">
         <div className="flex flex-col gap-3 sm:gap-4 w-full bg-havprincipal text-white rounded-lg p-4 sm:p-5 md:p-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
               Verificação de dois fatores
            </h1>
            {errors.codigo && (
               <div className="w-full flex justify-center">
                  <span className="text-havprincipal bg-white px-2 py-1 rounded-lg text-sm sm:text-base font-montserrat">
                     {errors.codigo?.message}
                  </span>
               </div>
            )}
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="flex flex-col gap-3"
            >
               <div className="flex items-center text-black p-2 sm:p-2.5 rounded-md min-w-0 justify-between">
                  {codigo.map((value, index) => (
                     <input
                        key={index}
                        id={`codigo-${index}`}
                        type="text"
                        maxLength={1}
                        placeholder=""
                        value={value}
                        className="min-w-0 bg-transparent outline-none px-2 sm:px-3 text-sm
                                    bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-md sm:text-base text-center"
                        onChange={(e) => {
                           handleChange(index, e.target.value);
                           clearErrors();
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                     />
                  ))}
               </div>
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

export default CodRecContaForm;
