

import LogoHav from "@/svg/icons/logo/LogoHavClaro";
import FacebookIcon from "@/svg/icons/footer/FacebookIcon";
import InstagramIcon from "@/svg/icons/footer/InstagramIcon";
import TwitterIcon from "@/svg/icons/footer/TwitterIcon";
import React from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
   const router = useRouter();

   const NavButton = ({ label, route }: { label: string; route: string }) => (
      <button
         onClick={() => router.push(route)}
         className="text-white font-extralight"
      >
         {label}
      </button>
   );

   const navItems = [
      {
         group: "Grupo 1",
         items: [
            { label: "Termos de serviço", route: "/" },
            { label: "Corretores", route: "/" },
            { label: "Política de privacidade", route: "/" },
         ],
      },
      {
         group: "Grupo 2",
         items: [
            { label: "HAV na sociedade", route: "/" },
            { label: "Contato", route: "/" },
            { label: "Conheça a HAV", route: "/" },
         ],
      },
      {
         group: "Grupo 3",
         items: [
            { label: "Feedbacks", route: "/" },
            { label: "Cadastre-se", route: "/" },
            { label: "Casas", route: "/" },
         ],
      },
      {
         group: "Grupo 4",
         items: [
            { label: "Apartamentos", route: "/" },
            { label: "Dúvidas frequentes", route: "/" },
            { label: "Chat Bot", route: "/" },
         ],
      },
   ];

   return (
      <div
         className="px-4 pb-12 pt-6 bg-havprincipal h-full w-full
                     sm:pt-8
                     md:pt-10
                     lg:pt-12
                     xl:pt-14"
      >
         <div className="flex flex-col px-4 gap-4 text-xs text-[#DFDAD0] justify-center items-start">
            <div
               className="flex flex-col gap-4 w-full
                           md:flex-row md:px-8 md:justify-between md:text-sm
                           lg:px-32
                           xl:flex-row xl:px-52 xl:justify-between xl:text-base"
            >
               <div
                  className="grid grid-cols-1 w-full justify-between gap-4
                              sm:grid-cols-2
                              md:grid-cols-4"
               >
                  {navItems.map((group, index) => (
                     <div
                        key={index}
                        className="flex flex-col items-start gap-4"
                     >
                        {group.items.map((item, idx) => (
                           <NavButton
                              key={idx}
                              label={item.label}
                              route={item.route}
                           />
                        ))}
                     </div>
                  ))}
               </div>
            </div>
            <div className="w-full flex gap-4 flex-col">
               <div
                  className="flex flex-col items-start gap-4
                           sm:flex-row sm:items-center sm:justify-between sm:w-full
                           md:px-8
                           lg:px-16
                           xl:px-20"
               >
                  <div className="flex flex-row gap-2 justify-center">
                     <LogoHav
                        className="w-12 h-12
                                 sm:w-14 sm:h-14
                                 md:w-16 md:h-16"
                        visible={false}
                     />
                     <button
                        className="sm:text-sm
                                 md:text-base
                                 lg:text-lg
                                 xl:text-xl"
                        onClick={() => router.push("/")}
                     >
                        HAV Imobiliária
                     </button>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-4">
                     <button onClick={() => router.push("/")}>
                        <FacebookIcon
                           className="w-5 h-5
                                    sm:w-6 sm:h-6
                                    lg:w-7 lg:h-7"
                        />
                     </button>
                     <button onClick={() => router.push("/")}>
                        <InstagramIcon
                           className="w-5 h-5 
                                    sm:w-6 sm:h-6
                                    lg:w-7 lg:h-7"
                        />
                     </button>
                     <button onClick={() => router.push("/")}>
                        <TwitterIcon
                           className="w-5 h-5 
                                    sm:w-6 sm:h-6
                                    lg:w-7 lg:h-7"
                        />
                     </button>
                  </div>
               </div>
               <div
                  className="w-full opacity-0 hidden
                           sm:opacity-70 sm:flex
                           md:px-8
                           lg:px-16
                           xl:px-20"
               >
                  <div className="border-white border-[1px] w-full"></div>
               </div>
               <div
                  className="text-[10px] flex flex-col gap-4
                           sm:flex-row sm:justify-between sm:w-full
                           md:text-xs md:px-8
                           lg:text-base lg:font-light lg:px-16
                           xl:px-20"
               >
                  <p>RUA DAS FLORES 6212</p>
                  <p>VILA NOVA </p>
                  <p>JARAGUÁ DO SUL - SC</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Footer;
