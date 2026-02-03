import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  toggleClassName?: string;
  iconClassName?: string;
};

const PasswordField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  disabled,
  containerClassName,
  labelClassName,
  inputClassName,
  toggleClassName,
  iconClassName,
}: PasswordFieldProps<TFieldValues>) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", containerClassName)}>
          <FormLabel className={cn("text-base font-medium text-auth-ink", labelClassName)}>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={isVisible ? "text" : "password"}
                placeholder={placeholder}
                autoComplete={autoComplete}
                autoCorrect="off"
                spellCheck={false}
                disabled={disabled}
                className={cn("h-12 pr-12 text-base", inputClassName)}
                {...field}
              />
              <button
                type="button"
                onClick={() => setIsVisible((prev) => !prev)}
                className={cn(
                  "absolute inset-y-0 right-5 flex items-center text-muted-foreground transition hover:text-primary disabled:pointer-events-none disabled:opacity-50",
                  toggleClassName,
                )}
                aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={isVisible}
                disabled={disabled}
              >
                {isVisible ? (
                  <EyeOff className={cn("h-5 w-5", iconClassName)} />
                ) : (
                  <Eye className={cn("h-5 w-5", iconClassName)} />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
