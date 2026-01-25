import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Inter } from "next/font/google";
import { SearchModal } from "@/components/SearchModal";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NightClaw",
  description: "Your favorite discordbot dashboard.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background text-text"}>
        <Providers locale={locale}>
          <NavBar />
          <main className="max-w-7xl mx-auto">{children}</main>
          <SearchModal />
        </Providers>
      </body>
    </html>
  );
}
