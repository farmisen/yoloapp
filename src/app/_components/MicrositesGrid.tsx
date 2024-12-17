"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import MicrositeCard from "~/app/_components/MicrositeCard"
import { api } from "~/trpc/react"

const MicrositesGrid = () => {
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
    <div className="grid grid-cols-3 gap-6">
      {featuredMicrosites.map((microsite) => (
        <Link href={`/${microsite.slug}`} key={microsite.id}>
          <MicrositeCard microsite={microsite} />
        </Link>
      ))}
      <div ref={ref} className="h-10 w-full bg-transparent" />
    </div>
  )
}

export default MicrositesGrid
