export enum Roles {
   USUARIO = "USUARIO", 
   ADMINISTRADOR = "ADMINISTRADOR",
   CORRETOR = "CORRETOR",
   EDITOR = "EDITOR",
}

// Mapeamento para exibição no frontend
export const RolesDisplay = {
   [Roles.USUARIO]: "Usuário",
   [Roles.ADMINISTRADOR]: "Administrador",
   [Roles.CORRETOR]: "Corretor",
   [Roles.EDITOR]: "Editor"
};

// Função auxiliar para obter o nome formatado do papel
export function obterNomeRole(role: Roles): string {
   return RolesDisplay[role] || "Desconhecido";
}
