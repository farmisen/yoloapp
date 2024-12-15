import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="top-0 sticky z-10 bg-background border-b">
      <div className="container mx-auto flex h-12 items-center">
        <div className="flex items-end gap-1">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-3xl font-semibold">YoloApp</span>
        </div>
      </div>
    </nav>
  )
}
