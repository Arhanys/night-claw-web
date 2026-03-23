import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { getUserAccessibleGuilds } from "./discord"

declare module "next-auth" {
  interface Session {
    accessibleGuildIds: string[]
    adminGuildIds: string[]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
    accessibleGuildIds?: string[]
    adminGuildIds?: string[]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
        const { accessible, admin } = await getUserAccessibleGuilds(
          token.sub!,
          account.access_token
        )
        token.accessibleGuildIds = accessible
        token.adminGuildIds = admin
      }
      return token
    },
    async session({ session, token }) {
      session.accessibleGuildIds = (token.accessibleGuildIds as string[]) ?? []
      session.adminGuildIds = (token.adminGuildIds as string[]) ?? []
      return session
    },
  },
})
