import { useState, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { IconArrowRight, IconX, IconPlus, IconTrash, IconAlertCircle } from '../common/Icons';
import ConfirmModal from '../common/ConfirmModal';

const DP_TYPE_OPTIONS = [
  { label: '%', value: 'percent' },
  { label: '₹', value: 'fixed' },
];

const REPAYMENT_TYPE_OPTIONS = [
  { label: '0%', value: 'zero' },
  { label: 'Interest', value: 'interest' },
];

const GRID_TEMPLATE_COLUMNS =
  '92px minmax(100px, 1fr) 76px 132px minmax(160px, 1.2fr) minmax(110px, 1fr) minmax(110px, 1fr) 36px';

const TABLE_HEADERS = [
  'DP TYPE',
  'DOWN PAYMENT',
  'TENURE',
  'REPAYMENT TYPE',
  'EMI PLAN %',
  'MIN AMOUNT',
  'MAX AMOUNT',
  '',
];

function SuffixedInput({
  value,
  onChange,
  suffix,
  placeholder = '',
  error = false,
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-9.5 pl-3 pr-6 text-xs font-medium rounded-lg outline-none transition-all ${error
          ? 'bg-red-50/20 text-red-900 border border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400/20 placeholder:text-red-300'
          : 'bg-white text-gray-900 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400/20'
          }`}
      />
      {suffix && (
        <span
          className={`absolute right-2.5 text-xs font-semibold pointer-events-none ${error ? 'text-red-400' : 'text-gray-400'
            }`}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

function SegmentedToggle({ options, value, onChange }) {
  return (
    <div className="flex items-center bg-[#F3F5F8] p-1 rounded-md border border-gray-200/80 h-9.5 gap-1">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 h-full px-1.5 text-xs rounded transition-all cursor-pointer flex items-center justify-center outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${isSelected
              ? 'bg-white text-gray-900 font-bold border border-gray-400 shadow-2xs'
              : 'text-gray-500 hover:text-gray-900 font-medium border border-transparent'
              }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const PlanRow = memo(function PlanRow({ plan, error, onUpdate, onRemove }) {
  const isError = Boolean(error);
  return (
    <div className={`transition-colors ${isError ? 'bg-red-50/20' : 'hover:bg-gray-50/40'}`}>
      <div
        className="grid gap-x-3 items-center px-5 sm:px-6 py-3"
        style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
      >
        <SegmentedToggle
          options={DP_TYPE_OPTIONS}
          value={plan.dpType}
          onChange={(val) => onUpdate(plan.id, 'dpType', val)}
        />

        <SuffixedInput
          value={plan.downPayment}
          suffix={plan.dpType === 'percent' ? '%' : '₹'}
          onChange={(e) => onUpdate(plan.id, 'downPayment', e.target.value)}
        />

        <SuffixedInput
          value={plan.tenure}
          suffix="mo"
          onChange={(e) => onUpdate(plan.id, 'tenure', e.target.value)}
        />

        <SegmentedToggle
          options={REPAYMENT_TYPE_OPTIONS}
          value={plan.repaymentType}
          onChange={(val) => onUpdate(plan.id, 'repaymentType', val)}
        />

        <div className="relative flex items-center justify-between h-9.5 px-3 bg-white border border-gray-200 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400/20 rounded-lg">
          {plan.isCalculated ? (
            <span className="text-xs text-gray-500 font-medium">Calculated</span>
          ) : (
            <div className="flex items-center gap-1 flex-1 min-w-0 pr-1">
              <input
                type="text"
                value={plan.emiPlanPercent}
                onChange={(e) => onUpdate(plan.id, 'emiPlanPercent', e.target.value)}
                className="w-full text-xs text-gray-900 font-medium bg-transparent outline-none border-none p-0 focus:outline-none focus:ring-0"
              />
              <span className="text-xs text-gray-400 font-semibold pointer-events-none">%</span>
            </div>
          )}
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-800 border border-gray-200/80 rounded text-[10px] font-bold whitespace-nowrap ml-1 pointer-events-none">
            0% EMI
          </span>
        </div>

        <SuffixedInput
          value={plan.minAmount}
          suffix="₹"
          placeholder="199"
          error={isError}
          onChange={(e) => onUpdate(plan.id, 'minAmount', e.target.value)}
        />

        <SuffixedInput
          value={plan.maxAmount}
          suffix="₹"
          placeholder="200000"
          error={isError}
          onChange={(e) => onUpdate(plan.id, 'maxAmount', e.target.value)}
        />

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onRemove(plan)}
            className="h-9 w-9 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-all cursor-pointer"
            title="Remove plan"
          >
            <IconX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 sm:px-6 pb-2.5 -mt-1 flex items-center gap-1.5 text-[11px] text-red-600 font-medium">
          <IconAlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

export default function Plans({ onContinue, initialPlans }) {
  const [plans, setPlans] = useState(initialPlans || []);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Validate duplicate min-max ranges or invalid boundaries
  const planErrors = useMemo(() => {
    const errors = {};
    const rangeGroups = new Map();

    plans.forEach((plan) => {
      const minTrim = String(plan.minAmount ?? '').trim();
      const maxTrim = String(plan.maxAmount ?? '').trim();

      const minVal = minTrim !== '' && !isNaN(Number(minTrim)) ? Number(minTrim) : null;
      const maxVal = maxTrim !== '' && !isNaN(Number(maxTrim)) ? Number(maxTrim) : null;

      if (minVal !== null && maxVal !== null) {
        if (minVal >= maxVal) {
          errors[plan.id] = 'Min amount must be less than Max amount.';
          return;
        }

        const rangeKey = `${minVal}_${maxVal}`;
        if (!rangeGroups.has(rangeKey)) {
          rangeGroups.set(rangeKey, []);
        }
        rangeGroups.get(rangeKey).push(plan);
      }
    });

    rangeGroups.forEach((group, key) => {
      if (group.length > 1) {
        const [minStr, maxStr] = key.split('_');
        const formattedRange = `₹${Number(minStr).toLocaleString('en-IN')} – ₹${Number(maxStr).toLocaleString('en-IN')}`;
        group.forEach((p) => {
          errors[p.id] = `Duplicate plan: You already have a plan configured for ${formattedRange}.`;
        });
      }
    });

    return errors;
  }, [plans]);

  const hasDuplicateErrors = Object.keys(planErrors).length > 0;

  const handleUpdatePlan = useCallback((id, field, value) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== id) return plan;

        if (field === 'dpType' && plan.dpType !== value) {
          const isPercent = value === 'percent';
          return {
            ...plan,
            dpType: value,
            downPayment: isPercent ? '25' : '1',
            emiPlanPercent: isPercent ? '25' : 'Calculated',
            isCalculated: !isPercent,
          };
        }

        return { ...plan, [field]: value };
      })
    );
  }, []);

  const handleAddPlan = () => {
    const isFirst = plans.length === 0;
    const newPlan = {
      id: `plan-${Date.now()}`,
      dpType: 'percent',
      downPayment: '25',
      tenure: '3',
      repaymentType: 'zero',
      emiPlanPercent: '25',
      isCalculated: false,
      minAmount: isFirst ? '199' : '',
      maxAmount: isFirst ? '200000' : '',
    };
    setPlans((prev) => [...prev, newPlan]);
  };

  const handleRemovePlan = useCallback((plan) => {
    setPlanToDelete(plan);
  }, []);

  const handleConfirmDelete = () => {
    if (planToDelete) {
      setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      toast.success('Merchant plan deleted successfully!');
      setPlanToDelete(null);
    }
  };

  const handleSaveAndContinue = (e) => {
    e.preventDefault();

    if (plans.length === 0) {
      toast.error('Please add at least one plan to continue.');
      return;
    }

    const hasEmpty = plans.some(
      (p) => String(p.minAmount ?? '').trim() === '' || String(p.maxAmount ?? '').trim() === ''
    );
    if (hasEmpty) {
      toast.error('Please specify both Min and Max amounts for all plans.');
      return;
    }

    const errorKeys = Object.keys(planErrors);
    if (errorKeys.length > 0) {
      const firstError = planErrors[errorKeys[0]];
      toast.error(firstError);
      return;
    }

    if (onContinue) {
      onContinue(plans);
    } else {
      toast.success('Merchant plans saved successfully!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Plans
        </h1>
      </div>

      <form onSubmit={handleSaveAndContinue} className="space-y-6">
        <Card className="rounded-2xl border border-gray-200/80 shadow-xs bg-white overflow-hidden">
          <div className="p-5 sm:p-6 pb-0">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Merchant plans ({plans.length})
            </h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Enter each monthly EMI as a percentage of the order value.
            </p>
          </div>

          {hasDuplicateErrors && (
            <div className="mx-5 sm:mx-6 mt-4 p-2.5 bg-red-50/80 border border-red-200/80 rounded-lg flex items-center gap-2 text-xs text-red-700 font-medium">
              <IconAlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>Duplicate plans found: Each plan must have a unique Min and Max amount range.</span>
            </div>
          )}

          <div className="overflow-x-auto w-full">
            <div className="min-w-[1040px] w-full">
              <div
                className="grid gap-x-3 items-center px-5 sm:px-6 py-3 border-y border-gray-200 bg-gray-50/90 text-[10px] font-bold tracking-wider text-gray-500 uppercase mt-4"
                style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
              >
                {TABLE_HEADERS.map((header, idx) => (
                  <div key={idx}>{header}</div>
                ))}
              </div>

              <div className="divide-y divide-gray-100">
                {plans.length === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center gap-1.5">
                    <p className="text-xs font-semibold text-gray-500">No merchant plans added yet</p>
                  </div>
                ) : (
                  plans.map((plan) => (
                    <PlanRow
                      key={plan.id}
                      plan={plan}
                      error={planErrors[plan.id]}
                      onUpdate={handleUpdatePlan}
                      onRemove={handleRemovePlan}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddPlan}
              className="rounded-md h-8 px-4 border-gray-200 text-gray-800 hover:bg-gray-50 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4 text-gray-600" />
              <span>Add plan</span>
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="rounded-lg h-9 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>Continue to Price Bands</span>
                <IconArrowRight className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <ConfirmModal
        open={Boolean(planToDelete)}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Merchant Plan"
        description="Are you sure you want to delete this merchant plan?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={IconTrash}
        compact
      />
    </div>
  );
}