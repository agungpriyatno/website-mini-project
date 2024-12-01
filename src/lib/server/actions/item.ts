"use server";

import { ItemCreateReq, ItemUpdateReq } from "@/lib/validations/item";
import { QueryParams } from "@/lib/validations/query";
import db from "../services/database";

export const itemCreate = async (data: ItemCreateReq) => {
  const resp = await db.item.create({ data });
  return resp;
};

export const itemUpdate = async (code: string, data: ItemUpdateReq) => {
  const resp = await db.item.update({ where: { code }, data });
  return resp;
};

export const itemDelete = async (code: string) => {
  const data = await db.item.findUnique({
    where: { code },
    include: { sales: { include: { sale: true } } },
  });

  await db.item.delete({ where: { code } });

  if (data?.sales.length) {
    for (let i = 0; i < data.sales.length; i++) {
      const item = data.sales[i];
      await db.sale.update({
        where: { id: item.saleId },
        data: {
          totalPrice: item.sale.totalPrice - item.totalPrice,
        },
      });
    }
  }
};

export const itemDeleteMany = async (codes: string[]) => {
  const resp = await db.item.deleteMany({ where: { code: { in: codes } } });
  return resp;
};

export const itemFind = async (code: string) => {
  const resp = await db.item.findUnique({
    where: { code },
    include: { _count: { select: { sales: true } } },
  });
  return resp;
};

export const itemFindMany = async ({
  page,
  limit,
  search,
  searchField,
  orderField,
  orderType,
  startDate,
  endDate,
}: QueryParams) => {
  const data = await db.item.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      [searchField ?? "name"]: { contains: search ?? undefined, mode: "insensitive" },
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
    },
    orderBy: { [orderField ?? "createdAt"]: orderType ?? "asc" },
    include: {
      _count: {
        select: { sales: true },
      },
    },
  });

  const total = await db.item.count({
    where: {
      [searchField ?? "name"]: {
        contains: search ?? undefined,
        mode: "insensitive",
      },
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
    },
  });
  return {
    total,
    data,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
