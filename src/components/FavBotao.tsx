"use client";

import { useEffect, useState } from "react";
import Heart from "../svg/icons/CoracaoIcon";
import ModalCofirmacao from "./ComponentesCrud/ModalConfirmacao";
import { useSession } from "next-auth/react";
import { adicionarImovelFavorito, removerImovelFavorito } from "@/Functions/usuario/favoritos";
import { useNotification } from "@/context/NotificationContext";
interface HomeProps {
   idImovel: number; 
   favorited: boolean;
   dark: boolean;
   setIsFavorited: (favorited: boolean) => void;
}

export default function FavButton({ idImovel, favorited, dark, setIsFavorited }: HomeProps) {

   const [handleRemoveFav, setHandleRemoveFav] = useState(false);
   const { data: session } = useSession();
   const {showNotification} = useNotification()

   // Atualiza o estado quando a prop favorited mudar
   useEffect(() => {
      setIsFavorited(favorited);
   }, [favorited]);
   
   const removerFavorito = async (idImovel: number) => {
      if (session?.user?.id) {
         try {
            await removerImovelFavorito(idImovel, session.user.id);
            setHandleRemoveFav(false);
            window.location.reload();
            showNotification("Imóvel removido dos favoritos");
         } catch (error) {
            console.error("Erro ao remover favorito:", error);
            showNotification("Erro ao remover favorito");
         }
      }
   };

   const handleChangeFav = async () => {
      if(!favorited){
         try {
            await adicionarImovelFavorito(idImovel, session?.user?.id ?? "");
            setIsFavorited(true);
            window.location.reload();
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
         {<Heart favorited={favorited} height={15} width={15} dark={dark} />}
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
