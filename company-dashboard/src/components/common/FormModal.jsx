import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconSpinner } from './Icons';

export default function FormModal({
  open,
  onClose,
  title,
  icon: Icon,
  onSubmit,
  loading = false,
  submitDisabled = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  readOnly = false,
  children,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        {Icon ? (
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gray-100 text-gray-800 rounded-md border border-gray-200/80">
              <Icon className="w-4 h-4 text-gray-800" />
            </div>
            <DialogTitle className="text-base font-bold text-gray-900">{title}</DialogTitle>
          </div>
        ) : (
          <DialogTitle>{title}</DialogTitle>
        )}
      </DialogHeader>

      <form onSubmit={readOnly ? (event) => { event.preventDefault(); onClose(); } : onSubmit} noValidate autoComplete="off">
        <DialogContent className="p-6 space-y-4">
          {children}
        </DialogContent>

        <DialogFooter className="px-6 py-4 bg-[#f8fafc] border-t border-gray-200 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="rounded-md h-8 text-xs px-3.5 border-gray-200 text-gray-700 font-semibold cursor-pointer"
          >
            {readOnly ? 'Close' : cancelText}
          </Button>
          {!readOnly && (
            <Button
              type="submit"
              disabled={loading || submitDisabled}
              className="rounded-md h-8 text-xs px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <IconSpinner className="w-3.5 h-3.5 animate-spin text-white" />
                  {submitText}
                </span>
              ) : (
                submitText
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    </Dialog>
  );
}
