import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Info } from 'lucide-react';
import { RosettePercentBadge } from '../shared/PopupIcons';
import { calculateOrderDiscount } from './TotalOrderValueCard';

const DEFAULT_COUPONS = [
  { id: 10, code: 'BEST30', title: 'Best Deal 10% Discount', discountType: 'PERCENTAGE', discountValue: 10, isSelectable: true },
  { id: 2, code: 'WELCOME10', title: 'New Customer 10% Discount', discountType: 'PERCENTAGE', discountValue: 10 },
  { id: 6, code: 'SUMMER24', title: 'Summer 2024 Discount', discountType: 'PERCENTAGE', discountValue: 12 },
  { id: 5, code: 'MONSOON', title: 'Monsoon Seasonal 8%', discountType: 'PERCENTAGE', discountValue: 8 },
  { id: 4, code: 'ARCHIVE22', title: 'Archive ₹50 Off', discountType: 'FIXED_AMOUNT', discountValue: 50 },
  { id: 3, code: 'RAJ_YT', title: 'YouTube Creator Offer 15%', discountType: 'PERCENTAGE', discountValue: 15 },
  { id: 1, code: 'FEST200', title: 'Festival ₹200 Off', discountType: 'FIXED_AMOUNT', discountValue: 200 },
];

export default function CouponListPopup({
  coupons: couponStyles = {},
  couponList = DEFAULT_COUPONS,
  initialOrderValue = 15000,
  appliedCoupon = null,
  onClose,
  onApply,
}) {
  const btnColor = couponStyles.listButtonColour || 'var(--snp-color-coupon-btn, #FF6F00)';
  const btnTextColor = couponStyles.listButtonTextColour || 'var(--snp-color-coupon-btn-text, #FFFFFF)';
  const navIconColor = couponStyles.listNavIcons || 'var(--snp-color-coupon-nav-icons, #64768B)';
  const iconColor = couponStyles.couponIconColour || 'var(--snp-color-coupon-icon, #BE185D)';

  const [inputCode, setInputCode] = useState('');
  const [applied, setApplied] = useState(appliedCoupon);

  useEffect(() => {
    setApplied(appliedCoupon);
  }, [appliedCoupon]);

  const handleToggle = (coupon) => {
    const next = applied?.code === coupon.code ? null : coupon;
    setApplied(next);
    onApply?.(next);
  };

  const handleApplyInput = (e) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    if (!clean) return;
    const found = couponList.find((c) => c.code.toUpperCase() === clean) || {
      code: clean,
      discountType: 'PERCENTAGE',
      discountValue: 10,
    };
    setApplied(found);
    onApply?.(found);
  };

  const { originalTotal: productPrice, discountAmount, total: totalOrderValue } =
    calculateOrderDiscount(initialOrderValue, applied, 15000);
  const formatRupee = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div
      className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden w-full max-w-[390px] animate-in fade-in duration-200"
      style={{ boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.15)', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="p-1 -ml-1 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
          style={{ color: navIconColor }}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <h2 className="text-base font-bold italic text-[#0F172A] tracking-tight">Coupons</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 -mr-1 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
          style={{ color: navIconColor }}
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Price Breakdown */}
      <div className="px-5 pb-3 pt-1 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="italic text-[#334155]">Product Price</span>
          <span className="italic font-semibold text-[#0F172A]">{formatRupee(productPrice)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="italic text-[#334155]">Delivery Fee</span>
            <Info className="w-3.5 h-3.5 text-[#64768B] inline cursor-pointer" />
          </div>
          <span className="italic text-[#334155] font-medium">Free</span>
        </div>
        {applied && (
          <div className="flex items-center justify-between text-xs text-emerald-600">
            <span className="italic font-medium">Coupon Discount ({applied.code})</span>
            <span className="italic font-bold">-{formatRupee(discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="italic font-bold text-[#0F172A]">Total Order Value</span>
          <span className="italic font-bold text-sm text-[#0F172A]">{formatRupee(totalOrderValue)}</span>
        </div>
      </div>

      {/* Code Input Form */}
      <form onSubmit={handleApplyInput} className="px-5 pt-1 pb-4 flex items-center gap-2.5">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter Coupon Code"
          className="flex-1 h-10 px-3.5 border border-[#CBD5E1] rounded-lg text-xs italic text-[#0F172A] placeholder:italic placeholder:text-[#64768B] focus:outline-none focus:border-gray-400 bg-white"
        />
        <button
          type="submit"
          disabled={!inputCode.trim()}
          className="h-10 px-5 text-xs font-bold italic rounded-lg transition-all cursor-pointer shadow-2xs active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: btnColor, color: btnTextColor }}
        >
          Apply
        </button>
      </form>

      {/* Coupon List */}
      <div className="px-5 pb-5 space-y-3 max-h-[380px] overflow-y-auto">
        {couponList.map((coupon, idx) => {
          const isApplied = applied?.code === coupon.code;
          return (
            <div
              key={`${coupon.code}-${idx}`}
              className={`p-3.5 rounded-xl border transition-all ${isApplied ? 'border-orange-300 bg-orange-50/20 shadow-2xs' : 'border-[#CBD5E1] bg-white hover:border-gray-400'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RosettePercentBadge color={iconColor} size={18} />
                    <span className="font-bold italic text-sm text-[#0F172A] tracking-wide">{coupon.code}</span>
                    {coupon.isSelectable && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        Turned On
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] italic text-[#334155] leading-snug pl-0.5">{coupon.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(coupon)}
                  className="font-bold italic text-xs pt-0.5 cursor-pointer hover:opacity-85 transition-opacity shrink-0"
                  style={{ color: isApplied ? '#16A34A' : btnColor }}
                >
                  {isApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
