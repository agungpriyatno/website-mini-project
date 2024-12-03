"use client";

import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
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
import { productFindMany } from "@/lib/server/actions/product";

type SelectItemProps = React.HTMLAttributes<HTMLDivElement> & {
  onSelected: (data: Product) => void;
  value: string;
};

const SelectItem = ({ onSelected, value }: SelectItemProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = React.useState<string>("");
  const queryFn = async () => {
    const resp = await productFindMany({
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
    queryKey: ["itemFindMany", search],
    initialData: [],
  });

  const onOpenChange = (val: boolean) => {
    if (val) refetch();
    setOpen(val);
  };

  const onSelect = (item: Product) => {
    onSelected(item);
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
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? data?.find((item) => item.code === value)?.name
              : "Select Item"}
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
                    value={item.code}
                    key={item.code}
                    onSelect={() => {
                    onSelect(item)
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        item.code === value ? "opacity-100" : "opacity-0"
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

export { SelectItem };
