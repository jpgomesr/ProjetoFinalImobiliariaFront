import React from "react";
import UsuarioDeslogadoImage from "../svg/icons/UsuarioDeslogadoImage";
import { UserRound } from "lucide-react";
import FotoUsuarioDeslogado from "./FotoUsuarioDeslogado";

interface CardUsuarioProps {
   nome: string;
   email: string;
   tipoConta: string;
   status: string;
   imagem?: string;
}

const CardUsuario = (props: CardUsuarioProps) => {
   return (
      <div className="text-sm border border-gray-700 rounded-md shadow-[4px_4px_4px_rgba(0,0,0,0.2)] py-2 px-2 flex gap-3">
         <FotoUsuarioDeslogado />
         <div>
            <p>Informações</p>

            <div>
               <div className="flex items-center justify-between">
                  <p>Nome :{props.nome}</p>
                  <p>Status :{props.status}</p>
               </div>
               <div className="flex items-center justify-between">
                  <p>Email :{props.email}</p>
                  <p>Tipo conta :{props.tipoConta}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CardUsuario;
