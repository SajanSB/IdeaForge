import * as React from "react"
import { cn } from "@/utils/cn"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div className={cn(
          "w-9 h-5 bg-gray-200 rounded-full transition-colors duration-200",
          "peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-offset-1 peer-focus:ring-[#BA7517]",
          "peer-checked:bg-[#BA7517]",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-200",
          "peer-checked:after:translate-x-full peer-checked:after:border-white",
          className
        )} />
      </label>
    )
  }
)
Switch.displayName = "Switch"
