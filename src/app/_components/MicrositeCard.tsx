import { type Microsite } from "@prisma/client"
import Image from "next/image"
import { type FC } from "react"

type MicrositeCardProps = {
  microsite: Microsite
}

const MicrositeCard: FC<MicrositeCardProps> = ({ microsite }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <Image
          src="/placeholder.webp"
          alt={microsite.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{microsite.name}</h2>
        <p className="text-muted-foreground mb-2">{microsite.cuisine}</p>
        <p className="text-foreground">{microsite.phone}</p>
      </div>
    </div>
  )
}

export default MicrositeCard
