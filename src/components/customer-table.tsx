"use client";

import { CustomerFindManyRes } from "@/lib/validations/customer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  InfoIcon,
  PenIcon,
} from "lucide-react";
import Link from "next/link";
import { CustomerDelete } from "./customer-delete";
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

import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
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

type CustomerTableProps = {
  totalPages: number;
  data: CustomerFindManyRes[];
};

const options = [
  { value: "name", label: "Name" },
  { value: "addres", label: "Address" },
  { value: "gender", label: "Gender" },
];

const orderOptions = [
  { value: "name", label: "Name" },
  { value: "addres", label: "Address" },
  { value: "gender", label: "Gender" },
  { value: "createdAt", label: "Created At" },
];

const CustomerTable = ({ data, totalPages }: CustomerTableProps) => {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );

  const onReset = () => {
    router.push("/customers");
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Table</CardTitle>
        <Button>
          <Link href="/customers/create">Create</Link>
        </Button>
      </CardHeader>
      <CardHeader className="space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <QuerySearch className="col-span-4" options={options} value="name" />
          <QueryOrder className="col-span-2" options={orderOptions} value="createdAt" />
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
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Sales Total</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{page * limit - limit + data.indexOf(item) + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell className="flex place-items-center gap-2">
                  <span>{item._count.sales}</span>
                  <Button asChild variant={"link"}>
                    <Link href={`/order?customerId=${item.id}`}>View</Link>
                  </Button>
                </TableCell>
                <TableCell>{item.createdAt.toDateString()}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button asChild size="icon">
                    <Link href={`/customers/${item.id}`}>
                      <InfoIcon />
                    </Link>
                  </Button>
                  <Button asChild size="icon">
                    <Link href={`/customers/${item.id}/update`}>
                      <PenIcon />
                    </Link>
                  </Button>
                  <CustomerDelete id={item.id} />
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

export { CustomerTable };
