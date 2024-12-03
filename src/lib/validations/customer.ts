import { Customer } from "@prisma/client";
import { z } from "zod";

export const customerCreateReq = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE"]),
});

export const customerUpdateReq = customerCreateReq;


export type CustomerCreateReq = z.infer<typeof customerCreateReq>;
export type CustomerUpdateReq = z.infer<typeof customerUpdateReq>;
export type CustomerFindManyRes = Customer & {
  _count: {
    sales: number;
  };
};
