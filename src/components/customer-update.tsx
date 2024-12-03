"use client";

import { customerUpdate } from "@/lib/server/actions/customer";
import { customerUpdateReq } from "@/lib/validations/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type CustomerUpdateProps = {
  data: Customer;
};

const CustomerUpdate = ({ data }: CustomerUpdateProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(customerUpdateReq),
    defaultValues: data,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await customerUpdate(data.id, {
        name: values.name,
        address: values.address,
        gender: values.gender as "MALE" | "FEMALE",
      });
      toast.success("Customer Updated successfully");
      router.push("/customers");
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
              name={"address"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
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

export { CustomerUpdate };
