import { Card } from '@/components/ui/card';

export default function MetricCard({ label, value, icon: Icon, valueColor = 'text-gray-900', badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200/80' }) {
  return (
    <Card className="p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</div>
        <div className={`text-2xl font-extrabold ${valueColor} mt-1 tracking-tight`}>
          {value ?? 0}
        </div>
      </div>
      {Icon && (
        <div className={`p-3 rounded-2xl border ${badgeStyle}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </Card>
  );
}
