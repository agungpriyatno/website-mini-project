"use server";

import {
  CustomerCreateReq,
  CustomerUpdateReq,
} from "@/lib/validations/customer";
import db from "../services/database";
import { QueryParams } from "@/lib/validations/query";

export const customerCreate = async (data: CustomerCreateReq) => {
  const resp = await db.customer.create({ data });
  return resp;
};

export const customerUpdate = async (id: string, data: CustomerUpdateReq) => {
  const resp = await db.customer.update({ where: { id }, data });
  return resp;
};

export const customerDelete = async (id: string) => {
  const resp = await db.customer.delete({ where: { id } });
  return resp;
};

export const customerDeleteMany = async (ids: string[]) => {
  const resp = await db.customer.deleteMany({ where: { id: { in: ids } } });
  return resp;
};

export const customerFind = async (id: string) => {
  const resp = await db.customer.findUnique({
    where: { id },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });
  return resp;
};

export const customerFindMany = async ({
  page,
  limit,
  search,
  searchField,
  orderField,
  orderType,
  startDate,
  endDate,
}: QueryParams) => {
  const data = await db.customer.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      [searchField ?? "name"]: { contains: search ?? undefined, mode: "insensitive" },
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
    },
    orderBy: { [orderField ?? "createdAt"]: orderType ?? "asc" },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });
  const total = await db.customer.count({
    where: {
      [searchField ?? "name"]: { contains: search ?? undefined, mode: "insensitive" },
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
    },
  });

  const totalPages = Math.ceil(total / limit);
 
  return {
    total,
    data,
    page,
    limit,
    totalPages,
  };
};
