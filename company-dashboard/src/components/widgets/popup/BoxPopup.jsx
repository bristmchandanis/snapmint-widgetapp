import React from 'react';
import { CloseIcon, ClockIcon, formatRupee } from '../shared/PopupIcons';
import { ModalFooter, ModalFeatures } from '../shared/PopupFooter';
import TotalOrderValueCard, { calculateOrderDiscount } from './TotalOrderValueCard';

export default function BoxPopup({
  merchantName = "Neeman's",
  orderValue = 2317,
  downPaymentPercent = 50,
  tenure = 12,
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
  const { originalTotal, discountAmount, total } = calculateOrderDiscount(orderValue, appliedCoupon, 2317);
  const dp = Math.round((total * (downPaymentPercent || 50)) / 100);
  const remaining = total - dp;
  const activeTenure = Number(tenure) || 12;
  const perEmi = Math.round(remaining / activeTenure);

  const topTitle = customText?.topTitle !== undefined ? customText.topTitle : 'Pay only';
  const rawAmountTitle = customText?.amountTitle !== undefined ? customText.amountTitle : '{amount} Now';
  const formattedDp = formatRupee(dp);
  const renderedAmountTitle = rawAmountTitle.includes('{amount}')
    ? rawAmountTitle.replace('{amount}', formattedDp)
    : (rawAmountTitle || `${formattedDp} Now`);

  const showOffers = offers?.enabled !== false;
  const showDealTag = showOffers && offers?.limitedTimeDealTag !== false;
  const showOfferRibbon = showOffers && offers?.offerRibbon !== false;
  const showOfferNote = showOffers && offers?.offerNote !== false;
  const offerNoteText = offers?.offerNoteText || 'Offer will change for order value greater than ₹3000 and users with no credit history. *T&C';

  return (
    <div className="snp-modal" data-snp-el="popup-bg">
      {/* Corner Serrated Extra 5% Off Ribbon */}
      {showOfferRibbon && (
        <div className="snp-extra-off-wrapper">
          <div className="snp-extra-off-ribbon">
            <span className="snp-extra-off-text">EXTRA 5% OFF</span>
          </div>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button type="button" className="snp-close-btn" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
      )}

      {/* Header Title */}
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
      </div>

      {/* Inner Gray Container with Single Centered Box */}
      <div className="snp-inner-box" data-snp-el="inner-box">
        <div className="snp-cards-grid" style={{ justifyContent: 'center' }}>
          <div className="snp-card snp-card-single snp-card-active" data-snp-el="card-active" style={{ maxWidth: '150px' }}>
            <button type="button" className="snp-card-badge-top" data-snp-el="pay-now-badge">0% EMI</button>
            <div className="snp-card-price" data-snp-el="card-price-1">{formatRupee(perEmi)}</div>
            <div className="snp-card-divider"></div>
            <div className="snp-card-duration">x {activeTenure} mon</div>
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

      {/* Features Summary */}
      <ModalFeatures />

      {/* Offer Disclaimer Note */}
      {showOfferNote && (
        <p className="snp-offer-note" data-snp-el="offer-note" style={{ color: 'var(--snp-color-offer-note-custom, var(--snp-color-offer-note))' }}>{offerNoteText}</p>
      )}

      {/* Footer Area according to popupType */}
      <ModalFooter popupType={popupType} merchantName={merchantName} rbi={rbi} />
    </div>
  );
}
