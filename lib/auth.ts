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
    discordId?: string
    accessibleGuildIds?: string[]
    adminGuildIds?: string[]
  }
}

export const { handlers, auth, signIn, signOut, unstable_update: update } = NextAuth({
  providers: [
    Discord({
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
        token.discordId = (profile as { id?: string })?.id ?? token.sub!
        const { accessible, admin } = await getUserAccessibleGuilds(
          token.discordId,
          account.access_token
        )
        token.accessibleGuildIds = accessible
        token.adminGuildIds = admin
      } else if (trigger === "update" && token.accessToken && token.discordId) {
        const { accessible, admin } = await getUserAccessibleGuilds(
          token.discordId,
          token.accessToken
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
