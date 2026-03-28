import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { getUserAccessibleGuilds, getAllBotGuildIds } from "./discord"

declare module "next-auth" {
  interface Session {
    accessibleGuildIds: string[]
    adminGuildIds: string[]
    isSuperAdmin: boolean
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
    discordId?: string
    accessibleGuildIds?: string[]
    adminGuildIds?: string[]
    isSuperAdmin?: boolean
    rolesLastChecked?: number
  }
}

const ROLES_RECHECK_INTERVAL_MS = 2 * 60 * 1000

async function resolveGuildAccess(
  discordId: string,
  accessToken: string,
  isSuperAdmin: boolean
): Promise<{ accessible: string[]; admin: string[] }> {
  if (isSuperAdmin) {
    const all = await getAllBotGuildIds()
    return { accessible: all, admin: all }
  }
  return getUserAccessibleGuilds(discordId, accessToken)
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
        const superAdminId = process.env.SUPERADMIN_DISCORD_ID
        token.isSuperAdmin = !!superAdminId && token.discordId === superAdminId
        const { accessible, admin } = await resolveGuildAccess(
          token.discordId,
          account.access_token,
          token.isSuperAdmin
        )
        token.accessibleGuildIds = accessible
        token.adminGuildIds = admin
        token.rolesLastChecked = Date.now()
      } else if (trigger === "update" && token.accessToken && token.discordId) {
        const { accessible, admin } = await resolveGuildAccess(
          token.discordId,
          token.accessToken,
          token.isSuperAdmin ?? false
        )
        token.accessibleGuildIds = accessible
        token.adminGuildIds = admin
        token.rolesLastChecked = Date.now()
      } else if (
        token.accessToken &&
        token.discordId &&
        Date.now() - (token.rolesLastChecked ?? 0) > ROLES_RECHECK_INTERVAL_MS
      ) {
        const { accessible, admin } = await resolveGuildAccess(
          token.discordId,
          token.accessToken,
          token.isSuperAdmin ?? false
        )
        token.accessibleGuildIds = accessible
        token.adminGuildIds = admin
        token.rolesLastChecked = Date.now()
      }
      return token
    },
    async session({ session, token }) {
      session.accessibleGuildIds = (token.accessibleGuildIds as string[]) ?? []
      session.adminGuildIds = (token.adminGuildIds as string[]) ?? []
      session.isSuperAdmin = token.isSuperAdmin ?? false
      return session
    },
  },
})
