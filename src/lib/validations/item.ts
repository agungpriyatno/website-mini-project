import { Item } from "@prisma/client";
import { z } from "zod";

export const itemCreateReq = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.coerce.bigint(),
});

export const itemUpdateReq = itemCreateReq;

export type ItemCreateReq = z.infer<typeof itemCreateReq>;
export type ItemUpdateReq = z.infer<typeof itemUpdateReq>;
export type ItemFindManyRes = Item & {
  _count: {
    sales: number;
  };
};
