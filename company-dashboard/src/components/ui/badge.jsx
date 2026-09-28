import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-0 px-3 py-1 text-xs font-semibold h-7 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white",
        secondary: "bg-gray-100 text-gray-700",
        destructive: "bg-rose-50 text-rose-700",
        outline: "border border-gray-200 text-gray-700",
        installed: "bg-emerald-50 text-emerald-700",
        uninstalled: "bg-rose-50 text-rose-700",
        approved: "bg-emerald-50 text-emerald-700",
        pending: "bg-amber-50 text-amber-800",
        enabled: "bg-blue-50 text-blue-700",
        disabled: "bg-gray-100 text-gray-600",
        active: "bg-emerald-50 text-emerald-700",
        expired: "bg-rose-50 text-rose-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
