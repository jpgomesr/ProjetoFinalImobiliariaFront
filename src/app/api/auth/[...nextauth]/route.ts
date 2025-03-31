import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
         },
         async authorize(credentials, req) {
            if (!credentials) {
               return null;
            }
            try {
               const response = await fetch(
                  "http://localhost:8082/auth/login",
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        email: credentials.email,
                        senha: credentials.password,
                     }),
                  }
               );

               if (response.ok) {
                  // Obter o token JWT da resposta
                  const data = await response.json();

                  // Verifica a estrutura da resposta da API
                  const token =
                     data.accessToken ||
                     data.token ||
                     data.access_token ||
                     data.jwt ||
                     data;

                  // Decodificar o token JWT (sem verificar a assinatura)
                  const decodedToken = jwt.decode(token) as JwtPayload & {
                     id?: number;
                     nome?: string;
                     email?: string;
                     foto?: string | null;
                     role?: string;
                  };

                  // Retornar as informações do usuário e o token
                  return {
                     // Usar o ID numérico do token, convertendo para string
                     id:
                        decodedToken?.id?.toString() ||
                        (typeof decodedToken?.sub === "string"
                           ? decodedToken.sub
                           : "1"),
                     // Usar o nome do token ou fallback
                     name:
                        decodedToken?.nome ||
                        (decodedToken?.name as string) ||
                        "Usuário",
                     // Usar o email do token ou fallback
                     email: decodedToken?.email || credentials.email,
                     // Incluir outros campos úteis
                     image: decodedToken?.foto || null,
                     role: decodedToken?.role || undefined, // Alterado de null para undefined para corresponder ao tipo esperado
                     accessToken: token, // Salvar o token para uso posterior
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
   ],
   callbacks: {
      async jwt({ token, user }) {
         // Persistir o token de acesso e outros dados no token JWT
         if (user) {
            token.accessToken = user.accessToken;
            token.id = user.id;
            token.role = user.role;
            console.log("JWT callback - token atualizado:", token);
         }
         return token;
      },
      async session({ session, token }) {
         // Adicionar o token e outros dados à sessão disponível no cliente
         session.accessToken = token.accessToken as string;
         session.user.id = token.id as string;
         session.user.role = token.role as string;
         return session;
      },
   },
   debug: process.env.NODE_ENV === "development", // Ativa os logs de depuração em ambiente de desenvolvimento
   secret: process.env.NEXTAUTH_SECRET || "meu-segredo-muito-seguro",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
