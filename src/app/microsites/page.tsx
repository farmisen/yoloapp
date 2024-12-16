"use client"

import { ThumbsUp, TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react"

import PrefixedInput from "../_components/PrefixedInput"

const slugSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "URL can only contain lowercase letters, numbers, and hyphens, but not start or end with a hyphen."
  )

const NewMicrositePage = () => {
  const [slug, setSlug] = useState<string>("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const query = api.microsites.getBySlug.useQuery(
    { slug },
    { enabled: slug.length > 0 }
  )

  const handleChange = (newSlug: string) => {
    const result = slugSchema.safeParse(newSlug)
    setSlug(newSlug)
    if (result.success) {
      setValidationError(null)
    } else {
      setValidationError(result.error.errors[0]?.message ?? "Invalid URL")
    }
  }

  const validSlug =
    slug.length > 0 && query.status === "success" && !query.data && !validationError
  const takenSlug = slug.length > 0 && query.status === "success" && query.data

  return (
    <div className="w-[420px] m-auto pt-40">
      <Label>Choose you microsite URL</Label>
      <div className="flex gap-2 ">
        <PrefixedInput
          prefix="https://yoloapp.com/"
          placeholder="your-restaurant-name"
          value={slug}
          onChange={(e) => {
            handleChange(e.target.value)
          }}
          className="w-96"
        />

        <Button disabled={!validSlug} variant="outline" asChild>
          <Link href={`/microsites/${slug}`}>Continue</Link>
        </Button>
      </div>
      {validSlug && (
        <div className="flex gap-1">
          <ThumbsUp className="text-green-400 w-4" />
          <span className="text-green-400">{`${slug} is available`}</span>
        </div>
      )}
      {takenSlug && (
        <div className="flex gap-1">
          <TriangleAlert className="text-destructive w-4" />
          <span className="text-destructive">{`${slug} is already taken`}</span>
        </div>
      )}
      {validationError && (
        <div className="flex gap-1">
          <TriangleAlert className="text-destructive w-4" />
          <span className="text-destructive">{validationError}</span>
        </div>
      )}
    </div>
  )
}

export default NewMicrositePage
