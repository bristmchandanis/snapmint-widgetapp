import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { IconSpinner } from './Icons';

export default function DataTable({
  headers = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  renderRow,
}) {
  const colSpan = headers.length || 1;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((h, index) => {
            const isObj = typeof h === 'object' && h !== null;
            const label = isObj ? h.label : h;
            const className = isObj ? h.className || '' : '';
            return (
              <TableHead key={isObj ? h.key || index : index} className={className}>
                {label}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={colSpan} className="h-48 text-center">
              <div className="flex items-center justify-center py-12">
                <IconSpinner className="w-6 h-6 animate-spin text-gray-900" />
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={colSpan} className="h-40 text-center">
              <div className="text-sm font-semibold text-gray-700">
                {emptyMessage}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => renderRow(item, index))
        )}
      </TableBody>
    </Table>
  );
}
