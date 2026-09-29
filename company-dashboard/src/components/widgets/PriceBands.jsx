import { useState, useMemo, useCallback, memo } from 'react';
import { PieChart, Square, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency } from '../../utils/helpers';

const REFERENCE_PLANS = [
  { id: 'ref-1', type: 'fixed', tenure: 1, dp: 1, min: 199, max: 1000 },
  { id: 'ref-2', type: 'percentage', tenure: 2, dp: 33, min: 1001, max: 3000 },
  { id: 'ref-3m', type: 'percentage', tenure: 3, dp: 25, min: 3001, max: 200000 },
  { id: 'ref-6m', type: 'percentage', tenure: 6, dp: 25, min: 5000, max: 200000 },
  { id: 'ref-9m', type: 'percentage', tenure: 9, dp: 25, min: 10000, max: 200000 },
  { id: 'ref-12m', type: 'percentage', tenure: 12, dp: 25, min: 15000, max: 200000 },
];

const ALLOWED_PERCENT_TENURES = new Set([2, 3, 4, 5, 6, 9, 12]);
const ALLOWED_PIE_TENURES = new Set([2, 3]);
const ALLOWED_FIXED_DP_TENURES = new Set([1, 2, 3]);

const GRID_ROW =
  'grid grid-cols-[1.3fr_120px_1.4fr_2.2fr] gap-4 items-center px-6 py-3.5';

function getAllowedStyles(plans) {
  if (plans.length > 1) {
    const isMultiBox =
      plans.length <= 4 &&
      plans.every((p) => p.type === 'percentage' && ALLOWED_PERCENT_TENURES.has(p.tenure));
    return isMultiBox ? ['box'] : [];
  }

  const plan = plans[0];
  if (!plan) return [];

  if (plan.type === 'fixed') {
    const isValid =
      ([0, 1].includes(plan.dp) && ALLOWED_FIXED_DP_TENURES.has(plan.tenure)) ||
      (plan.dp === 19 && [2, 3].includes(plan.tenure));
    return isValid ? ['fixed-dp'] : [];
  }

  const allowed = [];
  if (ALLOWED_PIE_TENURES.has(plan.tenure)) allowed.push('pie');
  if (ALLOWED_PERCENT_TENURES.has(plan.tenure)) allowed.push('box');
  return allowed;
}

function computePriceBands(plans) {
  const validPlans = (plans || []).filter((p) => p.min > 0 && p.max >= p.min);
  if (!validPlans.length) return [];

  const boundaries = validPlans.flatMap((p) => [p.min, p.max + 1]);
  const edges = [...new Set(boundaries)].sort((a, b) => a - b);

  const bands = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const min = edges[i];
    const max = edges[i + 1] - 1;

    const activePlans = validPlans.filter((p) => p.min <= min && p.max >= max);

    const grouped = {};
    for (const plan of activePlans) {
      const key = `${plan.type}:${plan.dp}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(plan);
    }

    const groups = Object.entries(grouped).map(([dpKey, groupPlans]) => {
      groupPlans.sort((a, b) => a.tenure - b.tenure);
      const allowed = getAllowedStyles(groupPlans);
      return {
        key: `${min}-${max}-${dpKey}`,
        plans: groupPlans,
        allowed,
        defaultStyle: allowed.includes('pie') ? 'pie' : allowed[0] || '',
      };
    });

    bands.push({ min, max, groups });
  }

  return bands;
}

function getStyleButtonClass(isSelected, isAllowed) {
  if (isSelected) {
    return 'bg-white text-gray-900 border border-gray-400 shadow-xs font-semibold cursor-pointer';
  }
  if (isAllowed) {
    return 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 cursor-pointer font-medium';
  }
  return 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed select-none disabled:opacity-100';
}

function BoundaryRow({ label, message, bg = 'bg-gray-50/40' }) {
  return (
    <div className={`${GRID_ROW} ${bg} text-gray-400 font-medium`}>
      <div>{label}</div>
      <div>—</div>
      <div>No eligible plan</div>
      <div>{message}</div>
    </div>
  );
}

const BandGroupRow = memo(function BandGroupRow({
  group,
  rangeLabel,
  showRangeLabel,
  selectedStyle,
  onSelectStyle,
}) {
  const first = group.plans[0];
  const dpLabel =
    first.type === 'fixed'
      ? `${formatCurrency(first.dp)} fixed`
      : `${first.dp}%`;

  const isMulti = group.plans.length > 1;

  const styleButtons = [
    { id: 'pie', label: 'Pie', icon: <PieChart className="w-3.5 h-3.5" /> },
    {
      id: 'box',
      label: isMulti ? 'Multiplan Box' : 'Box',
      icon: isMulti ? <Columns3 className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />,
    },
    { id: 'fixed-dp', label: 'Fixed DP', icon: null },
  ];

  return (
    <div className={`${GRID_ROW} hover:bg-gray-50/50 transition-colors`}>
      <div className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight">
        {showRangeLabel ? rangeLabel : ''}
      </div>

      <div>
        <Badge
          variant="secondary"
          className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-200/90 text-xs font-semibold h-auto"
        >
          {dpLabel}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {group.plans.map((p) => (
          <Badge
            key={p.id}
            variant="outline"
            className="px-2 py-0.5 rounded-md bg-white text-gray-700 border border-gray-200 text-xs font-medium shadow-2xs h-auto"
          >
            {p.tenure} mo
          </Badge>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-2">
          {styleButtons.map((opt) => {
            const isAllowed = group.allowed.includes(opt.id);
            const isSelected = selectedStyle === opt.id;

            return (
              <Button
                key={opt.id}
                type="button"
                variant="outline"
                size="sm"
                disabled={!isAllowed}
                onClick={() => onSelectStyle(group.key, opt.id)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 transition-all ${getStyleButtonClass(
                  isSelected,
                  isAllowed
                )}`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </Button>
            );
          })}
        </div>

        {!group.allowed.length && (
          <p className="text-[11px] text-amber-700 mt-1.5 font-medium">
            No compatible layout in the current rules. Review these plans.
          </p>
        )}
      </div>
    </div>
  );
});

