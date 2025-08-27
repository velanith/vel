import { useId, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "./command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Label } from "./label";

// contract
type Option = {
  value: string;
  label: string;
};

interface CreatableComboboxProps {
  options: Option[];
  value?: string; // selected value
  onChange: (value: string) => void; // available value
  onCreate: (value: string) => void; // trigger to create new option
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
}

export function CreatableCombobox({
  options,
  value,
  onChange,
  onCreate,
  placeholder = "Select an option",
  className,
  label,
  labelClassName,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const comboboxId = useId();

  const handleCreate = () => {
    if (inputValue.trim() === "") return;
    onCreate(inputValue);
    setInputValue("");
    setOpen(false);
  };

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <Label htmlFor={comboboxId} className={cn("text-sm", labelClassName)}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={comboboxId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[10vw] justify-between", className)}
          >
            <span className="truncate">
              {value ? selectedLabel : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search option..."
              value={inputValue}
              onValueChange={setInputValue}
              className="p-0 h-auto text-sm"
            />
            <CommandList>
              <CommandEmpty>
                <div className="p2 text-sm text-center">
                  Can't found{" "}
                  <span className="font-bold text-blue-500">{inputValue}</span>{" "}
                  <br />
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-blue-500"
                    onClick={handleCreate}
                  >
                    Create new option
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
