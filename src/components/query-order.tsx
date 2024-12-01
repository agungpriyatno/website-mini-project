"use client";

import { cn } from "@/lib/utils";
import { parseAsString, useQueryState } from "nuqs";
import React from "react";
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

type QueryOrderProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  options?: { label: string; value: string }[];
};
const QueryOrder = ({ className, value, options }: QueryOrderProps) => {
  const router = useRouter();
  const [orderType, setOrderType] = useQueryState(
    "orderType",
    parseAsString.withDefault("asc")
  );
  const [orderField, setOrderField] = useQueryState(
    "orderField",
    parseAsString.withDefault(value ?? "createdAt")
  );

  const onSetOrderType =async (value: string) => {
    await setOrderType(value);
    router.refresh();
  };
  
  const onSetOrderField = async (value: string) => {
    await setOrderField(value);
    router.refresh();

  };

  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <Select value={orderField} onValueChange={onSetOrderField}>
        <SelectTrigger>
          <SelectValue placeholder="Search Field" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order Field</SelectLabel>
            {options?.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={orderType} onValueChange={onSetOrderType}>
        <SelectTrigger>
          <SelectValue placeholder="Search Field" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order Type</SelectLabel>
            <SelectItem value={"asc"}>Ascending</SelectItem>
            <SelectItem value={"desc"}>Descending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export { QueryOrder };

