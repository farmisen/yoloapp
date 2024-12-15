import Link from "next/link"

import { HydrateClient, api } from "~/trpc/server"

import MicrositeCard from "./_components/MicrositeCard"

const HomePage = async () => {
  const featuredMicrosites = await api.microsites.getFeatured()
  void api.microsites.getFeatured.prefetch()

  return (
    <HydrateClient>
      <div>
        <h1 className="text-3xl font-bold mb-8">Featured Restaurants</h1>
        <div className="grid grid-cols-3 gap-6">
          {featuredMicrosites.map((microsite) => (
            <Link href={`/${microsite.slug}`} key={microsite.id}>
              <MicrositeCard microsite={microsite} />
            </Link>
          ))}
        </div>
      </div>
    </HydrateClient>
  )
}

export default HomePage
