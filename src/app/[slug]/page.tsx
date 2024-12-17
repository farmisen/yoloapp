import { Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { type FC } from "react"

import FileRenderer from "~/app/_components/FileRenderer"
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/server"

type MicrositePageProps = {
  params: Promise<{ slug: string }>
}

const MicrositePage: FC<MicrositePageProps> = async ({ params }) => {
  const { slug } = await params

  const microsite = await api.microsites.getBySlug({ slug })

  if (!microsite) {
    notFound()
  }

  return (
    <div>
      <Button variant="outline" className="mb-4" asChild>
        <Link href={`/microsites/${microsite.slug}`}>
          <Pencil />
          Edit Restaurant
        </Link>
      </Button>
      <h1 className="mb-4 text-3xl font-bold">{microsite.name}</h1>
      <div className="mb-4 flex gap-4">
        <div className="relative aspect-video flex-1 overflow-hidden rounded-lg">
          <Image
            src="/placeholder.webp"
            alt={microsite.name}
            fill
            className="object-cover"
          />
        </div>
        {microsite.menu && (
          <div className="aspect-video flex-1 overflow-hidden rounded-lg">
            <FileRenderer
              mimeType={microsite.menu.mimeType}
              base64Data={String(microsite.menu.data)}
              alt="Menu"
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <p className="text-lg">
          <span className="font-semibold">Cuisine:</span> {microsite.cuisine}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Phone:</span> {microsite.phone}
        </p>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  )
}

export default MicrositePage
