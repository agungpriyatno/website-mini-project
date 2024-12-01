"use client";

import { customerFindMany } from "@/lib/server/actions/customer";
import { cn } from "@/lib/utils";
import { Customer } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type QueryCustomerProps = React.HTMLAttributes<HTMLDivElement> & {};

const QueryCustomer = ({  }: QueryCustomerProps) => {
  const router = useRouter();
  const [value, setValue] = useQueryState("customerId");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = React.useState<string>("");
  const queryFn = async () => {
    const resp = await customerFindMany({
      page: 1,
      limit: 20,
      search,
      searchField: "name",
      orderField: "name",
      orderType: "asc",
      startDate: null,
      endDate: null,
    });
    return resp.data;
  };

  const { data, refetch, isFetching, isRefetching } = useQuery({
    queryFn,
    queryKey: ["customerFindMany", search],
    initialData: [],
  });

  const onOpenChange = (val: boolean) => {
    if (val) refetch();
    setOpen(val);
  };

  const onSelected = async (data: Customer) => {
    await setValue(data.id);
    setOpen(false);
    router.refresh();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? data?.find((item) => item.id === value)?.name
            : "Select Customer"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} />
          <CommandList>
            <CommandEmpty>No Customer found.</CommandEmpty>
            {(isFetching || isRefetching) && <CommandLoading />}
            <CommandGroup>
              {(!isFetching || !isRefetching) &&
                data?.map((item) => (
                  <CommandItem
                    value={item.id}
                    key={item.id}
                    onSelect={() => {
                      onSelected(item);
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        item.id === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { QueryCustomer };

