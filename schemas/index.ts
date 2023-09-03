import * as z from "zod";

export const billboardFormSchema = z.object({
  label: z.string().nonempty(),
  imageUrl: z.string().nonempty(),
});

export type BillboardFormValues = z.infer<typeof billboardFormSchema>;

export const settingsFormSchema = z.object({
  name: z.string().nonempty(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const storeModalSchema = z.object({
  name: z.string().nonempty(),
});

export type StoreModalValues = z.infer<typeof storeModalSchema>;

export const categoryFormSchema = z.object({
  name: z.string().nonempty(),
  billboardId: z.string().nonempty(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const sizesFormSchema = z.object({
  name: z.string().nonempty(),
  value: z.string().nonempty(),
});

export type SizesFormValues = z.infer<typeof sizesFormSchema>;

export const colorsFormSchema = z.object({
  name: z.string().nonempty(),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
});

export type ColorsFormValues = z.infer<typeof colorsFormSchema>;

export const productFormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().nonempty(),
  colorId: z.string().nonempty(),
  sizeId: z.string().nonempty(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
