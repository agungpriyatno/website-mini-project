"use client";

import { productDelete } from "@/lib/server/actions/product";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type ProductDeleteProps = {
  id: string;
};

const ProductDelete = ({ id }: ProductDeleteProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const mutationFn = async () => {
    return await productDelete(id);
  };
  
  const { mutate, isPending } = useMutation({
    mutationFn,
    mutationKey: ["ProductDelete", id],
    onSuccess: () => {
      toast.success("Item deleted successfully");
      setOpen(false);
      router.refresh();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={() => mutate()}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ProductDelete };

