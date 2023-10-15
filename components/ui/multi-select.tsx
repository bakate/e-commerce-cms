import { ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";

type DataItem = Record<"value" | "label" | "id", string>;

interface MultiSelectProps {
  className?: string;
  items: DataItem[];
  defaultValue: DataItem[];
  onChange: (items: DataItem[]) => void;
  label: string;
}

const MultiSelect = ({
  className,
  items,
  onChange,
  label,
  defaultValue,
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<
    { value: string; label: string; id: string }[]
  >(defaultValue ?? []);

  const onSelect = (item: DataItem) => {
    const index = selectedItems.findIndex((s) => s.value === item.value);
    if (index !== -1) {
      setSelectedItems((prev) => {
        const next = [...prev];
        next.splice(index, 1);
        onChange(next);
        return next;
      });

      setOpen(false);
    } else {
      setSelectedItems((prev) => {
        const newSelected = [...prev, item];
        onChange(newSelected);
        return newSelected;
      });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select one or more items"
          className={cn(
            "flex h-10 w-full  justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {selectedItems.map((item, index) => {
            if (index < 2) {
              return (
                <Badge
                  key={item.value}
                  className="mr-1 flex items-center"
                  onClick={() => onSelect(item)}
                >
                  {item.label}
                  <X className="ml-1 h-4 w-4" />
                </Badge>
              );
            }
          })}
          {selectedItems.length > 2 && (
            <Badge
              className="mr-1 flex items-center"
              onClick={() =>
                setSelectedItems((prev) => {
                  const next = [...prev];
                  next.splice(2, next.length - 2);
                  onChange(next);
                  return next;
                })
              }
            >
              {selectedItems.length - 2} more {label}
              <X className="ml-1 h-4 w-4" />
            </Badge>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup heading="Items">
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onSelect(item)}
                  className="text-sm"
                >
                  <Checkbox
                    className="mr-2"
                    checked={selectedItems.some((s) => s.value === item.value)}
                    onChange={() => onSelect(item)}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
