import { type Microsite } from "@prisma/client"
import Image from "next/image"
import { type FC } from "react"

type MicrositeCardProps = {
  microsite: Microsite
}

const MicrositeCard: FC<MicrositeCardProps> = ({ microsite }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src="/placeholder.webp"
          alt={microsite.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="mb-2 text-xl font-semibold">{microsite.name}</h2>
        <p className="mb-2 text-muted-foreground">{microsite.cuisine}</p>
        <p className="text-foreground">{microsite.phone}</p>
      </div>
    </div>
  )
}

export default MicrositeCard
