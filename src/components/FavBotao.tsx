"use client";

import { useEffect, useState } from "react";
import ModalCofirmacao from "./ComponentesCrud/ModalConfirmacao";
import { useSession } from "next-auth/react";
import {
   adicionarImovelFavorito,
   removerImovelFavorito,
} from "@/Functions/usuario/favoritos";
import { useNotification } from "@/context/NotificationContext";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
interface HomeProps {
   idImovel: number;
   favorited: boolean;
   dark: boolean;
   setIsFavorited: (favorited: boolean) => void;
}

export default function FavButton({
   idImovel,
   favorited,
   dark,
   setIsFavorited,
}: HomeProps) {
   const [handleRemoveFav, setHandleRemoveFav] = useState(false);
   const { data: session } = useSession();
   const { showNotification } = useNotification();

   
   useEffect(() => {
      setIsFavorited(favorited);
   }, [favorited]);

   const removerFavorito = async (idImovel: number) => {
      if (session?.user?.id) {
         try {
            await removerImovelFavorito(idImovel,  session.accessToken ?? "");
            setHandleRemoveFav(false);
            setIsFavorited(false);
            showNotification("Imóvel removido dos favoritos");
         } catch (error) {
            console.error("Erro ao remover favorito:", error);
            showNotification("Erro ao remover favorito");
         }
      }
   };

   const handleChangeFav = async () => {  
      if(!session) {
         redirect(`/api/auth/signin`) 
      }
      if (!favorited) {
         try {
            await adicionarImovelFavorito(idImovel, session?.accessToken ?? "");
            setIsFavorited(true);
            showNotification("Imóvel adicionado aos favoritos");
         } catch (error) {
            console.error("Erro ao adicionar favorito:", error);
            showNotification("Erro ao adicionar aos favoritos");
         }
      } else {
         setHandleRemoveFav(true);
      }
   };

   return (
      <>
         <button
            className="flex items-center justify-center"
            onClick={handleChangeFav}
         >
            <Heart
               className={`text-havprincipal ${
                  !dark ? "text-havprincipal" : "text-white"
               }`}
               size={15}
               fill={
                  
                  favorited ? "currentColor" : "none"}
            />
         </button>

         <ModalCofirmacao
            message="Deseja remover este imóvel dos seus favoritos?"
            isOpen={handleRemoveFav}
            onClose={() => setHandleRemoveFav(false)}
            onConfirm={() => removerFavorito(idImovel)}
         />
      </>
   );
}
