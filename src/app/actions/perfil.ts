'use server';

export async function fetchPerfilData(id: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar os dados do usuário");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw new Error("Erro ao carregar os dados");
  }
}

export async function atualizarPerfil(id: string, formData: FormData) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar usuário");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw new Error("Erro ao atualizar o perfil");
  }
} 