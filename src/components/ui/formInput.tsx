import React, { useState, useEffect } from "react";

interface FormInputProps {
  value: string | undefined;
  name: string;
  label: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface LabelInputProps {
  value: string | undefined;
  name: string;
  placeholder: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = ({
  value,
  name,
  label,
  placeholder,
  onChange,
}: FormInputProps) => {
  return (
    <div className="grid grid-cols-1 gap-1">
      <p className="text-ellipsis overflow-hidden text-primary text-sm">{label}</p>
      <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
        <input
          required
          className="border-0 focus:ring-0 focus:ring-inset text-foreground bg-transparent text-center text-ellipsis overflow-hidden"
          id={name}
          name={name}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export const DisplayInput = ({ value }: { value: string }) => {
  return (
    <div className="border-2 h-10 border-primary/50 text-foreground/50 rounded-3xl w-1/2 text-nowrap flex items-center justify-left ps-5">
      <p className="text-ellipsis overflow-hidden">{value}</p>
    </div>
  );
};

export const FormSectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="mx-20 pt-8 pb-3">
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
