import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const micrositesRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const microsite = await ctx.db.microsite.findUnique({
        where: { slug: input.slug },
        include: {
          menu: true
        }
      })

      if (microsite?.menu) {
        return {
          ...microsite,
          menu: {
            ...microsite.menu,
            // Convert Buffer to base64 string
            data: microsite.menu.data.toString("base64")
          }
        }
      }

      return microsite
    }),

  getFeatured: publicProcedure
    .input(
      z.object({ limit: z.number().min(1).default(9), cursor: z.string().nullish() })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const microsites = await ctx.db.microsite.findMany({
        orderBy: { updatedAt: "desc" },
        take: limit + 1,
        ...(cursor && { skip: 1, cursor: { id: cursor } })
      })

      let nextCursor: string | undefined = undefined
      if (microsites.length > limit) {
        const nextMicrosite = microsites.pop()
        nextCursor = nextMicrosite!.id
      }

      return {
        microsites,
        nextCursor
      }
    }),

  createOrUpdate: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        slug: z.string().min(1),
        cuisine: z.string().min(1),
        phone: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...microsite } = input
      const result = id
        ? ctx.db.microsite.update({
            where: { id },
            data: microsite
          })
        : ctx.db.microsite.create({
            data: microsite
          })
      revalidatePath(`/microsites/${microsite.slug}`)
      revalidatePath(`/${microsite.slug}`)

      return result
    }),

  uploadMenu: publicProcedure
    .input(
      z.object({
        micrositeId: z.string(),
        micrositeSlug: z.string(),
        file: z.object({
          data: z.string(),
          mimeType: z.string()
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Extract the base64 data from the DataURL
      // and convert it to a Buffer
      const base64Data = input.file.data.split(";base64,").pop()
      if (!base64Data) {
        throw new Error("Invalid file data")
      }
      const fileBuffer = Buffer.from(base64Data, "base64")

      const result = await ctx.db.menu.upsert({
        where: {
          micrositeId: input.micrositeId
        },
        update: {
          data: fileBuffer,
          mimeType: input.file.mimeType
        },
        create: {
          micrositeId: input.micrositeId,
          data: fileBuffer,
          mimeType: input.file.mimeType
        }
      })

      revalidatePath(`/microsites/${input.micrositeSlug}`)
      revalidatePath(`/${input.micrositeSlug}`)

      return {
        id: result.id,
        micrositeId: result.micrositeId,
        mimeType: result.mimeType,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }
    }),

  deleteMenu: publicProcedure
    .input(
      z.object({
        micrositeId: z.string(),
        micrositeSlug: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.menu.delete({
        where: {
          micrositeId: input.micrositeId
        }
      })

      revalidatePath(`/microsites/${input.micrositeSlug}`)
      revalidatePath(`/${input.micrositeSlug}`)

      return {}
    })
})
