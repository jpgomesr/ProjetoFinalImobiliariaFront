import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import jwt, { JwtPayload } from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
   pages: {
      signIn: "/autenticacao/login",
   },
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith" },
            password: { label: "Password", type: "password" },
            codigo: { label: "Codigo", type: "codigo", required: false }
         },
         async authorize(credentials, req) {
            if (!credentials) {
               return null;
            }
            try {
               let url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;
               if(credentials.codigo){
                url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/2fa/verify`;
               }
                  
               const response = await fetch(
                  url,
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        email: credentials.email,
                        senha: credentials.password,
                        ...(credentials.codigo ? { codigo: credentials.codigo } : {})
                     }),
                  }
               );

               if (response.ok) {
                  const data = await response.json();
                  const token =
                     data.accessToken ||
                     data.token ||
                     data.access_token ||
                     data.jwt ||
                     data;

                  const decodedToken = jwt.decode(token) as JwtPayload & {
                     id?: number;
                     nome?: string;
                     email?: string;
                     foto?: string | null;
                     role?: string;
                  };

                  return {
                     id:
                        decodedToken?.id?.toString() ||
                        (typeof decodedToken?.sub === "string"
                           ? decodedToken.sub
                           : "1"),
                     name:
                        decodedToken?.nome ||
                        (decodedToken?.name as string) ||
                        "Usuário",
                     email: decodedToken?.email || credentials.email,
                     image: decodedToken?.foto || null,
                     role: decodedToken?.role || undefined,
                     accessToken: token,
                  };
               } else {
                  console.error(
                     "Erro na resposta da API:",
                     await response.text()
                  );
                  return null;
               }
            } catch (error) {
               console.error("Erro durante autenticação:", error);
               return null;
            }
         },
      }),
      GoogleProvider({
         clientId : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
         clientSecret :  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || ""
      })
   ],
   callbacks: {
      async jwt({ token, user, account, profile }) {


         if (account?.provider === "google" && profile?.email) {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: profile.email,
                    nome: profile.name,
                    foto: profile.image,
                  }),
                }
              );
    
              const data = await response.json();
    
              const backendToken =
                data.accessToken || data.token || data.access_token || data.jwt;
    
              const decoded = jwt.decode(backendToken) as JwtPayload & {
                id?: number;
                role?: string;
              };
    
              token.accessToken = backendToken;
              token.id = decoded?.id?.toString() || "";
              token.role = decoded?.role;
    
            } catch (err) {
              console.error("Erro ao criar/pegar usuário do backend via Google:", err);
            }
          }


         if (user) {
            token.accessToken = user.accessToken;
            token.id = user.id;
            token.role = user.role;
            console.log("JWT callback - token atualizado:", token);
         }
         return token;
      },
      async session({ session, token }) {
         session.accessToken = token.accessToken as string;
         session.user.id = token.id as string;
         session.user.role = token.role as string;
         return session;
      },
   },
   secret: process.env.NEXTAUTH_SECRET || "meu-segredo-muito-seguro",
};
