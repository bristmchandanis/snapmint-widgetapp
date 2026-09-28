import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { IconX } from '../common/Icons';

export function Dialog({ open, onOpenChange, children, contentClassName }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      <div
        className={cn("relative z-10 w-full max-w-xl bg-white rounded-2xl border border-gray-200 shadow-none overflow-hidden transition-all animate-in zoom-in-95 duration-200", contentClassName)}
        onClick={(e) => e.stopPropagation()}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { onOpenChange });
        })}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ className, children, onOpenChange, showClose = true }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-gray-200 bg-[#f8fafc] px-7 py-4.5", className)}>
      <div>{children}</div>
      {onOpenChange && showClose && (
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
        >
          <IconX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({ className, children }) {
  return <h2 className={cn("text-base font-bold text-gray-900 tracking-tight", className)}>{children}</h2>;
}

export function DialogDescription({ className, children }) {
  return <p className={cn("text-xs text-gray-500 font-medium mt-0.5", className)}>{children}</p>;
}

export function DialogContent({ className, children }) {
  return <div className={cn("p-7 space-y-4.5", className)}>{children}</div>;
}

export function DialogFooter({ className, children }) {
  return <div className={cn("px-7 py-4.5 bg-[#f8fafc] border-t border-gray-200 flex items-center justify-end gap-2.5", className)}>{children}</div>;
}
