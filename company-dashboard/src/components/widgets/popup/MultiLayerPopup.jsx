import React from 'react';
import { CloseIcon, ClockIcon, formatRupee } from '../shared/PopupIcons';
import { ModalFooter, ModalFeatures } from '../shared/PopupFooter';
import TotalOrderValueCard, { calculateOrderDiscount } from './TotalOrderValueCard';
import PopupCornerRibbon from '../shared/PopupRibbons';
import ExpressBottomSection from '../shared/ExpressBottomSection';

export default function MultiLayerPopup({
  merchantName = "Neeman's",
  orderValue = 15000,
  downPaymentPercent = 25,
  eligibleTenures = [3, 6],
  popupType = 'info',
  showExpress = true,
  expressTab = 'name',
  onClose,
  customText,
  cashback,
  offers,
  rbi,
  coupons,
  appliedCoupon,
  onOpenCoupons,
}) {
  const { originalTotal, discountAmount, total } = calculateOrderDiscount(orderValue, appliedCoupon, 15000);
  const dp = Math.round((total * (downPaymentPercent || 25)) / 100);
  const remaining = total - dp;
  const tenures = Array.isArray(eligibleTenures) && eligibleTenures.length > 0 ? eligibleTenures : [3, 6];

  const topTitle = customText?.topTitle !== undefined ? customText.topTitle : 'Pay only';
  const rawAmountTitle = customText?.amountTitle !== undefined ? customText.amountTitle : '{amount} Now';
  const formattedDp = formatRupee(dp);
  const renderedAmountTitle = rawAmountTitle.includes('{amount}')
    ? rawAmountTitle.replace('{amount}', formattedDp)
    : (rawAmountTitle || `${formattedDp} Now`);

  const options = tenures.map((t, idx) => ({
    label: `Option ${idx + 1}`,
    tenure: t,
    monthlyAmount: Math.round(remaining / t),
  }));

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
        <p className="snp-rest-subtitle" data-snp-el="rest-subtitle">rest later in</p>
        {showOfferText && (
          <div className="snp-discount-banner" data-snp-el="offer-banner">
            <span className="snp-discount-highlight">Extra 5% Off</span> - Auto Applied on<br />Payment with Snapmint
          </div>
        )}
      </div>

      {/* Inner Box with Multi-plan Options */}
      <div className="snp-inner-box" data-snp-el="inner-box">
        <div className="snp-options-title">EMI options</div>
        <div className="snp-cards-grid">
          {options.map((opt, i) => (
            <div key={i} className="snp-card-col">
              <div className="snp-option-label" data-snp-el={`card-label-${i + 1}`}>{opt.label}</div>
              <div className={`snp-card ${i === 0 ? 'snp-card-active' : ''}`} data-snp-el={i === 0 ? 'card-active' : `card-${i + 1}`}>
                <button type="button" className="snp-card-badge-top" data-snp-el="pay-now-badge">0% EMI</button>
                <div className="snp-card-price" data-snp-el={`card-price-${i + 1}`}>{formatRupee(opt.monthlyAmount)}</div>
                <div className="snp-card-divider"></div>
                <div className="snp-card-duration">x {opt.tenure} mon</div>
              </div>
            </div>
          ))}
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
