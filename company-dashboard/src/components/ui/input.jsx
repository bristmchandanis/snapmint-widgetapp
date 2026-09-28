import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, as, multiline, rows, ...props }, ref) => {
  const isTextarea = multiline || type === 'textarea' || as === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <Component
      type={isTextarea ? undefined : type}
      rows={isTextarea ? (rows || 3) : undefined}
      className={cn(
        "flex w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:ring-0 disabled:opacity-100 disabled:bg-white disabled:text-gray-900 transition-all shadow-2xs",
        isTextarea ? "min-h-[75px] resize-y" : "h-10",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Textarea = React.forwardRef((props, ref) => (
  <Input ref={ref} type="textarea" {...props} />
))
Textarea.displayName = "Textarea"

export { Input, Textarea }
