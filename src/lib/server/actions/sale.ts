"use server";

import {
  SaleCreateReq,
  SaleFindManyReq,
  SaleUpdateReq,
} from "@/lib/validations/sale";
import db from "../services/database";

export const saleCreate = async (payload: SaleCreateReq) => {
  const data = await db.sale.create({
    data: {
      customerId: payload.customerId,
      totalPrice: payload.totalPrice,
    },
  });

  await db.salesItem.createMany({
    skipDuplicates: true,
    data: payload.items.map((item) => ({
      saleId: data.id,
      itemCode: item.itemCode,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    })),
  });

  return data;
};

export const saleUpdate = async (id: string, payload: SaleUpdateReq) => {
  console.log(payload);

  await db.sale.update({
    where: { id },
    data: {
      customerId: payload.customerId,
      totalPrice: payload.totalPrice,
      items: {
        createMany: {
          skipDuplicates: true,
          data: payload.items.map((item) => ({
            itemCode: item.itemCode,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
    },
  });
};

export const saleDelete = async (id: string) => {
  const data = await db.sale.delete({ where: { id } });
  return data;
};

export const saleItemDelete = async (itemCode: string) => {
  const data = await db.salesItem.deleteMany({ where: { itemCode: itemCode } });
  return data;
}

export const saleFind = async (id: string) => {
  const data = await db.sale.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { item: true } },
    },
  });
  return data;
};

export const saleFindMany = async ({
  page,
  limit,
  orderField,
  orderType,
  startDate,
  endDate,
  customerId,
  itemCode,
}: SaleFindManyReq) => {
  const order = orderField?.includes(".")
    ? {
        [orderField.split(".")[0]]: {
          [orderField.split(".")[1]]: orderType ?? "asc",
        },
      }
    : { [orderField ?? "createdAt"]: orderType ?? "asc" };
  const data = await db.sale.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
      customerId: customerId ?? undefined,
      items: { some: { itemCode: itemCode ?? undefined } },
    },
    orderBy: { ...order },
    include: {
      customer: true,
      _count: { select: { items: true } },
    },
  });

  const total = await db.sale.count({
    where: {
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
      customerId: customerId ?? undefined,
      items: { some: { itemCode: itemCode ?? undefined } },
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
