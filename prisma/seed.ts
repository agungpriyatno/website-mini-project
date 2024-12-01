import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createRandomCustomer() {
  return {
    name: faker.internet.username(),
    gender: faker.number.int({ min: 0, max: 1 }) == 1 ? "MALE" : "FEMALE",
    domicile: faker.location.city(),
  };
}

export const customers = faker.helpers.multiple(createRandomCustomer, {
  count: 100,
});

export function createRandomItem(index: number) {
  return {
    code: `ITEM-${index + 1}`,
    name: faker.commerce.productName(),
    category: faker.commerce.productAdjective(),
    price: faker.number.int({ min: 10000, max: 1000000 }),
  };
}

export const items = faker.helpers.multiple((_, i) => createRandomItem(i), {
  count: 100,
});

const main = async () => {
  await prisma.customer.createMany({
    data: customers,
  });

  await prisma.item.createMany({
    data: items,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
