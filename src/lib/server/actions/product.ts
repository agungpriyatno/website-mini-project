"use server";

import { ProductCreateReq, ProductUpdateReq } from "@/lib/validations/product";
import { QueryParams } from "@/lib/validations/query";
import db from "../services/database";

export const productCreate = async (data: ProductCreateReq) => {
  const resp = await db.product.create({ data });
  return resp;
};

export const productUpdate = async (code: string, data: ProductUpdateReq) => {
  const resp = await db.product.update({ where: { code }, data });
  return resp;
};

export const productDelete = async (code: string) => {
  const data = await db.product.findUnique({
    where: { code },
    include: { orders: { include: { order: true } } },
  });

  await db.product.delete({ where: { code } });

  if (data?.orders.length) {
    for (let i = 0; i < data.orders.length; i++) {
      const item = data.orders[i];
      await db.order.update({
        where: { id: item.order.id },
        data: {
          totalPrice: item.order.totalPrice - item.totalPrice,
        },
      });
    }
  }
};

export const productDeleteMany = async (codes: string[]) => {
  const resp = await db.product.deleteMany({ where: { code: { in: codes } } });
  return resp;
};

export const productFind = async (code: string) => {
  const resp = await db.product.findUnique({
    where: { code },
    include: { _count: { select: { orders: true } } },
  });
  return resp;
};

export const productFindMany = async ({
  page,
  limit,
  search,
  searchField,
  orderField,
  orderType,
  startDate,
  endDate,
}: QueryParams) => {
  const data = await db.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      [searchField ?? "name"]: {
        contains: search ?? undefined,
        mode: "insensitive",
      },
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
    },
    orderBy: { [orderField ?? "createdAt"]: orderType ?? "asc" },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  const total = await db.product.count({
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
