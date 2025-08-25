import {
  createLink,
  getLinkById,
  listLinks,
  updateLinkDestinationsById,
  updateLinkNameById,
} from "@repo/data-ops/queries/links";
import { createLinkSchema, destinationsSchema, paginationSchema } from "@repo/data-ops/zod-schema/links";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "@/worker/trpc/trpc-instance";
import { ACTIVE_LINKS_LAST_HOUR, LAST_30_DAYS_BY_COUNTRY } from "./dummy-data";

export const linksTrpcRoutes = t.router({
  linkList: t.procedure.input(paginationSchema).query(async ({ input }) => {
    return await listLinks(input);
  }),
  createLink: t.procedure.input(createLinkSchema).mutation(async ({ ctx, input }) => {
    return await createLink({ accountId: ctx.userInfo.userId, ...input });
  }),
  updateLinkName: t.procedure
    .input(
      z.object({
        linkId: z.string(),
        name: z.string().min(1).max(300),
      }),
    )
    .mutation(async ({ input }) => {
      updateLinkNameById(input);
    }),
  getLink: t.procedure
    .input(
      z.object({
        linkId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const data = getLinkById(input);

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return data;
    }),
  updateLinkDestinations: t.procedure
    .input(
      z.object({
        linkId: z.string(),
        destinations: destinationsSchema,
      }),
    )
    .mutation(async ({ input }) => {
      return await updateLinkDestinationsById(input);
    }),
  activeLinks: t.procedure.query(async () => {
    return ACTIVE_LINKS_LAST_HOUR;
  }),
  totalLinkClickLastHour: t.procedure.query(async () => {
    return 13;
  }),
  last24HourClicks: t.procedure.query(async () => {
    return {
      last24Hours: 56,
      previous24Hours: 532,
      percentChange: 12,
    };
  }),
  last30DaysClicks: t.procedure.query(async () => {
    return 78;
  }),
  clicksByCountry: t.procedure.query(async () => {
    return LAST_30_DAYS_BY_COUNTRY;
  }),
});
