import React from 'react';
import { CloseIcon, ClockIcon, ChevronRightIcon, PopupFooter, EligibilityFooter, formatRupee } from './PopupIcons';
import TotalOrderValueCard, { calculateOrderDiscount } from './TotalOrderValueCard';

export default function FixedDepositPopup({
  merchantName = "Neeman's",
  orderValue = 800,
  fixedDp = 1,
  tenure = 3,
  popupType = 'info',
  onClose,
  customText,
  cashback,
  offers,
  coupons,
  appliedCoupon,
  onOpenCoupons,
  rbi,
}) {
  const { originalTotal, discountAmount, total } = calculateOrderDiscount(orderValue, appliedCoupon, 800);
  const dpAmount = fixedDp !== undefined ? Number(fixedDp) : 1;
  const remainingCount = Math.max(1, (tenure || 3) - 1);
  const perEmi = Math.round((total - dpAmount) / remainingCount);

  const topTitle = customText?.topTitle !== undefined ? customText.topTitle : 'Pay only';
  const rawAmountTitle = customText?.amountTitle !== undefined ? customText.amountTitle : '{amount} Now';
  const formattedDp = `${formatRupee(dpAmount)}*`;
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
  const ribbonLabel = showCashback && showOffers ? 'Snapmint' : 'Cashback';

  return (
    <div className="snp-modal" data-snp-el="popup-bg">
      {/* 10% Cashback Corner Ribbon */}
      {showCashback && (
        <div className="snp-corner-ribbon-wrapper">
          <div className="snp-corner-ribbon" style={{ backgroundColor: 'var(--snp-color-cashback-ribbon-bg, #D1F4FC)' }}>
            <svg className="snp-coin-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.2894 21.2898C25.2086 17.3705 25.2086 11.0162 21.2894 7.0969C17.3701 3.17763 11.0157 3.17764 7.09646 7.0969C3.17719 11.0162 3.17719 17.3705 7.09645 21.2898C11.0157 25.2091 17.3701 25.2091 21.2894 21.2898Z" fill="url(#fd_paint0_linear)" />
              <path d="M8.61213 8.85662C11.5595 5.90924 16.3382 5.90922 19.2856 8.8566C22.233 11.804 22.233 16.5827 19.2856 19.5301C16.3383 22.4775 11.5595 22.4775 8.61212 19.5301C5.66475 16.5827 5.66477 11.804 8.61213 8.85662Z" fill="url(#fd_paint1_linear)" fillOpacity="0.4" stroke="url(#fd_paint2_linear)" strokeWidth="0.73" />
              <path d="M14.3337 9.28561L14.9101 11.1373C13.8278 11.4603 12.9733 11.9036 12.4869 12.3899C12.1518 12.7251 12.0437 13.0927 12.3147 13.3636C13.1168 14.1657 15.7969 10.7053 17.8235 12.7544C19.0266 13.9575 18.6396 15.6666 17.2341 17.0722C16.2612 18.045 15.039 18.7037 13.7943 18.8646L13.1967 17.0776C14.3221 16.8842 15.3389 16.3878 15.9875 15.7392C16.3552 15.3715 16.4953 14.9715 16.2243 14.7005C15.3679 13.8441 12.7963 17.3046 10.7587 15.2451C9.55565 14.042 9.92137 12.3755 11.2726 11.0243C12.1159 10.181 13.1973 9.57645 14.3337 9.28561Z" fill="url(#fd_paint3_linear)" />
              <defs>
                <linearGradient id="fd_paint0_linear" x1="13.1466" y1="3.29088" x2="14.5265" y2="25.1716" gradientUnits="userSpaceOnUse">
                  <stop offset="0.387" stopColor="#FFE300" />
                  <stop offset="0.833" stopColor="#FFA700" />
                </linearGradient>
                <linearGradient id="fd_paint1_linear" x1="13.1239" y1="5.59715" x2="14.2119" y2="22.8493" gradientUnits="userSpaceOnUse">
                  <stop offset="0.283" stopColor="#FFE300" />
                  <stop offset="0.48" stopColor="white" />
                  <stop offset="0.812" stopColor="#FFA700" />
                </linearGradient>
                <linearGradient id="fd_paint2_linear" x1="9.58" y1="0.4" x2="16.67" y2="26.74" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFBC00" />
                  <stop offset="1" stopColor="#FFBC00" />
                </linearGradient>
                <linearGradient id="fd_paint3_linear" x1="14.54" y1="17.66" x2="12.46" y2="11.02" gradientUnits="userSpaceOnUse">
                  <stop offset="0.01" stopColor="#EB6C01" />
                  <stop offset="0.585" stopColor="#FFA400" />
                </linearGradient>
              </defs>
            </svg>
            <div className="snp-ribbon-content">
              <span className="snp-ribbon-title" style={{ color: 'var(--snp-color-cashback-ribbon-text, #0b1f33)' }}>10% {ribbonLabel}</span>
              <span className="snp-ribbon-sub" style={{ color: 'var(--snp-color-cashback-ribbon-text, #0b1f33)' }}>Cashback <small className="snp-ribbon-tnc">T&C</small></span>
            </div>
          </div>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button type="button" className="snp-close-btn" aria-label="Close" onClick={onClose}>
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

      {/* Inner Box with 3 Fixed DP Cards */}
      <div className="snp-inner-box" data-snp-el="inner-box">
        <div className="snp-cards-grid">
          {/* Card 1: Today Active */}
          <div className="snp-card snp-card-active" data-snp-el="card-active">
            <div className="snp-card-label" data-snp-el="card-label-1" style={{ color: 'var(--snp-color-primary, #ff6f00)', fontWeight: 800 }}>TODAY</div>
            <div className="snp-card-price" data-snp-el="card-price-1" style={{ color: 'var(--snp-color-primary, #ff6f00)' }}>{formatRupee(dpAmount)}</div>
            <button type="button" className="snp-card-badge" data-snp-el="pay-now-badge">Pay Now</button>
          </div>

          {/* Card 2: 2nd Month */}
          <div className="snp-card" data-snp-el="card-2">
            <div className="snp-card-label" data-snp-el="card-label-2">3rd May</div>
            <div className="snp-card-price" data-snp-el="card-price-2">{formatRupee(perEmi)}</div>
          </div>

          {/* Card 3: 3rd Month */}
          <div className="snp-card" data-snp-el="card-3">
            <div className="snp-card-label" data-snp-el="card-label-3">3rd Jun</div>
            <div className="snp-card-price" data-snp-el="card-price-3">{formatRupee(perEmi)}</div>
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
      <div className="snp-features-grid" data-snp-el="features">
        <div className="snp-feature-item" data-snp-el="feature-1">
          <span className="snp-feature-line">0% Interest</span>
          <span className="snp-feature-line">Installments</span>
        </div>
        <div className="snp-feature-divider"></div>
        <div className="snp-feature-item" data-snp-el="feature-2">
          <span className="snp-feature-line">0 Extra</span>
          <span className="snp-feature-line">Cost</span>
        </div>
        <div className="snp-feature-divider"></div>
        <div className="snp-feature-item" data-snp-el="feature-3">
          <span className="snp-feature-line">UPI + Cards</span>
          <span className="snp-feature-line">Accepted</span>
        </div>
      </div>

      {/* Offer Disclaimer */}
      {showOfferNote && (
        <p className="snp-offer-note" data-snp-el="offer-note" style={{ color: 'var(--snp-color-offer-note-custom, var(--snp-color-offer-note))' }}>{offerNoteText}</p>
      )}

      {/* Footer Area according to popupType */}
      {popupType === 'eligibility-payment' || popupType === 'eligibility-emi' ? (
        <EligibilityFooter
          popupType={popupType}
          merchantName={merchantName}
          rbi={rbi}
        />
      ) : (
        <PopupFooter rbi={rbi} />
      )}
    </div>
  );
}
