import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({ value, onValueChange, variant = "underline", children, className }) {
  return (
    <div className={cn("w-full space-y-6", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { 
          activeValue: value, 
          onValueChange, 
          variant: child.props.variant || variant 
        });
      })}
    </div>
  );
}

export function TabsList({ className, children, activeValue, onValueChange, variant = "underline" }) {
  const childCount = React.Children.count(children);
  const isPills = variant === "pills" || variant === "card";

  const gridColsClass = 
    childCount === 2 ? 'grid-cols-2' : 
    childCount === 3 ? 'grid-cols-3' : 
    childCount === 4 ? 'grid-cols-4' : 
    'grid-flow-col auto-cols-fr';

  return (
    <div
      className={cn(
        "w-full grid mb-6",
        gridColsClass,
        isPills
          ? "p-1 rounded-xl bg-gray-100/80 border border-gray-200/80 gap-1"
          : "border-b border-gray-200 bg-transparent",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { 
          activeValue, 
          onValueChange, 
          variant: child.props.variant || variant 
        });
      })}
    </div>
  );
}

export function TabsTrigger({ value, activeValue, onValueChange, variant = "underline", className, children, disabled }) {
  const isActive = activeValue === value;
  const isPills = variant === "pills" || variant === "card";

  const baseStyles = isPills
    ? "py-2 px-3 text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2"
    : "pb-3 pt-2 text-xs sm:text-sm border-b-2 -mb-px flex items-center justify-center gap-2";

  const stateStyles = isPills
    ? isActive
      ? "bg-white text-gray-900 shadow-2xs border border-gray-200 font-bold"
      : "text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent font-semibold"
    : isActive
      ? "border-gray-900 text-gray-900 font-bold"
      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 font-semibold";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onValueChange && onValueChange(value)}
      className={cn(
        "w-full text-center transition-all cursor-pointer select-none outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        baseStyles,
        stateStyles,
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeValue, className, children }) {
  if (value !== activeValue) return null;
  return <div className={cn("outline-none animate-in fade-in-50 duration-150", className)}>{children}</div>;
}


