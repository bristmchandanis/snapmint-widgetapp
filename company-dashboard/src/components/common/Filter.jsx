import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { IconSearch, IconRefresh } from './Icons';

export default function Filter({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search records',
  filterValue = 'ALL',
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = 'All Status',
  onRefresh,
  loading = false,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative">
          <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9 h-9.5 w-full sm:w-60 bg-white text-xs border-gray-200 focus:border-gray-400 focus:ring-4 focus:ring-gray-400/10 rounded-xl font-medium"
          />
        </div>
      )}

      {/* Select Filter Dropdown */}
      {onFilterChange && filterOptions.length > 0 && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent align="end">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Refresh Action Button */}
      {onRefresh && (
        <Button
          onClick={onRefresh}
          disabled={loading}
          size="icon"
          className="h-9.5 w-9.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-2xs cursor-pointer"
          title="Refresh database records"
        >
          <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
}
