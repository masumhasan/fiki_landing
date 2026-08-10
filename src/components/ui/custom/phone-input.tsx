"use client";

import * as React from "react";
import ReactPhoneInput, { Props as ReactPhoneInputProps } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PhoneInputProps = Omit<ReactPhoneInputProps<any>, "value" | "onChange"> & {
  value?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
};

const PhoneInput = React.forwardRef<React.ElementRef<typeof ReactPhoneInput>, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <ReactPhoneInput
        ref={ref}
        value={value}
        onChange={onChange || (() => {})}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:ring-3 focus-within:ring-ring/50 outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // The following overrides standard react-phone-number-input styles
          "[&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:focus-visible:ring-0 [&_.PhoneInputInput]:ml-2 [&_.PhoneInputInput]:w-full",
          className
        )}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
