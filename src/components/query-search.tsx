"use client";

import { cn } from "@/lib/utils";
import { parseAsString, useQueryState } from "nuqs";
import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";

type QuerySearchProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  options?: { label: string; value: string }[];
};
const QuerySearch = ({ className, value, options }: QuerySearchProps) => {
  const router = useRouter();
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [searchField, setSearchField] = useQueryState(
    "searchField",
    parseAsString.withDefault(value ?? "name")
  );

  const onSetSearch = async (value: string) => {
    await setSearch(value);
    router.refresh();
  };

  const onSetSearchField = async (value: string) => {
    await setSearchField(value);
  };

  return (
    <div className={cn("grid grid-cols-4 gap-3", className)}>
      <Select value={searchField} onValueChange={onSetSearchField}>
        <SelectTrigger className="col-span-1">
          <SelectValue placeholder="Search Field" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Search Field</SelectLabel>
            {options?.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        className="col-span-3"
        placeholder="Search"
        value={search ?? ""}
        onChange={(e) => onSetSearch(e.target.value)}
      />
    </div>
  );
};

export { QuerySearch };
