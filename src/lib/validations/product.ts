import { Product } from "@prisma/client";
import { z } from "zod";

export const productCreateReq = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.coerce.number(),
});

export const productUpdateReq = productCreateReq;

export type ProductCreateReq = z.infer<typeof productCreateReq>;
export type ProductUpdateReq = z.infer<typeof productUpdateReq>;
export type ProductFindManyRes = Product & {
  _count: {
    orders: number;
  };
};
