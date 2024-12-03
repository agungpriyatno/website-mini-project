"use server";

import {
  OrderCreateReq,
  OrderFindManyReq,
  OrderUpdateReq,
} from "@/lib/validations/order";
import db from "../services/database";

export const orderCreate = async (payload: OrderCreateReq) => {
  const data = await db.order.create({
    data: {
      customerId: payload.customerId,
      totalPrice: payload.totalPrice,
    },
  });

  await db.orderProduct.createMany({
    skipDuplicates: true,
    data: payload.products.map((item) => ({
      orderId: data.id,
      productCode: item.productCode,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    })),
  });

  return data;
};

export const orderUpdate = async (id: string, payload: OrderUpdateReq) => {
  await db.order.update({
    where: { id },
    data: {
      customerId: payload.customerId,
      totalPrice: payload.totalPrice,
      products: { deleteMany: { orderId: id } },
    },
  });

  await db.order.update({
    where: { id },
    data: {
      customerId: payload.customerId,
      totalPrice: payload.totalPrice,
      products: {
        createMany: {
          skipDuplicates: true,
          data: payload.products.map((item) => ({
            productCode: item.productCode,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
    },
  });
};

export const orderDelete = async (id: string) => {
  const data = await db.order.delete({ where: { id } });
  return data;
};

export const orderItemDelete = async (orderId: string, productCode: string) => {
  const data = await db.orderProduct.deleteMany({
    where: { orderId, productCode: productCode },
  });
  return data;
};

export const orderFind = async (id: string) => {
  const data = await db.order.findUnique({
    where: { id },
    include: {
      customer: true,
      products: { include: { product: true } },
    },
  });
  return data;
};

export const orderFindMany = async ({
  page,
  limit,
  orderField,
  orderType,
  startDate,
  endDate,
  customerId,
  productCode,
}: OrderFindManyReq) => {
  const order = orderField?.includes(".")
    ? {
        [orderField.split(".")[0]]: {
          [orderField.split(".")[1]]: orderType ?? "asc",
        },
      }
    : { [orderField ?? "createdAt"]: orderType ?? "asc" };
  const data = await db.order.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
      customerId: customerId ?? undefined,
      products: { some: { productCode: productCode ?? undefined } },
    },
    orderBy: { ...order },
    include: {
      customer: true,
      _count: { select: { products: true } },
    },
  });

  const total = await db.order.count({
    where: {
      createdAt: { gte: startDate ?? undefined, lte: endDate ?? undefined },
      customerId: customerId ?? undefined,
      products: { some: { productCode: productCode ?? undefined } },
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
