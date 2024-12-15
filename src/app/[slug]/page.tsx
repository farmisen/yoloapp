import Image from "next/image"
import { notFound } from "next/navigation"

import { api } from "~/trpc/server"

const MicrositePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  const microsite = await api.microsites.getBySlug({ slug })

  if (!microsite) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{microsite.name}</h1>
      <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.webp"
          alt={microsite.name}
          fill
          className="object-cover"
        />
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
