import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-none disabled:opacity-100 disabled:bg-white disabled:text-gray-900 cursor-pointer transition-all gap-1.5 min-w-0 overflow-hidden",
      className,
      "focus:outline-none focus:ring-0 focus:border-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-200 outline-none ring-0 data-[state=open]:border-gray-200 data-[state=open]:ring-0"
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0 text-gray-500" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-200 max-h-96 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-xl p-1 animate-in fade-in-50 zoom-in-95",
        position === "popper" && "min-w-[var(--radix-select-trigger-width)] w-auto translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="w-full p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:bg-gray-100 focus:text-gray-900 disabled:opacity-50 transition-colors whitespace-nowrap",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
