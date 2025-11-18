"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number | string;
  onChange?: (value: number) => void;
  placeholder?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    { className, value = 0, onChange, placeholder = "R$ 0,00", ...props },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState("");

    const ensureNumber = (val: number | string | undefined): number => {
      if (typeof val === "number" && !isNaN(val)) return val;
      if (typeof val === "string") {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(value);
    };

    const parseCurrency = (value: string): number => {
      const numericValue = value.replace(/\D/g, "");
      return numericValue ? parseInt(numericValue) / 100 : 0;
    };

    React.useEffect(() => {
      const numericValue = ensureNumber(value);
      setDisplayValue(formatCurrency(numericValue));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseCurrency(inputValue);

      setDisplayValue(formatCurrency(numericValue));

      onChange?.(numericValue);
    };

    const handleFocus = () => {
      const numericValue = ensureNumber(value);
      if (numericValue > 0) {
        setDisplayValue(numericValue.toFixed(2).replace(".", ","));
      }
    };

    const handleBlur = () => {
      const numericValue = parseCurrency(displayValue);
      setDisplayValue(formatCurrency(numericValue));
      onChange?.(numericValue);
    };

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
