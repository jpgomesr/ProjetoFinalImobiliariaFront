import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import jwt, { JwtPayload } from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
   pages: {
      signIn: "/autenticacao/login",
      error: "/autenticacao/error",
   },
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith" },
            password: { label: "Password", type: "password" },
            codigo: { label: "Codigo", type: "codigo", required: false },
         },
         async authorize(credentials, req) {
            if (!credentials) {
               return null;
            }
            try {
               let url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;
               if (credentials.codigo) {
                  url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/2fa/verify`;
               }

               const response = await fetch(url, {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                     email: credentials.email,
                     senha: credentials.password,
                     ...(credentials.codigo
                        ? { codigo: credentials.codigo }
                        : {}),
                  }),
               });

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
         clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
         clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      }),
   ],
   callbacks: {
      async signIn({ account, profile, user }) {
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

               if (!response.ok) {
                  console.error(
                     "Erro ao autenticar com Google no backend:",
                     await response.text()
                  );
                  return false;
               }

               const data = await response.json();
               if (user) {
                  (user as any).backendToken =
                     data.accessToken ||
                     data.token ||
                     data.access_token ||
                     data.jwt;
               }

               return true;
            } catch (error) {
               console.error("Erro ao autenticar com Google:", error);
               return false;
            }
         }
         return true;
      },
      async jwt({ token, user, account }) {
         if (account?.provider === "google" && (user as any)?.backendToken) {
            try {
               const backendToken = (user as any).backendToken;
               const decoded = jwt.decode(backendToken) as JwtPayload & {
                  id?: number;
                  role?: string;
                  nome?: string;
                  email?: string;
                  foto?: string;
               };

               token.accessToken = backendToken;
               token.id = decoded?.id?.toString() || "";
               token.role = decoded?.role || "USER";
               token.name = decoded?.nome || user.name;
               token.email = decoded?.email || user.email;
               token.picture = decoded?.foto || user.image;
            } catch (error) {
               console.error("Erro ao processar token do backend:", error);
               token.accessToken = account.access_token;
               token.id = user.id;
               token.role = "USER";
            }
         }

         if (user && !account?.provider) {
            token.accessToken = user.accessToken;
            token.id = user.id;
            token.role = user.role;
         }

         return token;
      },
      async session({ session, token }) {
         if (!token.accessToken) {
            throw new Error("Token de acesso não encontrado");
         }

         session.accessToken = token.accessToken as string;
         session.user.id = token.id as string;
         session.user.role = token.role as string;
         session.user.name = token.name as string;
         session.user.email = token.email as string;
         session.user.image = token.picture as string;
         return session;
      },
   },
   secret: process.env.NEXTAUTH_SECRET || "meu-segredo-muito-seguro",
};
