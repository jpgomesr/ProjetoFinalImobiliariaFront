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
         async authorize(credentials) {
            if (!credentials) return null;

            try {
               const url = credentials.codigo
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/2fa/verify`
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;

               const response = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                     email: credentials.email,
                     senha: credentials.password,
                     ...(credentials.codigo
                        ? { codigo: credentials.codigo }
                        : {}),
                  }),
               });

               if (!response.ok) {
                  console.error("Erro na resposta:", await response.text());
                  return null;
               }

               const data = await response.json();
               const token =
                  data.accessToken ||
                  data.token ||
                  data.access_token ||
                  data.jwt;

               if (!token) return null;

               const decodedToken = jwt.decode(token) as JwtPayload & {
                  id?: number;
                  nome?: string;
                  email?: string;
                  foto?: string | null;
                  role?: string;
               };

               return {
                  id: decodedToken?.id?.toString() || "1",
                  name: decodedToken?.nome || "Usuário",
                  email: decodedToken?.email || credentials.email,
                  image: decodedToken?.foto || null,
                  role: decodedToken?.role || "USER",
                  accessToken: token,
               };
            } catch (error) {
               console.error("Erro na autenticação:", error);
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
                  console.error("Erro Google:", await response.text());
                  return false;
               }

               const data = await response.json();
               const token =
                  data.accessToken ||
                  data.token ||
                  data.access_token ||
                  data.jwt;

               if (!token) {
                  console.error("Token não recebido do backend");
                  return false;
               }

               const decodedToken = jwt.decode(token) as JwtPayload & {
                  id?: number;
                  nome?: string;
                  email?: string;
                  foto?: string | null;
                  role?: string;
               };

               (user as any).accessToken = token;
               (user as any).id = decodedToken?.id?.toString() || "1";
               (user as any).role = decodedToken?.role || "USER";

               return true;
            } catch (error) {
               console.error("Erro Google:", error);
               return false;
            }
         }
         return true;
      },
      async jwt({ token, user, account }) {
         if (user) {
            token.accessToken = user.accessToken;
            token.id = user.id;
            token.role = user.role;
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
