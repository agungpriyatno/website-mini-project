"use client";

import { itemFindMany } from "@/lib/server/actions/item";
import { cn } from "@/lib/utils";
import { Item } from "@prisma/client";
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

type QueryItemProps = React.HTMLAttributes<HTMLDivElement> & {};

const QueryItem = ({  }: QueryItemProps) => {
  const router = useRouter();
  const [value, setValue] = useQueryState("itemCode");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = React.useState<string>("");
  const queryFn = async () => {
    const resp = await itemFindMany({
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
    queryKey: ["query-find", search],
    initialData: [],
  });

  const onOpenChange = (val: boolean) => {
    if (val) refetch();
    setOpen(val);
  };

  const onSelected = async (data: Item) => {
    await setValue(data.code);
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
            ? data?.find((item) => item.code === value)?.name
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
                data?.map((item, i) => (
                  <CommandItem
                    value={item.code}
                    key={i}
                    onSelect={() => {
                      onSelected(item);
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

export { QueryItem };

