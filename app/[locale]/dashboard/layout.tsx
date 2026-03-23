import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchGuildBasic } from "@/lib/discord"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/api/auth/signin")

  const guilds = (
    await Promise.all(session.accessibleGuildIds.map((id) => fetchGuildBasic(id)))
  ).filter((g): g is NonNullable<typeof g> => g !== null)

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        guilds={guilds}
        userName={session.user?.name ?? "User"}
        userImage={session.user?.image ?? null}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
