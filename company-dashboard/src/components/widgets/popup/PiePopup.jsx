import React from 'react';
import { CloseIcon, ClockIcon, formatRupee } from '../shared/PopupIcons';
import { ModalFooter, ModalFeatures } from '../shared/PopupFooter';
import TotalOrderValueCard, { calculateOrderDiscount } from './TotalOrderValueCard';
import PopupCornerRibbon from '../shared/PopupRibbons';
import ExpressBottomSection from '../shared/ExpressBottomSection';

export default function PiePopup({
  merchantName = "Neeman's",
  orderValue = 1200,
  downPaymentPercent = 33,
  tenure = 3,
  popupType = 'info',
  showExpress = true,
  expressTab = 'name',
  onClose,
  customText,
  cashback,
  offers,
  coupons,
  appliedCoupon,
  onOpenCoupons,
  rbi,
}) {
  const { originalTotal, discountAmount, total } = calculateOrderDiscount(orderValue, appliedCoupon, 1200);
  const dp = Math.round((total * (downPaymentPercent || 33)) / 100);
  const remainingCount = Math.max(1, (tenure || 3) - 1);
  const perEmi = Math.round((total - dp) / remainingCount);

  const topTitle = customText?.topTitle !== undefined ? customText.topTitle : 'Pay only';
  const rawAmountTitle = customText?.amountTitle !== undefined ? customText.amountTitle : '{amount} Now';
  const formattedDp = formatRupee(dp);
  const renderedAmountTitle = rawAmountTitle.includes('{amount}')
    ? rawAmountTitle.replace('{amount}', formattedDp)
    : (rawAmountTitle || `${formattedDp} Now`);



  const showCashback = cashback?.enabled !== false;
  const showOffers = offers?.enabled !== false;
  const showDealTag = showOffers && offers?.limitedTimeDealTag !== false;
  const showOfferRibbon = showOffers && offers?.offerRibbon !== false;
  const showOfferText = showOffers && offers?.offerText !== false;
  const showOfferNote = showOffers && offers?.offerNote !== false;
  const offerNoteText = offers?.offerNoteText || 'Offer will change for order value greater than ₹3000 and users with no credit history. *T&C';

  // Ribbon label: both = Snapmint, only cashback = Cashback
  const ribbonLabel = showCashback && showOffers ? 'Snapmint' : 'Cashback';

  return (
    <div className="snp-modal" data-snp-el="popup-bg">
      {/* Corner Ribbon */}
      <PopupCornerRibbon
        showCashback={showCashback}
        showOfferRibbon={!showCashback && showOfferRibbon}
        ribbonLabel={ribbonLabel}
        merchantName={merchantName}
        showOffers={showOffers}
      />

      {/* Close Button */}
      {onClose && (
        <button type="button" className="snp-close-btn" data-snp-el="close-btn" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
      )}

      {/* Header */}
      <div className="snp-header" data-snp-el="header">
        {showDealTag && (
          <div className="snp-deal-badge" data-snp-el="deal-badge">
            <ClockIcon />
            <span className="snp-deal-text">LIMITED TIME DEAL</span>
          </div>
        )}
        <p className="snp-subtitle" data-snp-el="subtitle">{topTitle}</p>
        <h1 className="snp-amount-highlight" data-snp-el="amount-highlight"><span className="snp-active">{renderedAmountTitle}</span></h1>
        {showOfferText && (
          <div className="snp-discount-banner" data-snp-el="offer-banner">
            <span className="snp-discount-highlight">Extra 5% Off</span> - Auto Applied on<br />Payment with Snapmint
          </div>
        )}
      </div>

      {/* Inner Box with 3 Pie Cards */}
      <div className="snp-inner-box" data-snp-el="inner-box">
        <div className="snp-cards-grid">
          {/* Card 1: Today Active with Exact Merchant DS SVG */}
          <div className="snp-card snp-card-active" data-snp-el="card-active">
            <div className="snp-pie-container" data-snp-el="pie-1">
              <svg className="snp-pie-svg" xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
                <g filter="url(#pie_filter_active)">
                  <circle cx="30.0132" cy="30.014" r="26.0309" transform="rotate(-18.1595 30.0132 30.014)" fill="var(--snp-color-primary, #FF6F00)" />
                </g>
                <circle cx="30.3437" cy="30.0137" r="24.5" fill="#F1F5F9" />
                <path d="M30.3438 5.51369C34.6401 5.51369 38.8608 6.64346 42.5826 8.78966C46.3045 10.9359 49.3965 14.023 51.5485 17.7415C53.7006 21.4599 54.837 25.6789 54.8437 29.9752C54.8505 34.2715 53.7273 38.494 51.587 42.2192L30.3438 30.0137L30.3438 5.51369Z" fill="var(--snp-color-primary, #FF6F00)" />
                <circle cx="30.6929" cy="29.7515" r="4.7066" fill="white" />
                <path d="M30.9561 5.51367V30.2331" stroke="white" strokeWidth="1.29207" />
                <path d="M30.3448 30.4102L9.35156 42.5959" stroke="white" strokeWidth="1.29207" />
                <path d="M29.5342 29.3018C30.7742 29.3018 44.1903 37.6511 51.5961 42.1372" stroke="white" strokeWidth="1.29207" />
                <defs>
                  <filter id="pie_filter_active" x="-0.000022" y="0.000954" width="67.9776" height="67.9776" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3.97561" dy="3.97561" />
                    <feGaussianBlur stdDeviation="3.97561" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0352941 0 0 0 0 0.176471 0 0 0 0 0.290196 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="snp-card-price" data-snp-el="card-price-1">{formatRupee(dp)}</div>
            <div className="snp-card-label" data-snp-el="card-label-1">Today</div>
            <button type="button" className="snp-card-badge" data-snp-el="pay-now-badge">Pay Now</button>
          </div>

          {/* Card 2: 2nd Slice Exact Merchant DS SVG */}
          <div className="snp-card" data-snp-el="card-2">
            <div className="snp-pie-container" data-snp-el="pie-2">
              <svg className="snp-pie-svg" xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
                <g filter="url(#pie_filter_slice2)">
                  <circle cx="30.0132" cy="30.014" r="26.0309" transform="rotate(-18.1595 30.0132 30.014)" fill="white" />
                </g>
                <circle cx="30.3438" cy="30.0137" r="24.5" fill="#F1F5F9" />
                <path d="M30.3438 5.51367C34.64 5.51367 38.8608 6.64344 42.5826 8.78964C46.3045 10.9358 49.3965 14.023 51.5485 17.7415C53.7006 21.4599 54.837 25.6789 54.8437 29.9752C54.8505 34.2715 53.7273 38.494 51.587 42.2192L30.3438 30.0137L30.3438 5.51367Z" fill="#151E29" />
                <path d="M51.8249 41.8595C49.7345 45.653 46.6758 48.8245 42.9605 51.0509C39.2451 53.2773 35.006 54.4789 30.675 54.5334C26.3439 54.5878 22.0759 53.4931 18.3058 51.3608C14.5357 49.2285 11.3982 46.1348 9.21315 42.395L30.367 30.0353L51.8249 41.8595Z" fill="#151E29" />
                <path d="M29.2031 29.3018C30.46 29.3018 44.4878 37.8984 51.994 42.437" stroke="white" strokeWidth="1.29207" />
                <circle cx="30.3619" cy="29.7515" r="4.7066" fill="white" />
                <path d="M30.625 5.16602V29.8855" stroke="white" strokeWidth="1.29207" />
                <path d="M30.0136 30.4102L8.82617 42.733" stroke="white" strokeWidth="1.29207" />
                <defs>
                  <filter id="pie_filter_slice2" x="-0.000024" y="0.000953" width="67.9776" height="67.9776" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3.97561" dy="3.97561" />
                    <feGaussianBlur stdDeviation="3.97561" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0352941 0 0 0 0 0.176471 0 0 0 0 0.290196 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_s2" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_s2" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="snp-card-price" data-snp-el="card-price-2">{formatRupee(perEmi)}</div>
            <div className="snp-card-label" data-snp-el="card-label-2">3rd May</div>
          </div>

          {/* Card 3: 3rd Slice Exact Merchant DS SVG */}
          <div className="snp-card" data-snp-el="card-3">
            <div className="snp-pie-container" data-snp-el="pie-3">
              <svg className="snp-pie-svg" xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
                <g filter="url(#pie_filter_slice3)">
                  <circle cx="30.0132" cy="30.014" r="26.0309" transform="rotate(-18.1595 30.0132 30.014)" fill="white" />
                </g>
                <circle cx="29.6807" cy="30.0137" r="24.5" fill="#E2E8F0" />
                <path d="M29.6807 5.51367C33.977 5.51367 38.1977 6.64344 41.9196 8.78964C45.6414 10.9358 48.7334 14.023 50.8854 17.7415C53.0375 21.4599 54.1739 25.6789 54.1806 29.9752C54.1874 34.2715 53.0642 38.494 50.9239 42.2192L29.6807 30.0137L29.6807 5.51367Z" fill="#151E29" />
                <path d="M51.1618 41.8595C49.0714 45.653 46.0127 48.8245 42.2974 51.0509C38.582 53.2773 34.3429 54.4789 30.0119 54.5334C25.6809 54.5878 21.4128 53.4931 17.6427 51.3608C13.8726 49.2285 10.7351 46.1348 8.55007 42.395L29.704 30.0353L51.1618 41.8595Z" fill="#151E29" />
                <path d="M30.2448 5.59471C25.9143 5.50828 21.6383 6.57142 17.8525 8.67581C14.0667 10.7802 10.9065 13.8506 8.69387 17.5741C6.48122 21.2977 5.29526 25.5413 5.25682 29.8724C5.21839 34.2036 6.32886 38.4676 8.47507 42.2298L29.7559 30.0898L30.2448 5.59471Z" fill="#151E29" />
                <path d="M29.6299 5.51367V30.2331" stroke="white" strokeWidth="1.29207" />
                <path d="M29.8477 29.4678L50.9991 43.4309" stroke="white" strokeWidth="1.29207" />
                <path d="M29.8471 29.9648C21.5729 34.7772 16.5349 37.6248 8.26074 42.4372" stroke="white" strokeWidth="1.29207" />
                <circle cx="30.3609" cy="29.7515" r="4.7066" fill="white" />
                <defs>
                  <filter id="pie_filter_slice3" x="-0.000024" y="0.000953" width="67.9776" height="67.9776" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3.97561" dy="3.97561" />
                    <feGaussianBlur stdDeviation="3.97561" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0352941 0 0 0 0 0.176471 0 0 0 0 0.290196 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_s3" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_s3" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="snp-card-price" data-snp-el="card-price-3">{formatRupee(perEmi)}</div>
            <div className="snp-card-label" data-snp-el="card-label-3">3rd Jun</div>
          </div>
        </div>

        {/* Total Order Value */}
        <TotalOrderValueCard
          total={total}
          originalTotal={originalTotal}
          appliedCoupon={appliedCoupon}
          coupons={coupons}
          discountAmount={discountAmount}
          onOpenCoupons={onOpenCoupons}
        />
      </div>

      {/* Features Grid */}
      <ModalFeatures />

      {/* Offer Disclaimer */}
      {showOfferNote && (
        <p className="snp-offer-note" data-snp-el="offer-note" style={{ color: 'var(--snp-color-offer-note-custom, var(--snp-color-offer-note))' }}>{offerNoteText}</p>
      )}

      {/* Express Bottom Section */}
      {showExpress && popupType === 'express' && (
        <ExpressBottomSection
          merchantName={merchantName}
          expressTab={expressTab}
          customText={customText}
        />
      )}

      {/* Footer Area according to popupType */}
      <ModalFooter popupType={popupType} merchantName={merchantName} rbi={rbi} />
    </div>
  );
}
