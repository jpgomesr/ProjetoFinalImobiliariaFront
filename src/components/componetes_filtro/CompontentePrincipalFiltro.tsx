import React, { useState } from "react";
import LupaIcon from "@/svg/icons/LupaIcon";
import BotaoPadrao from "../BotaoPadrao";

const CompontentePrincipalFiltro = () => {
   const [tipoVenda, setTipoVenda] = useState<"Compra" | "Aluguel">("Compra");

   return (
      <div className="h-32 bg-white w-3/4 rounded-2xl p-4">
         <div className="flex items-center justify-center gap-16">
            <p
               className={`hover:cursor-pointer text-mobilePadrao
               ${
                  tipoVenda === "Compra"
                     ? "text-vermelhoHav"
                     : "text-cinzaNeutro"
               }`}
               onClick={() => setTipoVenda("Compra")}
            >
               Comprar
            </p>
            <p
               className={`hover:cursor-pointer text-mobilePadrao ${
                  tipoVenda === "Aluguel"
                     ? "text-vermelhoHav"
                     : "text-cinzaNeutro"
               }`}
               onClick={() => setTipoVenda("Aluguel")}
            >
               Alugar
            </p>
         </div>
         <div className="w-full h-[1px] bg-gray-400 my-2"></div>
         <div className="flex px-2 border-b items-center justify-center mb-3">
            <LupaIcon width={12} height={12} />
            <input
               type="text"
               className="ml-2 placeholder:text-mobilePadrao"
               placeholder="Fale um pouco sobre o imóvel"
            />
         </div>
         <div className="flex items-center justify-center">
            <BotaoPadrao texto="BUSCAR"/>
               
         </div>
      </div>
   );
};

export default CompontentePrincipalFiltro;
