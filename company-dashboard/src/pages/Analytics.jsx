import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../utils/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Filter from '../components/common/Filter';
import Pagination from '../components/common/Pagination';
import {
  IconClock,
  IconUser,
  IconStore,
  IconLayers,
  IconLock,
  IconBuilding,
  IconSpinner,
} from '../components/common/Icons';
import dayjs from 'dayjs';

const MODULE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Modules' },
  { value: 'AUTH', label: 'Auth & Login' },
  { value: 'STORES', label: 'Stores' },
  { value: 'MERCHANT_ONBOARD', label: 'Merchant' },
  { value: 'WIDGET_CUSTOMIZATION', label: 'Widget' },
  { value: 'SHOPIFY_APP', label: 'Shopify App' },
];

export default function Analytics({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchLogs = useCallback(async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(selectedModule !== 'ALL' ? { module: selectedModule } : {}),
      };
      const res = await apiService.getActivityLogs(params);
      if (res?.success) {
        setLogs(res.logs || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.warn('Failed to load activity logs:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [search, selectedModule, pageSize]);

  useEffect(() => {
    fetchLogs(currentPage, pageSize);
  }, [fetchLogs, currentPage, pageSize]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleModuleChange = (val) => {
    setSelectedModule(val);
    setCurrentPage(1);
  };

  const getLogIcon = (log) => {
    if (log.source === 'SHOPIFY_APP') return <IconBuilding className="w-3 h-3 text-white" />;
    switch (log.module) {
      case 'AUTH':
        return <IconLock className="w-3 h-3 text-white" />;
      case 'STORES':
        return <IconStore className="w-3 h-3 text-white" />;
      case 'WIDGET_CUSTOMIZATION':
        return <IconLayers className="w-3 h-3 text-white" />;
      default:
        return <IconUser className="w-3 h-3 text-white" />;
    }
  };

  // Group logs by date ("Today", "Yesterday", "22 Aug 2026")
  const groupedLogs = useMemo(() => {
    const groups = {};
    const todayStr = dayjs().format('YYYY-MM-DD');
    const yesterdayStr = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    logs.forEach((log) => {
      const dateObj = dayjs(log.createdAt);
      const dateKey = dateObj.format('YYYY-MM-DD');
      let dateLabel = dateObj.format('D MMMM');

      if (dateKey === todayStr) {
        dateLabel = 'Today';
      } else if (dateKey === yesterdayStr) {
        dateLabel = 'Yesterday';
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(log);
    });

    return groups;
  }, [logs]);

  const renderFormattedDescription = (text) => {
    if (!text) return null;
    const regex = /'([^']+)'/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }
      elements.push(
        <strong key={match.index} className="font-bold text-gray-900">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Activity Logs
        </h1>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-none overflow-hidden bg-white">
        <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-200 bg-[#f8fafc]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <IconClock className="w-4 h-4 text-gray-700" />
              Activity Stream
            </CardTitle>

            <Filter
              search={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search activity"
              filterValue={selectedModule}
              onFilterChange={handleModuleChange}
              filterOptions={MODULE_FILTER_OPTIONS}
              filterPlaceholder="All Modules"
              onRefresh={() => fetchLogs(currentPage, pageSize)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden bg-white">
          <div className="p-5 sm:p-6 max-h-[650px] overflow-y-auto [scrollbar-width:thin]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <IconSpinner className="w-6 h-6 animate-spin text-gray-900" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-gray-500 text-xs font-semibold">
                No activity logs found.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedLogs).map(([dateLabel, dateLogs]) => (
                  <div key={dateLabel} className="space-y-3">
                    <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                      {dateLabel}
                    </div>

                    <div className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-gray-200">
                      {dateLogs.map((log) => {
                        const displayName = log.source === 'SHOPIFY_APP' ? 'Shopify' : (log.userName || 'Dashboard');
                        const timeStr = dayjs(log.createdAt).format('hh:mm A');

                        return (
                          <div key={log.id} className="relative group">
                            <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-2xs border-2 border-white ring-1 ring-gray-200">
                              {getLogIcon(log)}
                            </div>

                            <div className="flex items-start justify-between gap-4 py-1 px-2 rounded-md hover:bg-gray-50/80 transition-colors">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-xs text-gray-900">{displayName}</span>
                                  {log.shopDomain && (
                                    <span className="text-[11px] font-mono font-medium text-gray-700 bg-gray-100 border border-gray-200/80 px-2 py-0.5 rounded">
                                      {log.shopDomain}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 font-normal leading-relaxed">
                                  {renderFormattedDescription(log.description || log.action)}
                                </p>
                              </div>

                              <span className="text-xs font-semibold text-gray-400 whitespace-nowrap shrink-0 mt-0.5 font-sans">
                                {timeStr}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && pagination.total > 0 && (
            <Pagination
              page={currentPage}
              limit={pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
