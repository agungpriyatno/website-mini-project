"use server";

import db from "../services/database";

export const totalPriceSale = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const data = await db.sale.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      totalPrice: true,
    },
  });
  return data._sum.totalPrice ?? 0;
};
