import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <Link href="/">
      <nav className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex h-12 items-center">
          <div className="flex items-end gap-1">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="text-3xl font-semibold">YoloApp</span>
          </div>
        </div>
      </nav>
    </Link>
  )
}
