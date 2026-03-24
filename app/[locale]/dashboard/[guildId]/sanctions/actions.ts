"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateReason(id: number, reason: string, guildId: string) {
  const session = await auth()
  if (!session?.accessibleGuildIds.includes(guildId)) {
    throw new Error("Unauthorized")
  }
  await prisma.mod_logs.updateMany({
    where: { id, guild_id: guildId },
    data: { reason: reason.trim() || null },
  })
}

export async function deleteSanction(id: number, guildId: string) {
  const session = await auth()
  if (!session?.adminGuildIds.includes(guildId)) {
    throw new Error("Unauthorized")
  }
  await prisma.mod_logs.deleteMany({
    where: { id, guild_id: guildId },
  })
}
