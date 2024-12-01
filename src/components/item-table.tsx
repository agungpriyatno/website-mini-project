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

import { ItemFindManyRes } from "@/lib/validations/item";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { ItemDelete } from "./item-delete";
import { QueryDateRange } from "./query-date-range";
import { QueryOrder } from "./query-order";
import { QuerySearch } from "./query-search";
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

type ItemTableProps = {
  totalPages: number;
  data: ItemFindManyRes[];
};

const options = [
  { value: "code", label: "Code" },
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
];

const orderOptions = [
  { value: "code", label: "Code" },
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "price", label: "Price" },
  { value: "createdAt", label: "Created At" },
];

const ItemTable = ({ data, totalPages }: ItemTableProps) => {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );

  const onReset = () => {
    router.push("/items");
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

  function formatPrice(price: bigint): string {
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
        <CardTitle>Item Table</CardTitle>
        <Button>
          <Link href="/items/create">Create</Link>
        </Button>
      </CardHeader>
      <CardHeader className="space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <QuerySearch className="col-span-4" options={options} value="name" />
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales Total</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.code}>
                <TableCell>
                  {page * limit - limit + data.indexOf(item) + 1}
                </TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell className="flex place-items-center gap-2">
                  <span>{item._count.sales}</span>
                  <Button asChild variant={"link"}>
                    <Link href={`/sales?itemCode=${item.code}`}>View</Link>
                  </Button>
                </TableCell>
                <TableCell>{item.createdAt.toDateString()}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button asChild size="icon">
                    <Link href={`/items/${item.code}`}>
                      <InfoIcon />
                    </Link>
                  </Button>
                  <Button asChild size="icon">
                    <Link href={`/items/${item.code}/update`}>
                      <PenIcon />
                    </Link>
                  </Button>
                  <ItemDelete id={item.code} />
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

export { ItemTable };

