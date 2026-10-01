import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { apiService } from '../../utils/constants';
import { toast } from 'sonner';

export default function Targeting({
  wizardData = {},
  onBack,
  onComplete,
  selectedShop,
}) {
  const [activePlacement, setActivePlacement] = useState('PDP'); // 'PDP' | 'Mini' | 'Cart'
  const [saving, setSaving] = useState(false);
  const [restoredText, setRestoredText] = useState('Restored from this browser.');

  // Targeting fields state
  const [formData, setFormData] = useState({
    // PDP
    pdpWidgetAppendTarget: wizardData?.pdpWidgetAppendTarget || '.product__price',
    pdpWidgetPlacement: wizardData?.pdpWidgetPlacement || 'after',
    pdpSalePrice: wizardData?.pdpSalePrice || wizardData?.pdpPriceSelector || '.price-item--sale',
    pdpFallbackSelector: wizardData?.pdpFallbackSelector || '.price, [data-price]',
    pdpRerenderOnVariant: wizardData?.pdpRerenderOnVariant || 'on',

    // Mini Cart / Drawer
    minCartWidgetAppendTarget: wizardData?.minCartWidgetAppendTarget || wizardData?.cartDrawerWidgetAppendTarget || '',
    minCartWidgetPlacement: wizardData?.minCartWidgetPlacement || wizardData?.cartDrawerWidgetPlacement || 'after',
    minCartTotal: wizardData?.minCartTotal || wizardData?.cartDrawerTotal || '',
    minCartFallbackSelector: wizardData?.minCartFallbackSelector || '',

    // Cart Page
    cartWidgetAppendTarget: wizardData?.cartWidgetAppendTarget || '',
    cartWidgetPlacement: wizardData?.cartWidgetPlacement || 'after',
    cartTotal: wizardData?.cartTotal || '',
    cartFallbackSelector: wizardData?.cartFallbackSelector || '',

    // Exclusions
    excludedProducts: wizardData?.excludedProducts || '',
    excludedCollections: wizardData?.excludedCollections || '',
  });

  // Load from backend or localStorage on mount
  useEffect(() => {
    const shopId = selectedShop?.id || wizardData?.shopId;
    if (shopId) {
      apiService.getAutoSetup(shopId).then((res) => {
        if (res?.success && res.data) {
          const raw = res.data.metafield?.value || res.data;
          setFormData((prev) => ({
            ...prev,
            pdpWidgetAppendTarget: raw.pdpWidgetAppendTarget ?? prev.pdpWidgetAppendTarget,
            pdpWidgetPlacement: raw.pdpWidgetPlacement || prev.pdpWidgetPlacement,
            pdpSalePrice: raw.pdpSalePrice || raw.pdpPriceSelector || prev.pdpSalePrice,
            pdpFallbackSelector: raw.pdpFallbackSelector ?? prev.pdpFallbackSelector,
            pdpRerenderOnVariant: raw.pdpRerenderOnVariant || prev.pdpRerenderOnVariant,
            minCartWidgetAppendTarget: raw.minCartWidgetAppendTarget || raw.cartDrawerWidgetAppendTarget || '',
            minCartWidgetPlacement: raw.minCartWidgetPlacement || raw.cartDrawerWidgetPlacement || 'after',
            minCartTotal: raw.minCartTotal || raw.cartDrawerTotal || '',
            minCartFallbackSelector: raw.minCartFallbackSelector || '',
            cartWidgetAppendTarget: raw.cartWidgetAppendTarget || '',
            cartWidgetPlacement: raw.cartWidgetPlacement || 'after',
            cartTotal: raw.cartTotal || '',
            cartFallbackSelector: raw.cartFallbackSelector || '',
            excludedProducts: raw.excludedProducts || '',
            excludedCollections: raw.excludedCollections || '',
          }));
          setRestoredText('Loaded from store configuration.');
        }
      }).catch(() => {
        // Fallback to local storage if available
        try {
          const cached = localStorage.getItem(`snapmint_targeting_${shopId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.minCartWidgetAppendTarget === '.cart-drawer__footer') parsed.minCartWidgetAppendTarget = '';
            if (parsed.minCartTotal === '.cart-drawer__total') parsed.minCartTotal = '';
            if (parsed.minCartFallbackSelector === '.totals__total-value') parsed.minCartFallbackSelector = '';
            if (parsed.cartWidgetAppendTarget === '.cart__footer') parsed.cartWidgetAppendTarget = '';
            if (parsed.cartTotal === '.cart__subtotal') parsed.cartTotal = '';
            if (parsed.cartFallbackSelector === '.cart-total') parsed.cartFallbackSelector = '';
            setFormData(parsed);
            setRestoredText('Restored from this browser.');
          }
        } catch (_) {}
      });
    }
  }, [selectedShop?.id, wizardData?.shopId]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      const shopId = selectedShop?.id || wizardData?.shopId;
      if (shopId) {
        try {
          localStorage.setItem(`snapmint_targeting_${shopId}`, JSON.stringify(next));
        } catch (_) {}
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const shopId = selectedShop?.id || wizardData?.shopId;
    const myshopifyDomain = selectedShop?.myshopifyDomain || wizardData?.myshopifyDomain;

    const payload = {
      shopId,
      myshopifyDomain,
      ...formData,
      // Map both forms of cart drawer keys for full compatibility
      cartDrawerWidgetAppendTarget: formData.minCartWidgetAppendTarget,
      cartDrawerWidgetPlacement: formData.minCartWidgetPlacement,
      cartDrawerTotal: formData.minCartTotal,
    };

    try {
      if (shopId) {
        await apiService.updateAutoSetup(payload);
      }
      toast.success('Targeting configuration saved successfully!');
      if (onComplete) {
        onComplete(payload);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save targeting to server, saved locally.');
      if (onComplete) {
        onComplete(payload);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
          THE RIGHT PLACE FOR YOUR WIDGET
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Targeting
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-1">
          Set where your widget appears and reads the order value.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 text-xs text-[#1E3A8A] leading-relaxed">
        <p>
          <span className="font-bold">How it works:</span> per placement, where the widget injects, where it reads the price, and (on PDP) a variant-change hook. Independent of price bands.
        </p>
        <p className="text-[#2563EB] font-medium mt-1">
          ↳ Produces → the selectors written into the config file.
        </p>
      </div>

      {/* Placement Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Placement</h2>
        <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
          {['PDP', 'Mini', 'Cart'].map((tab) => {
            const isActive = activePlacement === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePlacement(tab)}
                className={`px-5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selectors · {activePlacement} Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900">
          Selectors · {activePlacement}
        </h2>

        {/* PDP Fields */}
        {activePlacement === 'PDP' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Inject at (CSS selector)
                </label>
                <input
                  type="text"
                  value={formData.pdpWidgetAppendTarget}
                  onChange={(e) => handleChange('pdpWidgetAppendTarget', e.target.value)}
                  placeholder=".product__price"
                  className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Position
                </label>
                <div className="relative">
                  <select
                    value={formData.pdpWidgetPlacement}
                    onChange={(e) => handleChange('pdpWidgetPlacement', e.target.value)}
                    className="w-full h-10 px-3.5 pr-8 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="after">After</option>
                    <option value="before">Before</option>
                    <option value="inside start">Inside start</option>
                    <option value="inside end">Inside end</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Read order value from
                </label>
                <input
                  type="text"
                  value={formData.pdpSalePrice}
                  onChange={(e) => handleChange('pdpSalePrice', e.target.value)}
                  placeholder=".price-item--sale"
                  className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Re-render on variant
                </label>
                <div className="relative">
                  <select
                    value={formData.pdpRerenderOnVariant}
                    onChange={(e) => handleChange('pdpRerenderOnVariant', e.target.value)}
                    className="w-full h-10 px-3.5 pr-8 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">
                Fallback selectors
              </label>
              <input
                type="text"
                value={formData.pdpFallbackSelector}
                onChange={(e) => handleChange('pdpFallbackSelector', e.target.value)}
                placeholder=".price, [data-price]"
                className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Mini Cart Fields */}
        {activePlacement === 'Mini' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Inject at (CSS selector)
                </label>
                <input
                  type="text"
                  value={formData.minCartWidgetAppendTarget}
                  onChange={(e) => handleChange('minCartWidgetAppendTarget', e.target.value)}
                  placeholder=".cart-drawer__footer"
                  className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Position
                </label>
                <div className="relative">
                  <select
                    value={formData.minCartWidgetPlacement}
                    onChange={(e) => handleChange('minCartWidgetPlacement', e.target.value)}
                    className="w-full h-10 px-3.5 pr-8 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="after">After</option>
                    <option value="before">Before</option>
                    <option value="inside start">Inside start</option>
                    <option value="inside end">Inside end</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">
                Read order value from
              </label>
              <input
                type="text"
                value={formData.minCartTotal}
                onChange={(e) => handleChange('minCartTotal', e.target.value)}
                placeholder=".cart-drawer__total"
                className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">
                Fallback selectors
              </label>
              <input
                type="text"
                value={formData.minCartFallbackSelector}
                onChange={(e) => handleChange('minCartFallbackSelector', e.target.value)}
                placeholder=".totals__total-value"
                className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Cart Fields */}
        {activePlacement === 'Cart' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Inject at (CSS selector)
                </label>
                <input
                  type="text"
                  value={formData.cartWidgetAppendTarget}
                  onChange={(e) => handleChange('cartWidgetAppendTarget', e.target.value)}
                  placeholder=".cart__footer"
                  className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">
                  Position
                </label>
                <div className="relative">
                  <select
                    value={formData.cartWidgetPlacement}
                    onChange={(e) => handleChange('cartWidgetPlacement', e.target.value)}
                    className="w-full h-10 px-3.5 pr-8 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="after">After</option>
                    <option value="before">Before</option>
                    <option value="inside start">Inside start</option>
                    <option value="inside end">Inside end</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">
                Read order value from
              </label>
              <input
                type="text"
                value={formData.cartTotal}
                onChange={(e) => handleChange('cartTotal', e.target.value)}
                placeholder=".cart__subtotal"
                className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">
                Fallback selectors
              </label>
              <input
                type="text"
                value={formData.cartFallbackSelector}
                onChange={(e) => handleChange('cartFallbackSelector', e.target.value)}
                placeholder=".cart-total"
                className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product / Collection Exclusions Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Product / collection exclusions
          </h2>
          <p className="text-[11px] text-gray-500 font-normal mt-0.5">
            SOW G-02 — the widget hides on excluded products/collections (plus any regulatory exclusion list). Comma-separated handles or IDs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 block">
              Excluded product handles / IDs
            </label>
            <input
              type="text"
              value={formData.excludedProducts}
              onChange={(e) => handleChange('excludedProducts', e.target.value)}
              placeholder="e.g. gift-card, clearance-item"
              className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 block">
              Excluded collections
            </label>
            <input
              type="text"
              value={formData.excludedCollections}
              onChange={(e) => handleChange('excludedCollections', e.target.value)}
              placeholder="e.g. regulated, alcohol"
              className="w-full h-10 px-3.5 text-xs text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-lg h-9 px-3.5 border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Coupons</span>
            </Button>
          )}
          <span className="text-xs text-gray-400">
            {restoredText}
          </span>
        </div>

        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-lg h-10 px-6 bg-[#FF6F00] hover:bg-[#E66400] text-white font-semibold text-xs cursor-pointer shadow-2xs transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save targeting'}
        </Button>
      </div>
    </div>
  );
}
