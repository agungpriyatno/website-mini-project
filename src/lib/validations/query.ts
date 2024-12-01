import { z } from "zod";

export const queryParams = z.object({
  limit: z.number().min(1),
  page: z.number().min(1),
  search: z.string().nullable(),
  searchField: z.string().nullable(),
  orderField: z.string().nullable(),
  orderType: z.enum(["asc", "desc"]).nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

export type QueryParams = z.infer<typeof queryParams>;
