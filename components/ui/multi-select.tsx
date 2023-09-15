"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";

type DataItem = Record<"value" | "label" | "id", string>;

type MultiSelectProps = {
  label?: string;
  placeholder?: string;
  data?: DataItem[];
  handleSelect: (value: DataItem[]) => void;
  defaultValues?: DataItem[];
};
const MultiSelect = ({
  label = "Select an item",
  placeholder = "Select an item",
  data,
  handleSelect,
  defaultValues,
}: MultiSelectProps) => {
  // const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<DataItem[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (defaultValues) {
      setSelected(defaultValues);
      handleSelect(defaultValues);
    }
  }, []);

  const handleUnselect = React.useCallback((item: DataItem) => {
    setSelected((prev) => prev.filter((s) => s.value !== item.value));
  }, []);

  // const handleKeyDown = React.useCallback(
  //   (e: React.KeyboardEvent<HTMLDivElement>) => {
  //     // const input = inputRef.current;
  //     if (input) {
  //       if (e.key === "Delete" || e.key === "Backspace") {
  //         if (input.value === "") {
  //           setSelected((prev) => {
  //             const newSelected = [...prev];
  //             newSelected.pop();
  //             return newSelected;
  //           });
  //         }
  //       }
  //       // This is not a default behaviour of the <input /> field
  //       if (e.key === "Escape") {
  //         input.blur();
  //       }
  //     }
  //   },
  //   []
  // );

  const addOrRemoveToSelected = React.useCallback(
    ({ label, value, id }: DataItem) => {
      return setSelected((prevSelected) => {
        const isItemUnique = !prevSelected.some(
          (item) => item.id === id && item.label === label
        );

        if (isItemUnique) {
          return [...prevSelected, { label, value, id }];
        }
        // otherwise, we remove the item from the list
        return prevSelected.filter((item) => item.value !== value);
      });
    },
    []
  );

  const selectables = data?.length
    ? data?.filter((item) => !selected.includes(item))
    : [];

  return (
    <div className={cn("grid w-full items-center", label && "gap-1.5")}>
      {label && (
        <Label className="text-white text-sm font-bold py-1">{label}</Label>
      )}

      <Command className="overflow-visible bg-transparent">
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex gap-1 flex-wrap">
            {selected.map((item, index) => {
              if (index > 1) return;
              return (
                <Badge key={item.value} variant="secondary">
                  {item.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            {selected.length > 2 && <p>{`+${selected.length - 2} more`}</p>}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 cursor-pointer"
            />

            <ChevronsUpDown
              className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(_) => {
                        setInputValue("");
                        addOrRemoveToSelected(item);
                        handleSelect([...selected, item]);
                      }}
                    >
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selected.find((s) => s.value === item.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  );
};

export default MultiSelect;
