import React from 'react';
import { CloseIcon, ClockIcon, formatRupee } from '../shared/PopupIcons';
import { ModalFooter, ModalFeatures } from '../shared/PopupFooter';
import TotalOrderValueCard, { calculateOrderDiscount } from './TotalOrderValueCard';
import PopupCornerRibbon from '../shared/PopupRibbons';
import ExpressBottomSection from '../shared/ExpressBottomSection';

export default function FixedDepositPopup({
  merchantName = "Neeman's",
  orderValue = 800,
  fixedDp = 1,
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
