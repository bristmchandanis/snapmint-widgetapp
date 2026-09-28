import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconSpinner } from './Icons';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  itemName,
  itemType,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  icon: HeaderIcon = null,
  showClose = false,
  compact = false,
  notice,
  loading = false,
  children,
}) {
  const isDestructive = variant === 'destructive' || variant === 'danger';

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => { if (!val && !loading) onClose(); }}
      contentClassName={compact ? 'max-w-md rounded-2xl border-gray-200 shadow-2xl shadow-gray-950/15' : undefined}
    >
      <DialogHeader showClose={showClose} className={compact ? 'bg-white border-b-0 px-6 pt-6 pb-1' : undefined}>
        <div className="flex items-center gap-3">
          {HeaderIcon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDestructive
              ? 'bg-rose-50 text-rose-600 border border-rose-100/80'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-100/80'
              }`}>
              <HeaderIcon className="w-4 h-4" />
            </div>
          )}
          <div>
            <DialogTitle className={compact ? 'text-lg font-bold text-gray-900 tracking-tight' : 'text-base sm:text-lg font-bold text-gray-900 tracking-tight'}>
              {title}
            </DialogTitle>
            {(description || itemName) && (
              <DialogDescription className={compact ? 'text-sm text-gray-500 font-normal leading-6 mt-1' : 'text-xs sm:text-sm text-gray-500 font-medium mt-0.5'}>
                {itemName ? (
                  <span>
                    Are you sure you want to delete {itemType ? `${itemType} for ` : ''}<strong className="font-bold text-gray-900">{itemName}</strong>?
                  </span>
                ) : (
                  description
                )}
              </DialogDescription>
            )}
          </div>
        </div>
      </DialogHeader>

      <DialogContent className={compact ? 'px-6 pt-3 pb-6 space-y-4' : undefined}>
        {children && (
          <div className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
            {children}
          </div>
        )}

        {notice && (
          <div className={`rounded-lg border px-3.5 py-2.5 text-xs font-medium leading-5 ${isDestructive
            ? 'border-rose-100 bg-rose-50 text-rose-700'
            : 'border-indigo-100 bg-indigo-50 text-indigo-700'
            }`}>
            {notice}
          </div>
        )}

        <div className={`flex items-center justify-end gap-2.5 ${compact ? 'pt-2' : 'pt-4'}`}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className={`rounded-md h-8 text-xs font-semibold border-gray-200/90 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer ${compact ? 'px-3.5' : 'px-3.5'}`}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-md h-8 text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95 ${compact ? 'px-4' : 'px-4'} ${isDestructive
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
              : 'bg-gray-900 hover:bg-gray-800 shadow-gray-900/20'
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <IconSpinner className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Deleting</span>
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
