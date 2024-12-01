"use client";

import { Customer } from "@prisma/client";
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

type CustomerDetailProps = {
  data: Customer & {
    _count: {
      sales: number;
    };
  };
};

const CustomerDetail = ({ data }: CustomerDetailProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ID</TableCell>
              <TableCell>{data.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell>{data.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Domicile</TableCell>
              <TableCell>{data.domicile}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Gender</TableCell>
              <TableCell>{data.gender}</TableCell>
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
                  <Link href={`/sales?customerId=${data.id}`}>View Sales</Link>
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
            <Link href={`/customers/${data.id}/update`}>Update</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export { CustomerDetail };

