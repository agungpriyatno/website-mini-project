import { z } from "zod";
import { queryParams } from "./query";
import { Sale } from "@prisma/client";

export const saleCreateReq = z.object({
  customerId: z.string().min(1),
  totalPrice: z.coerce.bigint(),
  items: z.array(
    z.object({
      itemCode: z.string().min(1),
      quantity: z.number().min(1),
      price: z.coerce.bigint(),
      totalPrice: z.coerce.bigint(),
    })
  ),
});

export const saleUpdateReq = saleCreateReq;
export const saleFindManyReq = queryParams.extend({
  customerId: z.string().nullable(),
  itemCode: z.string().nullable(),
});

export type SaleCreateReq = z.infer<typeof saleCreateReq>;
export type SaleUpdateReq = z.infer<typeof saleUpdateReq>;
export type SaleFindManyReq = z.infer<typeof saleFindManyReq>;

export type SaleFindManyRes = Sale & {
  _count: { items: number };
  customer: { name: string };
};
