// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Здесь можно подключить Supabase Auth
        if (!credentials?.email || !credentials?.password) return null
        return { id: "1", email: credentials.email as string, name: "Пользователь" }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
})