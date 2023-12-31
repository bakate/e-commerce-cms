"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { SizesFormValues, sizesFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type SizeFormProps = {
  initialData: Size | null;
};

const SizesForm = ({ initialData }: SizeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const title = initialData ? "Edit Size" : "New Size";
  const description = initialData ? "Edit a size" : "Create a new size";
  const toastMessage = initialData
    ? "Size successfully updated."
    : "Size successfully created.";
  const action = initialData ? "Save changes" : "Create a size";

  const form = useForm<SizesFormValues>({
    resolver: zodResolver(sizesFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      value: initialData?.value ?? "",
    },
  });

  const onSubmit = async (values: SizesFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }

      toast({
        title: toastMessage,
      });
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
    } catch (error) {
      // show an error toast
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",

        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({
        title: "Size successfully deleted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Make sure you removed all products using this size first.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData ? (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="size name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} placeholder="size" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="button"
            disabled={loading}
            variant={"outline"}
            className="mr-4"
            onClick={router.back}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="ml-auto">
            {action}
          </Button>
          <Separator />
        </form>
      </Form>
    </>
  );
};

export default SizesForm;
