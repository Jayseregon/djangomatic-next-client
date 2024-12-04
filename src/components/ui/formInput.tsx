import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { CircleMinus, Copy } from "lucide-react";

import {
  FormInputProps,
  LabelInputProps,
  AntennaFormInputProps,
  NoteInputProps,
} from "@/interfaces/reports";
import { cn } from "@/src/lib/utils";

import CustomTooltip from "./CustomTooltip";

export const FormInput: React.FC<FormInputProps> = ({
  value,
  name,
  label,
  placeholder,
  type = "text",
  onChange,
  isRounded = true,
  withTooltip = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-1">
      {label && (
        <p className="text-ellipsis overflow-hidden text-primary text-sm">
          {label}
        </p>
      )}
      {withTooltip ? (
        <CustomTooltip content={value}>
          <div
            className={`border-2 border-primary ${isRounded && "rounded-3xl"} w-full flex items-center justify-center`}
          >
            <input
              required
              className="border-0 focus:ring-0 focus:ring-inset text-foreground bg-transparent text-center text-ellipsis overflow-hidden"
              id={name}
              name={name}
              placeholder={placeholder || undefined}
              step={type === "number" ? "0.01" : undefined}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>
        </CustomTooltip>
      ) : (
        <div
          className={`border-2 border-primary ${isRounded && "rounded-3xl"} w-full flex items-center justify-center`}
        >
          <input
            required
            className="border-0 focus:ring-0 focus:ring-inset text-foreground bg-transparent text-center text-ellipsis overflow-hidden"
            id={name}
            name={name}
            placeholder={placeholder || undefined}
            step={type === "number" ? "0.01" : undefined}
            type={type}
            value={value}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
};

export const NoteInput: React.FC<NoteInputProps> = ({
  id,
  value,
  onChange,
}) => {
  return (
    <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
      <input
        required
        className="border-0 w-full focus:ring-0 focus:ring-inset text-foreground bg-transparent text-left text-ellipsis overflow-hidden"
        id={id}
        name={id}
        placeholder="..."
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const AntennaFormInput = ({
  value,
  name,
  width,
  placeholder,
  onChange,
}: AntennaFormInputProps) => {
  return (
    <div className={`relative ${width}`}>
      <input
        required
        className="border-0 border-b-2 border-primary w-full focus:ring-0 focus:ring-inset text-foreground bg-transparent text-center text-ellipsis overflow-hidden"
        id={name}
        name={name}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export const DisplayInput = ({
  value,
  width,
}: {
  value: string;
  width?: string;
}) => {
  return (
    <div
      className={`border-2 h-10 border-primary/50 text-foreground/50 rounded-3xl ${width ? width : "w-1/2"} text-nowrap flex items-center justify-left ps-5`}
    >
      <p className="text-ellipsis overflow-hidden">{value}</p>
    </div>
  );
};

export const DisplayInputWithTooltip = ({
  value,
  width,
}: {
  value: string;
  width?: string;
}) => {
  return (
    <Tooltip
      key={value}
      color="primary"
      content={value}
      offset={-7}
      placement="top"
    >
      <div
        className={`border-2 h-10 border-primary/50 text-foreground/50 rounded-3xl ${
          width ? width : "w-1/2"
        } max-w-xs overflow-hidden flex items-center ps-5`}
      >
        <p className="text-ellipsis whitespace-nowrap overflow-hidden">
          {value}
        </p>
      </div>
    </Tooltip>
  );
};

export const FormSectionTitle = ({ title }: { title: string }) => {
  return (
    <div className=" pt-8 pb-3">
      <p className="border-4 rounded-xl border-emerald-700 dark:border-emerald-400 border-double text-emerald-700 dark:text-emerald-400 uppercase font-semibold text-xl py-1">
        {title}
      </p>
    </div>
  );
};

export const LabelInput = ({
  value,
  name,
  placeholder,
  options,
  onChange,
}: LabelInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
      <input
        required
        className="border-0 focus:ring-0 focus:ring-inset text-foreground bg-transparent text-center w-full"
        id={name}
        list={`${name}-datalist`}
        name={name}
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <datalist id={`${name}-datalist`}>
        {options.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    </div>
  );
};

export const TrashButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => {
  return (
    <Button
      isIconOnly
      className={className}
      color="danger"
      radius="full"
      variant="light"
      onClick={onClick}
    >
      <CircleMinus />
    </Button>
  );
};

export const CopyButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => {
  return (
    <Button
      isIconOnly
      className={className}
      color="primary"
      radius="full"
      variant="light"
      onClick={onClick}
    >
      <Copy />
    </Button>
  );
};

export const AddButton = ({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) => {
  return (
    <Button
      className={cn(
        "mt-4 max-w-[30vw] mx-auto border-indigo-700 dark:border-indigo-300 text-indigo-700 dark:text-indigo-300",
        className,
      )}
      radius="lg"
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
