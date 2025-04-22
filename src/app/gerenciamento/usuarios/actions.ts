
import { useFetchComAutorizacaoComToken } from "@/hooks/FetchComAuthorization";
import { redirect } from "next/navigation";

export async function deletarUsuario(id: number) {
   await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
   });
   redirect("/gerenciamento/usuarios"); // Redireciona para atualizar a lista
}

export async function restaurarUsuario(id: number, token: string) {


   
     await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/restaurar/${id}`, {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${token}`
         }
      });

      redirect("/gerenciamento/usuarios");

}