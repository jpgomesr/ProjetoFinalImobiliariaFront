"use server";

import { redirect } from "next/navigation";

export async function deletarUsuario(id: number) {
   await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
   });
   redirect("/usuarios"); // Redireciona para atualizar a lista
}

export async function restaurarUsuario(id: number) {
   await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/restaurar/${id}`, {
      method: "POST",
   });
   redirect("/usuarios"); // Redireciona para atualizar a lista
}