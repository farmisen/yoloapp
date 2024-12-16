"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"

import MicrositeCard from "./_components/MicrositeCard"

const HomePage = () => {
  const { ref, inView } = useInView()

  const query = api.microsites.getFeatured.useInfiniteQuery(
    {
      limit: 9
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor
    }
  )

  useEffect(() => {
    if (inView && query.hasNextPage) {
      void query.fetchNextPage()
    }
  }, [inView, query, query.hasNextPage])

  const featuredMicrosites = query.data?.pages.flatMap((page) => page.microsites) ?? []

  return (
    <div>
      <Button variant="outline" className="mb-4" asChild>
        <Link href={"/microsites"}>
          <Plus />
          Add Restaurant
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-8">Featured Restaurants</h1>
      <div className="grid grid-cols-3 gap-6">
        {featuredMicrosites.map((microsite) => (
          <Link href={`/${microsite.slug}`} key={microsite.id}>
            <MicrositeCard microsite={microsite} />
          </Link>
        ))}
      </div>
      <div ref={ref} className="w-full h-10 bg-transparent" />
    </div>
  )
}

export default HomePage
