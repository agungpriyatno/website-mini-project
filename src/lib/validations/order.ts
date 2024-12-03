import { z } from "zod";
import { queryParams } from "./query";
import { Order } from "@prisma/client";

export const orderCreateReq = z.object({
  customerId: z.string().min(1),
  totalPrice: z.coerce.number(),
  products: z.array(
    z.object({
      productCode: z.string().min(1),
      quantity: z.number().min(1),
      price: z.coerce.number(),
      totalPrice: z.coerce.number(),
    })
  ),
});

export const orderUpdateReq = orderCreateReq;
export const orderFindManyReq = queryParams.extend({
  customerId: z.string().nullable(),
  productCode: z.string().nullable(),
});

export type OrderCreateReq = z.infer<typeof orderCreateReq>;
export type OrderUpdateReq = z.infer<typeof orderUpdateReq>;
export type OrderFindManyReq = z.infer<typeof orderFindManyReq>;

export type OrderFindManyRes = Order & {
  _count: { orders: number };
  customer: { name: string };
};
