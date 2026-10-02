import React from 'react';
import { ChevronRightIcon, formatRupee, RosettePercentBadge } from '../shared/PopupIcons';

// Single shared discount calculator for all popups
export function calculateOrderDiscount(orderValue, appliedCoupon, fallback = 15000) {
  const originalTotal = Number(orderValue) || fallback;
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount =
      appliedCoupon.discountType === 'PERCENTAGE'
        ? Math.round((originalTotal * (Number(appliedCoupon.discountValue) || 10)) / 100)
        : Math.min(originalTotal, Number(appliedCoupon.discountValue) || 200);
  }
  return { originalTotal, discountAmount, total: Math.max(0, originalTotal - discountAmount) };
}

export default function TotalOrderValueCard({
  total,
  originalTotal,
  appliedCoupon,
  coupons,
  discountAmount,
  onOpenCoupons,
}) {
  const iconColor = coupons?.couponIconColour || 'var(--snp-color-coupon-icon, #BE185D)';
  const stripBg = coupons?.stripFillColour || 'var(--snp-color-coupon-strip-fill, #FDF2F7)';
  const stripText = coupons?.stripTextColour || 'var(--snp-color-coupon-strip-text, #151E29)';

  const discount =
    discountAmount ??
    (appliedCoupon ? calculateOrderDiscount(originalTotal ?? total, appliedCoupon).discountAmount : 0);
  const displayTotal = total ?? Math.max(0, (originalTotal ?? 15000) - discount);

  return (
    <div
      className="snp-total-card cursor-pointer select-none"
      data-snp-el="total-card"
      role="button"
      tabIndex={0}
      onClick={onOpenCoupons}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenCoupons?.()}
    >
      {appliedCoupon ? (
        <div className="flex flex-col gap-1.5 text-xs italic">
          {/* Row 1: Sub Total */}
          <div className="flex items-center justify-between text-[#64768B]">
            <span>Sub Total</span>
            <span className="font-medium text-[#1E293B]">{formatRupee(originalTotal ?? displayTotal)}</span>
          </div>

          {/* Row 2: Applied Coupon Breakdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#1E293B] font-medium not-italic">
              <RosettePercentBadge color={iconColor} size={15} />
              <span className="italic">‘{appliedCoupon.code}’ Coupon Applied</span>
            </div>
            <span className="font-semibold text-emerald-600">- {formatRupee(discount)}</span>
          </div>

          {/* Row 3: Total Order Value */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="font-semibold text-[#1E293B]">Total Order Value</span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-extrabold text-[#0F172A]">{formatRupee(displayTotal)}</span>
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="snp-total-row" data-snp-el="total-row">
            <span className="snp-total-text" data-snp-el="total-label">Total Order Value</span>
            <div className="snp-total-right">
              <span className="snp-total-amount" data-snp-el="total-price">{formatRupee(displayTotal)}</span>
              <ChevronRightIcon />
            </div>
          </div>

          {Boolean(coupons?.enabled) && (
            <div
              className="snp-coupon-row mt-2 py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-opacity"
              data-snp-el="coupon-strip"
              style={{ backgroundColor: stripBg, color: stripText }}
            >
              <div className="flex items-center gap-1.5">
                <RosettePercentBadge color={iconColor} size={15} />
                <span className="text-[11px] font-semibold italic">Coupon and Offers</span>
              </div>
              <span className="text-xs font-bold">›</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
