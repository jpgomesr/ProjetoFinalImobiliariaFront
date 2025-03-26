import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    pages: {
        signIn: "/autenticacao/login",
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
              email: { label: "Email", type: "email", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
              if(!credentials){
                return null
              }
              const response = await fetch("http://localhost:8082/auth/login", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      email: credentials.email,
                      senha: credentials.password,
                  }),
              });

              if (response.ok) {
                  return {
                      id: "1", 
                      name: "Carlos",
                      email: "carlos@gmail.com",
                  };
              }
              return null
            }
          })

    ]
})

export { handler as GET, handler as POST }