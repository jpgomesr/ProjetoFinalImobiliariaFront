import "next-auth";

declare module "next-auth" {
   interface Session {
      accessToken?: string;
      user: {
         id?: string;
         name?: string;
         email?: string;
         role?: string;
         image?: string | null;
         // Outras propriedades personalizadas
      };
   }

   interface User {
      accessToken?: string;
      id: string;
      name?: string;
      email?: string;
      role?: string;
      image?: string | null;
   }
}
