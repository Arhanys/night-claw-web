import type { Metadata } from "next";
import "./globals.css";
import { ThemeProviders } from "./themeprovider";
import NavBar from "@/components/NavBar";
import { Inter } from "next/font/google";
import { FastSearchProvider } from "@/components/wrappers/FastSearch";
import { SearchModal } from "@/components/SearchModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NightClaw",
  description: "Your favorite discordbot dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background text-text"}>
        <ThemeProviders>
          <FastSearchProvider>
            <NavBar />
            <main className="max-w-7xl mx-auto">{children}</main>
            <SearchModal />
          </FastSearchProvider>
        </ThemeProviders>
      </body>
    </html>
  );
}
