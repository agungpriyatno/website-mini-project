"use client";

import { Item } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type ItemDetailProps = {
  data: Item & {
    _count: {
      sales: number;
    };
  };
};

const ItemDetail = ({ data }: ItemDetailProps) => {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Item Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">CODE</TableCell>
              <TableCell>{data.code}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell>{data.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Category</TableCell>
              <TableCell>{data.category}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Price</TableCell>
              <TableCell>{formatPrice(data.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Created At</TableCell>
              <TableCell>{data.createdAt.toDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Sales</TableCell>
              <TableCell className="space-x-4">
                <span>{data._count.sales}</span>
                <Button asChild variant={"link"}>
                  <Link href={`/sales?itemCode=${data.code}`}>View Sales</Link>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row justify-end w-full gap-3">
          <Button asChild variant={"outline"}>
            <Link href="/customers">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/customers/${data.code}/update`}>Update</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export { ItemDetail };
