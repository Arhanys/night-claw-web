import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import { SearchModal } from "@/components/SearchModal"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto">{children}</main>
      <Footer />
      <SearchModal />
    </>
  )
}
