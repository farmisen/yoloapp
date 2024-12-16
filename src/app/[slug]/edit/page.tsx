"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { type FC, use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import FileUpload from "~/app/_components/FileUpload"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  cuisine: z.string().min(1, "Cuisine is required"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number")
    .optional(),
  menuFile: z
    .custom<File>()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        !file || file.type.startsWith("image/") || file.type === "application/pdf",
      "File must be an image or PDF"
    )
    .optional()
})

type FormData = z.infer<typeof formSchema>

type EditMicrositePageProps = {
  params: Promise<{ slug: string }>
}

const EditMicrositePage: FC<EditMicrositePageProps> = ({ params }) => {
  const { slug } = use(params)
  const query = api.microsites.getBySlug.useQuery({ slug })
  const mutation = api.microsites.createOrUpdate.useMutation()
  const menuUploadMutation = api.microsites.uploadMenu.useMutation()
  const menuDeleteMutation = api.microsites.deleteMenu.useMutation()

  const [menuFile, setMenuFile] = useState<File | null>(null)
  const [menuDeleted, setMenuDeleted] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (
    file: File | null,
    field: { onChange: (value: File | null) => void },
    isDelete = false
  ) => {
    if (isDelete) {
      setMenuFile(null)
      setPreviewUrl(null)
      setMenuDeleted(true)
      field.onChange(null)
      return
    }

    setMenuFile(file)
    setMenuDeleted(false)
    field.onChange(file)

    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const onSubmit = async (data: FormData) => {
    // update microsite
    const microsite = await mutation.mutateAsync({ ...data, id: query.data!.id })

    if (menuFile) {
      const reader = new FileReader()

      // convert file to base64 data URL
      const fileData = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(menuFile)
      })

      await menuUploadMutation.mutateAsync({
        micrositeId: microsite.id,
        file: {
          data: fileData as string,
          mimeType: menuFile.type
        }
      })
    }

    if (menuDeleted) {
      await menuDeleteMutation.mutateAsync({
        micrositeId: microsite.id
      })
    }
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      cuisine: "",
      phone: ""
    }
  })

  // Populate form with data from query and set preview URL
  useEffect(() => {
    if (query.isSuccess && query.data) {
      const { menu, ...micrositeData } = query.data
      const formData = {
        ...micrositeData,
        phone: micrositeData.phone ?? undefined
      }
      form.reset(formData)
      const dataUrl = menu ? `data:${menu.mimeType};base64,${String(menu.data)}` : null
      setPreviewUrl(dataUrl)
    }
  }, [query.isSuccess, query.data, form])

  // Cleanup when unmounting or when a new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (query.isSuccess && !query.data) {
    notFound()
  }

  if (query.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Button variant="outline" className="mb-4" asChild>
        <Link href={`/${query.data!.slug}`}>
          <ChevronLeft />
          Back to Details
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-8">Edit Restaurant</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Restaurant Details */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column - Menu Upload */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="menuFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Menu</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <FileUpload
                          accept="image/*,.pdf"
                          maxSize={MAX_FILE_SIZE}
                          value={menuFile}
                          previewUrl={previewUrl}
                          onChange={(file) => handleFileChange(file, field, false)}
                        />
                        {previewUrl && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleFileChange(null, field, true)}
                            className="mt-2">
                            Delete Menu
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Error Messages and Submit Button */}
          <div className="mt-6">
            {mutation.error && (
              <p className="text-destructive">
                Error saving microsite: {mutation.error.message}
              </p>
            )}
            {menuUploadMutation.error && (
              <p className="text-destructive-foreground">
                Error uploading menu: {menuUploadMutation.error.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending || menuUploadMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditMicrositePage
