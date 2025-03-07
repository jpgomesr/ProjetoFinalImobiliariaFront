"use client";

import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import InputPadrao from "@/components/InputPadrao";
import Layout from "@/components/layout/LayoutPadrao";
import SubLayoutPaginasCRUD from "@/components/layout/SubLayoutPaginasCRUD";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const page = () => {
   const [status, setStatus] = useState<string>("Ativo");
   const [revalidarQuery, setRevalidarQuery] = useState<boolean>(false);
   const opcoesStatus = ["Ativo", "Desativado"];
   const [nomePesquisa, setNomePesquisa] = useState<string>("");

   const setRevalidandoQuery =
      (funcao: (valor: any) => any) => (valor: any) => {
         funcao(valor);
         setRevalidarQuery(!revalidarQuery);
      };

   // Garante que o código só seja executado no cliente
   useEffect(() => {
      // Lógica que depende do cliente
   }, []);

   return (
      <Layout className="py-0">
         <SubLayoutPaginasCRUD>
            <FundoBrancoPadrao
               titulo="Gerenciamento de proprietarios"
               className="w-full"
            >
               <div
                  className="grid grid-cols-1 gap-3 w-full
               md:grid-cols-[1fr_5fr_1fr_1fr]
               xl:grid-cols-[1fr_6fr_1fr_1fr]   
               "
               >
                  <InputPadrao
                     type="text"
                     htmlFor="input-busca-nome"
                     onChange={(e) =>
                        setRevalidandoQuery(setNomePesquisa)(e.target.value)
                     }
                     placeholder="Digite o nome que deseja pesquisar"
                     required={false}
                  />
                  <Link href={"/usuarios/cadastro"}>
                     <button
                        className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full
                  text-sm py-1 px-2
                  lg:text-base lg:py-2 lg:px-3
                  2xl:py-3 2xl:px-4"
                     >
                        Adicionar <PlusIcon className="w-4" />
                     </button>
                  </Link>
               </div>
               <div
                  className="grid grid-cols-1 gap-4 w-full
               md:mt-2
               lg:place-content-center lg:self-center lg:grid-cols-2 lg:mt-4
               2xl:mt-6"
               ></div>
            </FundoBrancoPadrao>
         </SubLayoutPaginasCRUD>
      </Layout>
   );
};

export default page;
