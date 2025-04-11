import LoginForm from "@/components/auth/forms/LoginForm";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CodeSquare, Home } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

// Definir o tipo de parâmetros que a página pode receber
interface PageProps {
   searchParams: Promise<{
      callbackUrl?: string;
   }>;
}

const page = async ({ searchParams }: PageProps) => {
   const session = await getServerSession(authOptions);
   const searchParamsResolved = await searchParams;
   if (session) {
      // Se tiver callbackUrl, redireciona para lá, senão vai para homepage
      redirect(searchParamsResolved.callbackUrl || "/");
   }

   return (
      <>
         <div className="absolute md:top-8 md:left-8 top-4 left-4">
            <Link
               href="/"
               className="flex flex-row gap-4 font-montserrat font-semibold"
            >
               <div className="flex flex-row gap-2 items-center bg-havprincipal text-white px-4 py-3 rounded-md">
                  <Home />{" "}
                  <p className="text-sm md:text-base">Página inicial</p>
               </div>
            </Link>
         </div>
         <div
            className="h-screen w-screen flex flex-row justify-center items-center gap-32 bg-gradient-to-b 
                    from-begeEscuroPadrao to-white px-2"
         >
            <LoginForm callbackUrl={searchParamsResolved.callbackUrl} />
            <Image
               src={"/logoHavVermelhoCEscrita.svg"}
               alt="Logo Hav Vermelho Com Escrita"
               width={1000}
               height={1000}
               className={"hidden lg:block w-[20vw]"}
            />
         </div>
      </>
   );
};

export default page;
