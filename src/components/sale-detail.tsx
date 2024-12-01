"use client";

import { Customer, Item, Sale, SalesItem } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type SaleDetailProps = {
  data: Sale & {
    customer: Customer;
    items: (SalesItem & { item: Item })[];
  };
};

const SaleDetail = ({ data }: SaleDetailProps) => {
  function formatPrice(price: bigint): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(price);
  }
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{data.customer.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Domicile</TableCell>
                <TableCell>{data.customer.domicile}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gender</TableCell>
                <TableCell>{data.customer.gender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Created At</TableCell>
                <TableCell>{data.createdAt.toDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Items</TableCell>
                <TableCell className="space-x-4">
                  <span>{data.items.length}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex flex-row justify-end w-full gap-3">
            <Button asChild variant={"outline"}>
              <Link href="/sales">Back</Link>
            </Button>
            <Button asChild>
              <Link href={`/sales/${data.id}/update`}>Update</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            {data.items.length === 0 && (
              <TableCaption>No data found.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map(({ item, quantity, totalPrice }, i) => (
                <TableRow key={item.code}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>{formatPrice(totalPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export { SaleDetail };

