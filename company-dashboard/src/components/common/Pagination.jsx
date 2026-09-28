import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { IconChevronLeft, IconChevronRight } from './Icons';

export default function Pagination({
  page = 1,
  limit = 10,
  total = 0,
  totalPages = 1,
  onPageChange,
  onLimitChange,
  loading = false,
  limitOptions = [10, 20, 50, 100],
}) {
  const handleLimitChange = (newLimitStr) => {
    if (onLimitChange) {
      onLimitChange(parseInt(newLimitStr, 10));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 bg-[#f8fafc]">
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
        {onLimitChange && (
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <Select value={String(limit)} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-7 w-16 text-xs bg-white border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {limitOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="h-8 px-3 text-xs font-semibold rounded-lg border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          <IconChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={page >= (totalPages || 1) || loading}
          className="h-8 px-3 text-xs font-semibold rounded-lg border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          Next <IconChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
