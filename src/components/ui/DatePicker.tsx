"use client";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { Calendar } from "lucide-react";
import { format, parse } from "date-fns";

interface DatePickerProps {
  value?: Date | null | undefined; // Make value optional and allow undefined
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) => {
  // Handle undefined value as null
  const dateValue = value ?? null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onChange(null);

      return;
    }

    // Parse the date and set it to noon to avoid timezone issues
    const date = parse(e.target.value, "yyyy-MM-dd", new Date());

    date.setHours(12, 0, 0, 0);
    onChange(date);
  };

  // Format the date for the input value, using UTC to avoid timezone shift
  const inputValue = dateValue
    ? format(
        new Date(dateValue.getTime() + dateValue.getTimezoneOffset() * 60000),
        "yyyy-MM-dd",
      )
    : "";

  return (
    <div className={className} data-testid="datepicker-container">
      {label && (
        <label className="block text-small font-medium mb-1.5">{label}</label>
      )}
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            aria-label={placeholder}
            className="w-full justify-start gap-2"
            color="default"
            variant="bordered"
          >
            <Calendar className="h-4 w-4" />
            {dateValue ? format(dateValue, "yyyy-MM-dd") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <input
            aria-label="Date input"
            className="w-full p-2 rounded-lg border border-default-200 bg-default-100"
            role="textbox"
            type="date"
            value={inputValue}
            onChange={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
