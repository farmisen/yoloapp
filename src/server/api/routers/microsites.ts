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

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const microsites = await ctx.db.microsite.findMany({
      orderBy: { createdAt: "desc" },
      take: 9
    })

    return microsites
  })
})
