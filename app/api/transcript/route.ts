import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const url = req.nextUrl.searchParams.get("url")
  if (!url) return new NextResponse("Missing url", { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse("Invalid url", { status: 400 })
  }

  // Only allow http/https
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return new NextResponse("Invalid url", { status: 400 })
  }

  const upstream = await fetch(url)
  if (!upstream.ok) {
    return new NextResponse("Failed to fetch transcript", { status: 502 })
  }

  const html = await upstream.text()

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline",
      "X-Frame-Options": "SAMEORIGIN",
    },
  })
}
