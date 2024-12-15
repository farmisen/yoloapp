import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const micrositesRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const microsite = await ctx.db.microsite.findUnique({
        where: { slug: input.slug }
      })

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
    })
})
