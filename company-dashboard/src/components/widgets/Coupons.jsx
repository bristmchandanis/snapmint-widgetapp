import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, RotateCw, ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
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
  const shopId = merchant?.id || wizardData?.id || merchant?.shopId;
  const shopDomain = merchant?.myshopifyDomain || merchant?.shop || wizardData?.myshopifyDomain || wizardData?.shopDomain;

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShopifyConnected, setIsShopifyConnected] = useState(Boolean(merchant?.token || wizardData?.token));
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [syncedTimestamp, setSyncedTimestamp] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [monsoonExpiryNotice, setMonsoonExpiryNotice] = useState(false);

  const fetchCoupons = useCallback(async () => {
    if (!isShopifyConnected && !isDemoMode) {
      setCoupons([]);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.getCoupons({
        shopId: shopId || 'ALL',
        shopDomain: shopDomain || '',
      });

      if (res?.success && Array.isArray(res.data?.coupons) && res.data.coupons.length > 0) {
        setCoupons(res.data.coupons);
        if (res.data.isShopifyConnected !== undefined) {
          setIsShopifyConnected(res.data.isShopifyConnected);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch coupons:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [shopId, shopDomain, isShopifyConnected, isDemoMode]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Handle Try Demo / Exit Demo
  const handleTryDemo = async () => {
    setIsDemoMode(true);
    setIsSynced(true);
    setSyncedTimestamp('1 Oct, 9:56 am');
    try {
      setLoading(true);
      const res = await apiService.loadDemoCoupons({
        shopId: shopId || 1,
        shopDomain: shopDomain || 'demo.myshopify.com',
      });

      if (res?.success && Array.isArray(res.data?.coupons) && res.data.coupons.length > 0) {
        setCoupons(res.data.coupons);
      } else {
        // Fallback exact sample list from Image 1
        setCoupons([
          { id: 1, code: 'FEST200', source: 'Added by code', summary: '₹200 off', isSelectable: false, status: 'ACTIVE' },
          { id: 2, code: 'WELCOME10', source: 'Added by code', summary: '10% off', isSelectable: true, status: 'ACTIVE' },
          { id: 3, code: 'RAJ_YT', summary: '15% off', isSelectable: false, status: 'ACTIVE' },
          { id: 4, code: 'ARCHIVE22', summary: '₹50 off', isSelectable: false, status: 'ACTIVE', needsRecheck: true },
          { id: 5, code: 'MONSOON', summary: '8% off', isSelectable: false, status: 'ACTIVE' },
          { id: 6, code: 'SUMMER24', summary: '12% off', isSelectable: false, status: 'ACTIVE' },
        ]);
      }
      toast.success('Demo mode active: Loaded sample coupons!');
    } catch (err) {
      toast.error('Unable to load demo coupons.');
    } finally {
      setLoading(false);
    }
  };

  const handleExitDemo = () => {
    setIsDemoMode(false);
    setIsSynced(false);
    setSyncedTimestamp(null);
    setCoupons([]);
    setMonsoonExpiryNotice(false);
    toast.info('Exited demo mode.');
  };

  const handleValidateAndAdd = async () => {
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) {
      toast.error('Please enter a coupon code.');
      return;
    }

    if (!isShopifyConnected && !isDemoMode) {
      toast.error('Shopify is not connected. Connect Shopify or click "Try demo" to validate coupons.');
      return;
    }

    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      toast.info(`Coupon "${cleanCode}" is already in your list.`);
      setCouponInput('');
      return;
    }

    try {
      setIsValidating(true);
      const res = await apiService.validateAndAddCoupon({
        shopId: shopId || 1,
        shopDomain: shopDomain || '',
        code: cleanCode,
        isDemoMode,
      });

      if (res?.success && res.data?.coupon) {
        toast.success(`Coupon "${cleanCode}" validated and turned on!`);
        setCoupons((prev) => [res.data.coupon, ...prev.filter((c) => c.id !== res.data.coupon.id)]);
        setCouponInput('');
      } else {
        const msg = res?.message || `Coupon "${cleanCode}" is not found or inactive in Shopify.`;
        toast.error(msg);
      }
    } catch (err) {
      toast.error(err?.message || 'Error validating coupon.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleToggleCoupon = async (couponId, nextState, couponCode) => {
    // Check for MONSOON expiry notice trigger from demo mode instructions
    if (couponCode === 'MONSOON' && nextState) {
      setMonsoonExpiryNotice(true);
      toast.warning('Expiry notice: MONSOON expires soon in Shopify. Keep expiry dates aligned.');
    } else if (couponCode === 'MONSOON' && !nextState) {
      setMonsoonExpiryNotice(false);
    }

    // Optimistic UI update
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isSelectable: nextState } : c))
    );

    try {
      const res = await apiService.toggleCouponSelectable(couponId, nextState);
      if (!res?.success) {
        // Revert on failure
        setCoupons((prev) =>
          prev.map((c) => (c.id === couponId ? { ...c, isSelectable: !nextState } : c))
        );
        toast.error(res?.message || 'Failed to update coupon.');
      }
    } catch (err) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, isSelectable: !nextState } : c))
      );
      toast.error('Error updating coupon status.');
    }
  };

  const handleRecheckCoupon = (couponCode) => {
    toast.info(`Rechecking ${couponCode} with Shopify... Valid.`);
    setCoupons((prev) =>
      prev.map((c) => (c.code === couponCode ? { ...c, needsRecheck: false } : c))
    );
  };

  const handleSyncFromShopify = async () => {
    if (!isShopifyConnected && !isDemoMode) {
      toast.error('Shopify is not connected. Connect Shopify first or click "Try demo".');
      return;
    }

    try {
      setIsSyncing(true);
      if (isDemoMode) {
        await handleTryDemo();
        return;
      }

      const res = await apiService.syncShopifyCoupons({
        shopId: shopId || 1,
        shopDomain: shopDomain || '',
      });

      if (res?.success) {
        toast.success(res.message || 'Synced coupons from Shopify!');
        setIsSynced(true);
        setSyncedTimestamp('Just now');
        await fetchCoupons();
      } else {
        toast.error(res?.message || 'Failed to sync coupons from Shopify.');
      }
    } catch (err) {
      toast.error('Failed to sync from Shopify.');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      // Search
      if (searchQuery.trim()) {
        const term = searchQuery.trim().toLowerCase();
        const codeMatch = (coupon.code || '').toLowerCase().includes(term);
        const titleMatch = (coupon.title || '').toLowerCase().includes(term);
        const summaryMatch = (coupon.summary || '').toLowerCase().includes(term);
        if (!codeMatch && !titleMatch && !summaryMatch) return false;
      }

      // Dropdown filter
      if (filterStatus === 'TURNED_ON') {
        return Boolean(coupon.isSelectable);
      }
      if (filterStatus === 'TURNED_OFF') {
        return !coupon.isSelectable;
      }
      if (filterStatus === 'NEEDS_ATTENTION') {
        return coupon.status !== 'ACTIVE' || coupon.needsRecheck;
      }

      return true;
    });
  }, [coupons, searchQuery, filterStatus]);

  const shownToShoppersCount = useMemo(() => {
    return coupons.filter((c) => c.isSelectable && c.status === 'ACTIVE').length;
  }, [coupons]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue({ coupons });
    }
  };

  const isFormActive = isShopifyConnected || isDemoMode;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Subtitle & Header */}
      <div className="space-y-0.5">
        <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
          YOUR MERCHANT'S OFFERS
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Coupons
        </h1>
      </div>

      {/* 2. Top Banner: Disconnected vs Demo mode vs Connected */}
      {isDemoMode ? (
        <div className="bg-[#FFF9F4] rounded-2xl border border-[#FED7AA] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              Demo mode · Sample coupons
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Sync the sample list, or add FEST200 or WELCOME10. Turn on MONSOON to try an expiry notice.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExitDemo}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-orange-50/30 text-gray-900 text-xs sm:text-sm font-bold rounded-lg border border-[#FF6F00] shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            Exit demo
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              {isShopifyConnected
                ? `Shopify connected ${shopDomain ? `· ${shopDomain}` : ''}`
                : 'Shopify is not connected'}
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              {isShopifyConnected
                ? 'Shopify is connected. Validate coupon codes directly or sync all discounts from Shopify.'
                : 'Connect Shopify to sync and validate coupons, or try this flow with sample codes.'}
            </p>
          </div>

          {!isShopifyConnected && (
            <button
              type="button"
              onClick={handleTryDemo}
              className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-orange-50/20 text-gray-900 text-xs sm:text-sm font-bold rounded-lg border border-[#FF6F00] shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              Try demo
            </button>
          )}
        </div>
      )}

      {/* 3. Card 2: Add a coupon by code */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
          Add a coupon by code
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="text"
            disabled={!isFormActive}
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && isFormActive && handleValidateAndAdd()}
            placeholder="e.g. FEST200"
            className={`w-full sm:w-72 h-10 px-3.5 border rounded-lg text-xs sm:text-sm font-mono font-semibold uppercase transition-colors shadow-2xs ${
              isFormActive
                ? 'border-gray-200 text-gray-900 placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:border-gray-900 bg-white'
                : 'border-gray-100 bg-gray-50/80 text-gray-400 placeholder:text-gray-300 cursor-not-allowed'
            }`}
          />

          <button
            type="button"
            disabled={!isFormActive || isValidating || !couponInput.trim()}
            onClick={handleValidateAndAdd}
            className="h-10 px-5 bg-[#FF6F00] hover:bg-[#E66400] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isValidating ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>Validate & add</span>
          </button>

          <span className="text-xs text-gray-400">
            {isFormActive
              ? 'Valid codes are added and turned on.'
              : 'Connect Shopify or try demo to add coupons.'}
          </span>
        </div>
      </div>

      {/* 4. Card 3: Merchant coupons table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                Merchant coupons ({coupons.length})
              </h2>
              <span className="text-[11px] font-medium text-gray-500 bg-gray-100 border border-gray-200/60 rounded-full px-2.5 py-0.5">
                One-time sync · New coupons start off
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {isSynced && syncedTimestamp
                ? `Synced ${syncedTimestamp}. Your selections are kept as coupons are rechecked.`
                : "Import your store's coupons once, then turn on only the public ones."}
            </p>
          </div>

          {isSynced ? (
            <button
              type="button"
              onClick={handleSyncFromShopify}
              disabled={isSyncing}
              className="self-start sm:self-auto px-4 py-2 bg-gray-50/80 hover:bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-gray-600 stroke-[2.5]" />
              <span>Synced</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSyncFromShopify}
              disabled={isSyncing || (!isShopifyConnected && !isDemoMode)}
              className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-3.5 h-3.5 text-gray-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync from Shopify</span>
            </button>
          )}
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

        {/* MONSOON Expiry Notice Banner (shown if MONSOON is On) */}
        {monsoonExpiryNotice && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Notice:</strong> MONSOON expires soon in Shopify. Make sure to keep dates aligned.
            </span>
          </div>
        )}

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
              No coupons yet. Sync from Shopify or add a valid coupon code above.
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
                      onClick={() => handleToggleCoupon(coupon.id, !coupon.isSelectable, coupon.code)}
                      className="flex items-center gap-2 cursor-pointer group select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          coupon.isSelectable
                            ? 'bg-[#FF6F00] border border-[#FF6F00] text-white shadow-2xs'
                            : 'bg-white border border-gray-300 group-hover:border-gray-400'
                        }`}
                      >
                        {coupon.isSelectable && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          coupon.isSelectable ? 'text-gray-900' : 'text-gray-700'
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

        {/* Footer of Card 3 */}
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
            className="rounded-lg h-10 px-4 border-gray-200 text-gray-800 font-semibold text-xs hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 shadow-2xs"
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
          onClick={handleContinue}
          className="rounded-lg h-10 px-6 bg-[#FF6F00] hover:bg-[#E66400] text-white font-semibold text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <span>Next: Targeting</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
