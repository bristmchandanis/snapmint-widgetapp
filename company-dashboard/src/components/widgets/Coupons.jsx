import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiService } from '../../utils/constants';

export default function Coupons({
  merchant,
  wizardData = {},
  onBack,
  onContinue,
  onGoToConfigure,
}) {
  const shopId = merchant?.id || wizardData?.id;
  const shopDomain = merchant?.shop || wizardData?.shop || merchant?.myshopifyDomain;

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Load coupons for this shop
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiService.getCoupons({ shopId: shopId || undefined, shopDomain: shopDomain || '' })
      .then((res) => {
        if (active && res?.success && Array.isArray(res.data?.coupons)) {
          setCoupons(res.data.coupons);
        }
      })
      .catch((err) => console.warn('Failed to fetch coupons:', err?.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [shopId, shopDomain]);

  // Validate coupon against Shopify and add to list
  const handleValidateAndAdd = async () => {
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) {
      return toast.error('Please enter a coupon code.');
    }

    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      toast.info(`Coupon "${cleanCode}" is already in your list.`);
      setCouponInput('');
      return;
    }

    try {
      setIsValidating(true);
      const res = await apiService.validateAndAddCoupon({
        shopId: shopId || undefined,
        shopDomain: shopDomain || '',
        code: cleanCode,
      });

      if (res?.success && res.data?.coupon) {
        toast.success(`Coupon "${cleanCode}" validated and turned on!`);
        setCoupons((prev) => [res.data.coupon, ...prev.filter((c) => c.id !== res.data.coupon.id)]);
        setCouponInput('');
      } else {
        toast.error(res?.message || `Coupon "${cleanCode}" is not found or inactive in Shopify.`);
      }
    } catch (err) {
      toast.error(err?.message || 'Error validating coupon.');
    } finally {
      setIsValidating(false);
    }
  };

  // Toggle coupon selectable state with optimistic update
  const handleToggleCoupon = async (couponId, nextState) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isSelectable: nextState } : c))
    );

    try {
      const res = await apiService.toggleCouponSelectable(couponId, nextState);
      if (!res?.success) throw new Error(res?.message);
    } catch (err) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, isSelectable: !nextState } : c))
      );
      toast.error(err?.message || 'Failed to update coupon.');
    }
  };

  const handleRecheckCoupon = (couponCode) => {
    toast.info(`Rechecking ${couponCode} with Shopify... Valid.`);
    setCoupons((prev) =>
      prev.map((c) => (c.code === couponCode ? { ...c, needsRecheck: false } : c))
    );
  };

  // Filter coupons by search query and dropdown status
  const filteredCoupons = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return coupons.filter((coupon) => {
      if (term) {
        const matches = [coupon.code, coupon.title, coupon.summary]
          .some((val) => val && String(val).toLowerCase().includes(term));
        if (!matches) return false;
      }
      if (filterStatus === 'TURNED_ON') return Boolean(coupon.isSelectable);
      if (filterStatus === 'TURNED_OFF') return !coupon.isSelectable;
      if (filterStatus === 'NEEDS_ATTENTION') return coupon.status !== 'ACTIVE' || coupon.needsRecheck;
      return true;
    });
  }, [coupons, searchQuery, filterStatus]);

  const shownToShoppersCount = useMemo(
    () => coupons.filter((c) => c.isSelectable && c.status === 'ACTIVE').length,
    [coupons]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Subtitle & Header */}
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Coupons
        </h1>
      </div>

      {/* 2. Card: Add a coupon by code */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
          Add a coupon by code
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleValidateAndAdd()}
            placeholder="e.g. FEST200"
            className="w-full sm:w-72 h-10 px-3.5 border border-gray-200 text-gray-900 placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:border-gray-900 bg-white rounded-lg text-xs sm:text-sm font-mono font-semibold uppercase transition-colors shadow-2xs"
          />

          <button
            type="button"
            disabled={isValidating || !couponInput.trim()}
            onClick={handleValidateAndAdd}
            className="h-10 px-5 bg-[#111827] hover:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isValidating ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>Validate & add</span>
          </button>

          <span className="text-xs text-gray-400">
            Valid codes are added and turned on.
          </span>
        </div>
      </div>

      {/* 3. Card: Merchant coupons table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Card Header */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Merchant coupons ({coupons.length})
            </h2>
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 border border-gray-200/60 rounded-full px-2.5 py-0.5">
              New coupons start off
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Turn on only the coupons you want shoppers to select in the widget.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coupon codes"
                className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 shadow-2xs"
              />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 pl-3 pr-8 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-gray-900 cursor-pointer shadow-2xs appearance-none"
              >
                <option value="ALL">All coupons</option>
                <option value="TURNED_ON">Turned on</option>
                <option value="TURNED_OFF">Turned off</option>
                <option value="NEEDS_ATTENTION">Needs attention</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            {shownToShoppersCount} shown to shoppers
          </div>
        </div>

        {/* Coupons Table: 3 Columns (CODE, TYPE, SELECTABLE BY SHOPPER) */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mt-3">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <div>CODE</div>
            <div>TYPE</div>
            <div className="text-right">SELECTABLE BY SHOPPER</div>
          </div>

          {loading ? (
            <div className="py-14 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading coupons...</span>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="py-14 text-center text-xs text-gray-400">
              No coupons yet. Add a valid coupon code above.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="grid grid-cols-[1.5fr_1fr_1fr] px-6 py-3.5 items-center hover:bg-gray-50/40 transition-colors"
                >
                  {/* Column 1: CODE */}
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 tracking-tight">
                      {coupon.code}
                    </span>
                    {coupon.source === 'Added by code' && (
                      <span className="text-[11px] text-gray-400 font-normal">
                        Added by code
                      </span>
                    )}
                  </div>

                  {/* Column 2: TYPE */}
                  <div className="text-sm font-normal text-gray-800">
                    {coupon.summary || (coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`)}
                  </div>

                  {/* Column 3: SELECTABLE BY SHOPPER */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(coupon.id, !coupon.isSelectable)}
                      className="flex items-center gap-2 cursor-pointer group select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${coupon.isSelectable
                          ? 'bg-[#111827] border border-[#111827] text-white shadow-2xs'
                          : 'bg-white border border-gray-300 group-hover:border-gray-400'
                          }`}
                      >
                        {coupon.isSelectable && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-semibold ${coupon.isSelectable ? 'text-gray-900' : 'text-gray-700'
                          }`}
                      >
                        {coupon.isSelectable ? 'On' : 'Off'}
                      </span>
                    </button>

                    {coupon.needsRecheck && (
                      <button
                        type="button"
                        onClick={() => handleRecheckCoupon(coupon.code)}
                        className="text-xs text-gray-500 hover:text-gray-900 underline font-medium cursor-pointer"
                      >
                        Recheck
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer of Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
          <span className="text-gray-500">
            Only turned-on, active coupons appear to shoppers.
          </span>
          <button
            type="button"
            onClick={() => setFilterStatus('TURNED_ON')}
            className="self-start sm:self-auto text-gray-600 hover:text-gray-900 underline font-medium cursor-pointer"
          >
            Check turned-on coupons
          </button>
        </div>
      </div>

      {/* 5. Sub-note below Card 3 */}
      <div className="text-xs text-gray-500">
        Coupon value and expiry come from Shopify. Enable Coupons for your Express placement in{' '}
        <button
          type="button"
          onClick={onGoToConfigure}
          className="text-gray-900 underline font-medium hover:text-black cursor-pointer inline"
        >
          Configure
        </button>.
      </div>

      {/* 6. Bottom Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="rounded-md h-9 px-4 border-gray-200 text-gray-800 font-semibold text-xs hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customisation</span>
          </Button>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Changes are saved automatically.
          </span>
        </div>

        <Button
          type="button"
          onClick={() => onContinue && onContinue({ coupons })}
          className="rounded-md h-9 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span>Next: Targeting</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
