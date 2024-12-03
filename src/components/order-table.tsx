"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  InfoIcon,
  PenIcon,
} from "lucide-react";
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


import { OrderFindManyRes } from "@/lib/validations/order";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { OrderDelete } from "./order-delete";
import { QueryCustomer } from "./query-customer";
import { QueryDateRange } from "./query-date-range";
import { QueryItem } from "./query-item";
import { QueryOrder } from "./query-order";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type OrderTableProps = {
  totalPages: number;
  data: OrderFindManyRes[];
};


const orderOptions = [
  { value: "customer.name", label: "Customer Name" },
  { value: "totalPrice", label: "Total Price" },
  { value: "createdAt", label: "Created At" },
];

const OrderTable = ({ data, totalPages }: OrderTableProps) => {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );

  const onReset = () => {
    router.push("/sales");
  };

  const onPageChange = async (page: number) => {
    await setPage(page);
    router.refresh();
  };

  const onLimitChange = async (limit: string) => {
    await setPage(1);
    await setLimit(Number(limit));
    router.refresh();
  };

  function formatPrice(price: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(price); // Assuming price is in cents
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order Table</CardTitle>
        <Button>
          <Link href="/order/create">Create</Link>
        </Button>
      </CardHeader>
      <CardHeader className="space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <QueryCustomer />
          <QueryItem />
          <QueryOrder
            className="col-span-2"
            options={orderOptions}
            value="createdAt"
          />
          <QueryDateRange />
        </div>
        <div className="w-full flex justify-end gap-3">
          <Button onClick={onReset}>Reset Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          {data.length === 0 && <TableCaption>No data found.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {page * limit - limit + data.indexOf(item) + 1}
                </TableCell>
                <TableCell>{item.customer.name}</TableCell>
                <TableCell className="flex place-items-center gap-2">
                  <span>{item._count.orders}</span>
                  <Button asChild variant={"link"}>
                    View
                  </Button>
                </TableCell>
                <TableCell>{item.createdAt.toDateString()}</TableCell>
                <TableCell className="text-right">
                  {formatPrice(item.totalPrice)}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button asChild size="icon">
                    <Link href={`/order/${item.id}`}>
                      <InfoIcon />
                    </Link>
                  </Button>
                  <Button asChild size="icon">
                    <Link href={`/order/${item.id}/update`}>
                      <PenIcon />
                    </Link>
                  </Button>
                  <OrderDelete id={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>Total data {totalPages * limit}</TableCaption>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size={"icon"}
                variant={"ghost"}
                disabled={page === 1}
                onClick={() => onPageChange(1)}
              >
                <ChevronsLeftIcon />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size={"icon"}
                variant={"ghost"}
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeftIcon />
              </Button>
            </PaginationItem>
            <PaginationItem>
              {page}/{totalPages}
            </PaginationItem>
            <PaginationItem>
              <Select value={limit.toString()} onValueChange={onLimitChange}>
                <SelectTrigger className="w-[60px]">
                  <SelectValue placeholder="Search Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Order Field</SelectLabel>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </PaginationItem>
            <PaginationItem>
              <Button
                size={"icon"}
                variant={"ghost"}
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronRightIcon />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size={"icon"}
                variant={"ghost"}
                disabled={page >= totalPages}
                onClick={() => onPageChange(totalPages)}
              >
                <ChevronsRightIcon />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

export { OrderTable };

