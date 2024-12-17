import { Plus } from "lucide-react"
import Link from "next/link"

import MicrositesGrid from "~/app/_components/MicrositesGrid"
import { Button } from "~/components/ui/button"

export const dynamic = "force-dynamic"

const HomePage = async () => {
  return (
    <div>
      <Button variant="outline" className="mb-4" asChild>
        <Link href={"/microsites"}>
          <Plus />
          Add Restaurant
        </Link>
      </Button>
      <h1 className="mb-8 text-3xl font-bold">Featured Restaurants</h1>
      <MicrositesGrid />
    </div>
  )
}

export default HomePage
