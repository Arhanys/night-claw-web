import { prisma } from "./prisma"

const DISCORD_API = "https://discord.com/api/v10"
const ADMINISTRATOR = BigInt(0x8)

interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  permissions: string
}

export interface GuildBasic {
  id: string
  name: string
  icon: string | null
}

export interface GuildStats extends GuildBasic {
  approximateMemberCount: number
  approximatePresenceCount: number
}

/**
 * Determines which bot-configured guilds the user can access as mod or admin.
 * Called once at login — result is stored in the JWT session.
 *
 * NOTE: After `prisma db pull`, verify that the model name (guildConfig) and
 * field names (guild_id, mod_role) match the generated schema.
 */
export async function getUserAccessibleGuilds(
  userId: string,
  accessToken: string
): Promise<{ accessible: string[]; admin: string[] }> {
  // 1. Fetch all guilds the user is a member of
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) return { accessible: [], admin: [] }

  const userGuilds: DiscordGuild[] = await res.json()
  const userGuildIds = userGuilds.map((g) => g.id)

  // 2. Find which of those guilds have the bot configured
  const botGuilds = await prisma.server_settings.findMany({
    where: { guild_id: { in: userGuildIds }, source_guild_id: null },
    select: { guild_id: true, mod_role_id: true },
  }) as { guild_id: string; mod_role_id: string | null }[]
  const configMap = new Map(botGuilds.map((g) => [g.guild_id, g.mod_role_id]))

  const accessible: string[] = []
  const admin: string[] = []

  for (const guild of userGuilds) {
    if (!configMap.has(guild.id)) continue

    const isAdmin = (BigInt(guild.permissions) & ADMINISTRATOR) === ADMINISTRATOR
    if (isAdmin) {
      accessible.push(guild.id)
      admin.push(guild.id)
      continue
    }

    // 3. For non-admins, check if user holds the configured mod role
    const modRole = configMap.get(guild.id)
    if (!modRole) continue

    const memberRes = await fetch(
      `${DISCORD_API}/guilds/${guild.id}/members/${userId}`,
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        cache: "no-store",
      }
    )
    if (!memberRes.ok) continue

    const member = await memberRes.json()
    if (Array.isArray(member.roles) && member.roles.includes(modRole)) {
      accessible.push(guild.id)
    }
  }

  return { accessible, admin }
}

/** Fetch guild name, icon, and member/presence counts using the bot token. */
export async function fetchGuildStats(guildId: string): Promise<GuildStats | null> {
  const res = await fetch(
    `${DISCORD_API}/guilds/${guildId}?with_counts=true`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      next: { revalidate: 60 },
    }
  )
  if (!res.ok) return null
  const data = await res.json()
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    approximateMemberCount: data.approximate_member_count ?? 0,
    approximatePresenceCount: data.approximate_presence_count ?? 0,
  }
}

/** Fetch basic guild info (name + icon) for sidebar display. */
export async function fetchGuildBasic(guildId: string): Promise<GuildBasic | null> {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return { id: data.id, name: data.name, icon: data.icon }
}

export interface GuildMember {
  userId: string
  username: string
  globalName: string | null
  nick: string | null
  avatar: string | null
}

/**
 * Fetch all members of a guild who hold a specific role.
 * Uses the bot token. Fetches up to 1 000 members (sufficient for mod teams).
 */
export async function fetchGuildModerators(
  guildId: string,
  modRoleId: string
): Promise<GuildMember[]> {
  const res = await fetch(
    `${DISCORD_API}/guilds/${guildId}/members?limit=1000`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) return []
  const members: Array<{
    user: { id: string; username: string; global_name?: string; avatar?: string }
    nick?: string | null
    roles: string[]
  }> = await res.json()

  return members
    .filter((m) => m.roles.includes(modRoleId))
    .map((m) => ({
      userId: m.user.id,
      username: m.user.username,
      globalName: m.user.global_name ?? null,
      nick: m.nick ?? null,
      avatar: m.user.avatar ?? null,
    }))
}

/** Build the CDN URL for a guild's icon. Returns null if the guild has no icon. */
export function getGuildIconUrl(guildId: string, icon: string | null): string | null {
  if (!icon) return null
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.webp?size=64`
}

export interface DiscordUser {
  id: string
  username: string
  globalName: string | null
  avatar: string | null
}

/** Fetch a Discord user's profile using the bot token. Cached for 1 hour. */
export async function fetchDiscordUser(userId: string): Promise<DiscordUser | null> {
  const res = await fetch(`${DISCORD_API}/users/${userId}`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return {
    id: data.id,
    username: data.username,
    globalName: data.global_name ?? null,
    avatar: data.avatar ?? null,
  }
}

/** Batch-fetch multiple Discord users, deduplicated. Returns a map of id → user. */
export async function fetchDiscordUsers(
  userIds: string[]
): Promise<Map<string, DiscordUser>> {
  const unique = [...new Set(userIds)]
  const results = await Promise.all(unique.map((id) => fetchDiscordUser(id)))
  const map = new Map<string, DiscordUser>()
  results.forEach((user) => {
    if (user) map.set(user.id, user)
  })
  return map
}
