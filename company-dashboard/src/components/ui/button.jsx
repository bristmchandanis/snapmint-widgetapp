import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white shadow-2xs hover:bg-gray-800",
        destructive: "bg-rose-600 text-white shadow-2xs hover:bg-rose-700",
        outline: "border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 text-gray-700",
        link: "text-indigo-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3.5 py-1.5",
        sm: "h-7.5 rounded-md px-3 text-xs",
        lg: "h-9.5 rounded-md px-5 text-xs",
        icon: "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
