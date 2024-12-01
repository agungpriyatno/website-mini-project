"use client";

import { cn } from "@/lib/utils";
import { saleUpdateReq, SaleUpdateReq } from "@/lib/validations/sale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item, Sale, SalesItem } from "@prisma/client";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SelectCustomer } from "./select-customer";
import { SelectItem } from "./select-item";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { saleItemDelete, saleUpdate } from "@/lib/server/actions/sale";
import { useMutation } from "@tanstack/react-query";

type TSaleItem = SalesItem & { item: Item };
type SaleUpdateProps = {
  data: Sale & {
    items: TSaleItem[];
  };
};

const SaleUpdate = ({ data }: SaleUpdateProps) => {
  const router = useRouter();
  const form = useForm<SaleUpdateReq>({
    resolver: zodResolver(saleUpdateReq),
    defaultValues: {
      customerId: data.customerId,
      totalPrice: data.totalPrice,
      items: data.items.map((item) => ({
        itemCode: item.itemCode,
        quantity: item.quantity,
        price: item.item.price,
        totalPrice: item.totalPrice,
      })),
    },
  });

  const { watch } = form;

  const { append, fields, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const items = watch("items");

  const onAppend = () => {
    append({
      price: BigInt(0),
      totalPrice: BigInt(0),
      itemCode: "",
      quantity: 1,
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await saleUpdate(data.id, values);
      toast.success("Sale created successfully");
      router.push("/sales");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      toast.error("Something went wrong");
    }
  });

  function formatPrice(price: bigint): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(price); // Assuming price is in cents
  }

  const onSetTotalPrice = () => {
    const total = items.reduce((acc, item) => acc + item.totalPrice, BigInt(0));
    form.setValue("totalPrice", total);
  };

  const { mutate } = useMutation({
    mutationFn: async (itemCode: string) => {
      await saleItemDelete(itemCode);
    },
    onSuccess: () => {
      toast.success("Item deleted successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Create</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              name={"customerId"}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Code</FormLabel>
                  <SelectCustomer field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4 border rounded space-y-4">
              <h3 className="text-lg font-semibold">Items</h3>
              {fields.map((item, i) => (
                <React.Fragment key={i}>
                  <FormField
                    control={form.control}
                    name={`items.${i}.itemCode`}
                    render={({ field }) => (
                      <div className="flex gap-3 w-full relative">
                        <FormItem className="flex-1 w-full">
                          <SelectItem
                            onSelected={(val) => {
                              field.onChange(val.code);
                              form.setValue(`items.${i}.price`, val.price);
                              form.setValue(
                                `items.${i}.totalPrice`,
                                val.price * BigInt(items[i].quantity)
                              );
                              onSetTotalPrice();
                            }}
                            value={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                        <Button
                          type="button"
                          onClick={() => {
                            const itemCode = data.items[i].itemCode;
                            if (itemCode) mutate(itemCode);
                            remove(fields.length - 1);
                            onSetTotalPrice();
                          }}
                          size={"icon"}
                          variant={"destructive"}
                          className="flex-shrink-0"
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    )}
                  />
                  <div
                    className={cn("grid grid-cols-2 gap-3", {
                      hidden: !items[i].itemCode,
                    })}
                  >
                    <FormField
                      control={form.control}
                      name={`items.${i}.quantity`}
                      key={item.id}
                      render={({ field: { onChange, value } }) => (
                        <FormItem className="flex-1">
                          <FormControl className="w-full flex">
                            <Input
                              min={0}
                              type="number"
                              className="w-full"
                              placeholder="Expired Time"
                              onChange={(e) => {
                                onChange(parseInt(e.target.value));
                                form.setValue(
                                  `items.${i}.totalPrice`,
                                  items[i].price * BigInt(e.target.value ?? 0)
                                );
                                onSetTotalPrice();
                              }}
                              value={value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 place-items-center">
                      <p className="flex-1 text-end">
                        {formatPrice(form.getValues("items")[i].price ?? 0)}
                      </p>
                      <p className="flex-1 text-end">
                        {formatPrice(items[i].totalPrice ?? 0)}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <div className="flex w-full gap-3 place-items-center">
                <div className=" h-10 w-full bg-muted rounded"></div>
                <Button
                  type="button"
                  onClick={onAppend}
                  size={"icon"}
                  variant={"outline"}
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
            <div className="flex gap-3 place-items-center">
              <p className="flex-1 text-start">
                <b>Total </b> {formatPrice(form.getValues("totalPrice") ?? 0)}
              </p>
            </div>
            <div className="flex justify-end w-full gap-2">
              <Button
                type="button"
                variant={"destructive"}
                onClick={router.back}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { SaleUpdate };
