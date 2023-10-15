"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  sizes: { label: string; value: string; id: string }[];
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
  description: string;
  inventory: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
  },

  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.sizes.map((size) => size.label).join(", ")}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
