import React, { useState } from "react";
import LupaIcon from "@/svg/icons/LupaIcon";
import BotaoPadrao from "../BotaoPadrao";
import SetaSaibaMais from "@/svg/icons/SetaSaibaMais";

const CompontentePrincipalFiltro = () => {
   const [tipoVenda, setTipoVenda] = useState<"Compra" | "Aluguel">("Compra");
   const [filtroAberto, setFiltroAberto] = useState<boolean>(false);

   return (
      <div
         className={`flex flex-col items-center ${
            filtroAberto ? "h-96" : "h-36"
         } bg-white w-3/4 rounded-2xl p-4`}
      >
         <div className="flex items-center justify-center gap-16">
            <p
               className={`hover:cursor-pointer text-mobilePadrao
               ${
                  tipoVenda === "Compra"
                     ? "text-havprincipal"
                     : "text-cinzaNeutro"
               }`}
               onClick={() => setTipoVenda("Compra")}
            >
               Comprar
            </p>
            <p
               className={`hover:cursor-pointer text-mobilePadrao ${
                  tipoVenda === "Aluguel"
                     ? "text-havprincipal"
                     : "text-cinzaNeutro"
               }`}
               onClick={() => setTipoVenda("Aluguel")}
            >
               Alugar
            </p>
         </div>

         <div className="w-full h-[1px] bg-gray-400 my-2"></div>

         <div className="flex px-2 border-b items-center justify-center mb-3 pb-2">
            <LupaIcon width={16} height={16} />
            <input
               type="text"
               className="ml-2 placeholder:text-mobilePadrao"
               placeholder="Fale um pouco sobre o imóvel"
            />
         </div>

         {filtroAberto && (
            <>
               <p>Preço</p>
            </>
         )}

         <div className="flex items-center justify-center">
            <BotaoPadrao texto="BUSCAR" />
            <div
               className="botao bg-gray-100 text-black drop-shadow-xl flex items-center justify-center"
               onClick={() => setFiltroAberto(!filtroAberto)}
            >
               <p>FILTROS</p>
            </div>
         </div>
         {}
      </div>
   );
};

export default CompontentePrincipalFiltro;
