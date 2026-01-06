import * as React from "react";
import clsx from "clsx";
import { Check, Minus } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onCheckedChange, disabled, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative inline-flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        
        {/* Icon Check (Hiện khi checked) */}
        <Check 
          size={14} 
          strokeWidth={3}
          className={clsx(
            "absolute text-white pointer-events-none opacity-0 transition-opacity peer-checked:opacity-100",
            indeterminate ? "hidden" : "block"
          )} 
        />

        {/* Icon Minus (Hiện khi indeterminate - chọn 1 nửa) */}
        <Minus 
          size={14} 
          strokeWidth={3}
          className={clsx(
            "absolute text-white pointer-events-none hidden",
            // Hack css: nếu indeterminate thì hiện cái này đè lên
            indeterminate && "!block bg-blue-600 w-full h-full rounded flex items-center justify-center"
          )} 
        />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";