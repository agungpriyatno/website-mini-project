"use client";

import { itemUpdate } from "@/lib/server/actions/item";
import { ItemUpdateReq, itemUpdateReq } from "@/lib/validations/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

type ItemUpdateProps = {
  data: Item;
};

const ItemUpdate = ({ data }: ItemUpdateProps) => {
  const router = useRouter();
  const form = useForm<ItemUpdateReq>({
    resolver: zodResolver(itemUpdateReq),
    defaultValues: {
      code: data.code,
      name: data.name,
      category: data.category ?? "",
      price: data.price,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await itemUpdate(data.code, values);
      toast.success("Customer Updated successfully");
      router.push("/items");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Update</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              name={"code"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="NameCode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"name"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"category"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"price"}
              control={form.control}
              render={({ field: {value, ...field} }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                  <Input type="number" placeholder="Price" value={value.toString()} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export { ItemUpdate };