export default function PriceBands({ plans = [], onBack, onContinue }) {
  const [isExample, setIsExample] = useState(false);
  const [choices, setChoices] = useState({});

  const activePlans = useMemo(() => {
    if (isExample) return REFERENCE_PLANS;
    return (plans || []).map((p) => ({
      id: p.id,
      type: p.dpType === 'fixed' ? 'fixed' : 'percentage',
      dp: Number(p.downPayment) || 0,
      tenure: Number(p.tenure) || 0,
      min: Number(p.minAmount) || 0,
      max: Number(p.maxAmount) || 0,
    }));
  }, [isExample, plans]);

  const bands = useMemo(() => computePriceBands(activePlans), [activePlans]);
  const activeBandsCount = bands.filter((b) => b.groups.length > 0).length;

  const handleSelectStyle = useCallback((groupKey, style) => {
    setChoices((prev) => ({ ...prev, [groupKey]: style }));
  }, []);

  const handleSaveStyles = () => {
    toast.success('Price band styles saved successfully!');
    if (onContinue) onContinue({ bands, choices });
  };

  const minRange = bands.length > 0 ? formatCurrency(bands[0].min) : '₹199';
  const maxRange = bands.length > 0 ? formatCurrency(bands[bands.length - 1].max) : '₹2,00,000';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Price bands</h1>
      </div>

        <Card className="rounded-2xl border border-gray-200/80 shadow-xs bg-white overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-bold text-gray-900 tracking-tight">
              Computed price bands ({activeBandsCount})
            </CardTitle>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setIsExample((prev) => !prev)}
              className="p-0 h-auto text-xs text-gray-500 hover:text-black font-semibold underline underline-offset-4 cursor-pointer transition-colors"
            >
              {isExample ? 'Back to merchant plans' : 'View six-plan example'}
            </Button>
          </CardHeader>

          <div className="overflow-x-auto w-full">
            <div className="min-w-[960px] w-full">
              <div className="grid grid-cols-[1.3fr_120px_1.4fr_2.2fr] gap-4 items-center px-6 py-3 border-y border-gray-200 bg-gray-50/90 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                <div>Order value</div>
                <div>Down payment</div>
                <div>Eligible tenures</div>
                <div>Pop-up style</div>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                <BoundaryRow
                  label={`Below ${minRange}`}
                  message="Below minimum · fallback"
                />

                {bands.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-500 font-medium">
                    No active plans found to compute price bands. Please{' '}
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={onBack}
                      className="p-0 h-auto font-semibold text-gray-900 underline underline-offset-4 inline cursor-pointer"
                    >
                      go back to Plans
                    </Button>{' '}
                    or view the six-plan example.
                  </div>
                ) : (
                  bands.map((band, bandIdx) => {
                    const rangeLabel = `${formatCurrency(band.min)} – ${formatCurrency(band.max)}`;

                    if (band.groups.length === 0) {
                      return (
                        <BoundaryRow
                          key={`empty-${bandIdx}`}
                          label={rangeLabel}
                          message="No plan assigned in Plans"
                          bg="bg-gray-50/30"
                        />
                      );
                    }

                    return band.groups.map((group, groupIdx) => {
                      const preferred = choices[group.key];
                      const selectedStyle = group.allowed.includes(preferred)
                        ? preferred
                        : group.defaultStyle;

                      return (
                        <BandGroupRow
                          key={group.key}
                          group={group}
                          rangeLabel={rangeLabel}
                          showRangeLabel={groupIdx === 0}
                          selectedStyle={selectedStyle}
                          onSelectStyle={handleSelectStyle}
                        />
                      );
                    });
                  })
                )}

                <BoundaryRow
                  label={`Above ${maxRange}`}
                  message="Above maximum · no pop-up"
                />
              </div>
            </div>
          </div>

          <CardFooter className="px-6 py-4 border-t border-gray-100 flex items-center justify-end bg-white">
            <Button
              type="button"
              onClick={handleSaveStyles}
              className="rounded-md h-8 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center gap-2"
            >
              <span>Save styles</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
  );
}
