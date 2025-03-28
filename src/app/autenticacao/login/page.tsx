import LoginForm from "@/components/auth/forms/LoginForm";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const page = async () => {

   const session = await getServerSession(authOptions);
   if (session) {
      redirect("/");
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
            <LoginForm />
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
