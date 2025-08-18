import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: string
    approved: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      approved: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    approved: boolean
  }
}