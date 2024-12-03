"use client";

import { customerFindMany } from "@/lib/server/actions/customer";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { FormControl } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CommandLoading } from "cmdk";
import { Customer } from "@prisma/client";
import { OrderCreateReq } from "@/lib/validations/order";

type SelectCustomerProps = React.HTMLAttributes<HTMLDivElement> & {
  field: ControllerRenderProps<OrderCreateReq>;
};

const SelectCustomer = ({ field }: SelectCustomerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = React.useState<string>("");
  const queryFn = async () => {
    const resp = await customerFindMany({
      page: 1,
      limit: 50,
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

  const onSelect = (item: Customer) => {
    field.onChange(item.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? data?.find((item) => item.id === field.value)?.name
              : "Select Customer"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
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
                      onSelect(item);
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        item.id === field.value ? "opacity-100" : "opacity-0"
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

export { SelectCustomer };
