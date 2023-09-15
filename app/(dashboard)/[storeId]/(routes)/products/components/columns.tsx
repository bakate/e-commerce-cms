"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  sizes: { label: string; value: string; id: string }[];
  colors: { label: string; value: string; id: string }[];
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
  description: string;
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
    accessorKey: "sizes",
    header: "Sizes",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {row.original.sizes.map((size) => (
            <div key={size.value} className="rounded-full border">
              <div className="px-2 py-1">{size.label}</div>
            </div>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "colors",
    header: "Colors",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colors.map((color) => (
          <div
            key={color.value}
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: color.value }}
          />
        ))}
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
