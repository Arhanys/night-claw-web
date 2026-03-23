# NightClaw Dashboard — Specification

## Overview

A protected web dashboard for Discord server moderators. Moderators can view sanction history, server stats, and bot configuration. Head staff (Administrators) additionally have write access to bot configuration.

---

## Architecture

```
/dashboard                      → server selection (redirects to login if unauthenticated)
/dashboard/[guildId]            → server overview (real-time stats via Discord API)
/dashboard/[guildId]/sanctions  → sanction history (paginated, read-only)
/dashboard/[guildId]/config     → bot configuration (head staff only)
```

The dashboard lives outside `app/[locale]/` — it has its own layout, no i18n, no marketing navbar.

---

## Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `next-auth@5` (beta) | Discord OAuth, session management, App Router native |
| `@prisma/client` + `prisma` | Connect to existing PostgreSQL bot DB |

---

## Authentication & Roles

- **Login**: Discord OAuth via NextAuth v5. Login through Discord Developer Portal app (can reuse bot's application).
- **Server access**: Discord API returns the user's guilds; filter to those where the bot is present AND the user has mod role or Administrator.
- **Moderator** (mod role): Read-only access — sanctions, config view, stats.
- **Head Staff** (Administrator permission): Full access including config edits.
- **Verification**: Server-side check on each dashboard request against Discord API guild member data.

---

## Features

### Server Overview
- Member count (total + online)
- Server name & icon
- Channel count
- Bot status

> Stats fetched via Discord API using the bot token (`GET /guilds/{id}?with_counts=true`) — no DB storage, no bot changes needed.

### Sanction History
- Paginated list of all moderation actions for the server
- Columns: type (ban/kick/mute/warn), target user, moderator, date, reason
- Filterable by action type
- Read-only for all roles

### Bot Configuration
- View and edit all `/setup` fields: `log_channel`, `mod_role`, `confession_channel`, `language`, `source_guild`, `appeal_invite`, `main_invite`
- **Head Staff only** — regular mods see the values but cannot edit

---

## Files to Create

### Config & Utilities
- `prisma/schema.prisma` — generated via `prisma db pull` from existing bot DB
- `lib/prisma.ts` — Prisma client singleton
- `lib/auth.ts` — NextAuth v5 config (Discord provider + session callbacks)
- `lib/discord.ts` — Discord API helpers (fetch guild, member, stats)

### API Routes
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler

### Dashboard Pages
- `app/dashboard/layout.tsx` — sidebar layout, session guard
- `app/dashboard/page.tsx` — server selector
- `app/dashboard/[guildId]/page.tsx` — stats overview
- `app/dashboard/[guildId]/sanctions/page.tsx` — sanction table
- `app/dashboard/[guildId]/config/page.tsx` — config form (head staff gate)

### Middleware
- `middleware.ts` — extend existing i18n middleware to also protect `/dashboard` routes

---

## Environment Variables

```env
AUTH_SECRET=<random 32-char string>
AUTH_DISCORD_ID=<OAuth2 Client ID from Discord Developer Portal>
AUTH_DISCORD_SECRET=<OAuth2 Client Secret from Discord Developer Portal>
DATABASE_URL=postgresql://user:password@host:5432/dbname
DISCORD_BOT_TOKEN=<bot token — used server-side only for stats API calls>
```

### Discord Developer Portal setup
1. Go to https://discord.com/developers/applications
2. Select your bot's application (or create a new one)
3. OAuth2 → Redirects → add `http://localhost:3000/api/auth/callback/discord` (dev) and your production URL
4. Copy Client ID and Client Secret → set as env vars above

---

## Implementation Order

1. Install packages: `next-auth@beta`, `prisma`, `@prisma/client`
2. `npx prisma db pull` → inspect generated schema → write `lib/prisma.ts`
3. `lib/auth.ts` + NextAuth API route
4. Extend `middleware.ts` for `/dashboard` protection
5. `lib/discord.ts` helpers
6. Dashboard layout + server selector page
7. Guild overview page (stats cards)
8. Sanctions page (table + pagination)
9. Config page (form + head staff permission gate)

---

## Out of Scope (for now)
- i18n on the dashboard
- Ticket management / ban appeals UI
- Real-time updates (WebSocket / polling)
- Audit log of dashboard actions
- Join/leave history (would require bot-side tracking)
