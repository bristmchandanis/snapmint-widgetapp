import React, { memo } from 'react';

// Single shared coin icon with SVG gradients
export const CashbackCoinIcon = memo(function CashbackCoinIcon({ className = 'snp-coin-icon' }) {
  return (
    <svg className={className} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.2894 21.2898C25.2086 17.3705 25.2086 11.0162 21.2894 7.0969C17.3701 3.17763 11.0157 3.17764 7.09646 7.0969C3.17719 11.0162 3.17719 17.3705 7.09645 21.2898C11.0157 25.2091 17.3701 25.2091 21.2894 21.2898Z" fill="url(#snp_coin_p0)" />
      <path d="M8.61213 8.85662C11.5595 5.90924 16.3382 5.90922 19.2856 8.8566C22.233 11.804 22.233 16.5827 19.2856 19.5301C16.3383 22.4775 11.5595 22.4775 8.61212 19.5301C5.66475 16.5827 5.66477 11.804 8.61213 8.85662Z" fill="url(#snp_coin_p1)" fillOpacity="0.4" stroke="url(#snp_coin_p2)" strokeWidth="0.73" />
      <path d="M14.3337 9.28561L14.9101 11.1373C13.8278 11.4603 12.9733 11.9036 12.4869 12.3899C12.1518 12.7251 12.0437 13.0927 12.3147 13.3636C13.1168 14.1657 15.7969 10.7053 17.8235 12.7544C19.0266 13.9575 18.6396 15.6666 17.2341 17.0722C16.2612 18.045 15.039 18.7037 13.7943 18.8646L13.1967 17.0776C14.3221 16.8842 15.3389 16.3878 15.9875 15.7392C16.3552 15.3715 16.4953 14.9715 16.2243 14.7005C15.3679 13.8441 12.7963 17.3046 10.7587 15.2451C9.55565 14.042 9.92137 12.3755 11.2726 11.0243C12.1159 10.181 13.1973 9.57645 14.3337 9.28561Z" fill="url(#snp_coin_p3)" />
      <defs>
        <linearGradient id="snp_coin_p0" x1="13.1466" y1="3.29088" x2="14.5265" y2="25.1716" gradientUnits="userSpaceOnUse">
          <stop offset="0.387" stopColor="#FFE300" />
          <stop offset="0.833" stopColor="#FFA700" />
        </linearGradient>
        <linearGradient id="snp_coin_p1" x1="13.1239" y1="5.59715" x2="14.2119" y2="22.8493" gradientUnits="userSpaceOnUse">
          <stop offset="0.283" stopColor="#FFE300" />
          <stop offset="0.48" stopColor="white" />
          <stop offset="0.812" stopColor="#FFA700" />
        </linearGradient>
        <linearGradient id="snp_coin_p2" x1="9.58" y1="0.4" x2="16.67" y2="26.74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFBC00" />
          <stop offset="1" stopColor="#FFBC00" />
        </linearGradient>
        <linearGradient id="snp_coin_p3" x1="14.54" y1="17.66" x2="12.46" y2="11.02" gradientUnits="userSpaceOnUse">
          <stop offset="0.01" stopColor="#EB6C01" />
          <stop offset="0.585" stopColor="#FFA400" />
        </linearGradient>
      </defs>
    </svg>
  );
});

// Blue corner ribbon: 10% Cashback with Coin Icon and T&C
export const CashbackRibbon = memo(function CashbackRibbon({
  ribbonLabel,
  merchantName,
  showOffers = false,
}) {
  const label = ribbonLabel || (showOffers ? 'Snapmint' : merchantName || 'Cashback');

  return (
    <div className="snp-corner-ribbon-wrapper">
      <div
        className="snp-corner-ribbon"
        data-snp-el="corner-ribbon"
        style={{ backgroundColor: 'var(--snp-color-cashback-ribbon-bg, #D1F4FC)' }}
      >
        <CashbackCoinIcon />
        <div className="snp-ribbon-content">
          <span className="snp-ribbon-title" style={{ color: 'var(--snp-color-cashback-ribbon-text, #0b1f33)' }}>
            10% {label}
          </span>
          <span className="snp-ribbon-sub" style={{ color: 'var(--snp-color-cashback-ribbon-text, #0b1f33)' }}>
            Cashback <small className="snp-ribbon-tnc">T&C</small>
          </span>
        </div>
      </div>
    </div>
  );
});

// Orange serrated corner ribbon: EXTRA 5% OFF
export const OfferRibbon = memo(function OfferRibbon({ text = 'EXTRA 5% OFF' }) {
  return (
    <div className="snp-extra-off-wrapper">
      <div className="snp-extra-off-ribbon" data-snp-el="corner-ribbon">
        <span className="snp-extra-off-text">{text}</span>
      </div>
    </div>
  );
});

// Aliases
export const CashbackCornerRibbon = CashbackRibbon;
export const ExtraOffRibbon = OfferRibbon;

// Unified corner ribbon component that handles conditional visibility & priority
export const PopupCornerRibbon = memo(function PopupCornerRibbon({
  showCashback,
  showOfferRibbon,
  ribbonLabel,
  merchantName,
  showOffers,
  offerText = 'EXTRA 5% OFF',
}) {
  if (showCashback) {
    return (
      <CashbackRibbon
        ribbonLabel={ribbonLabel}
        merchantName={merchantName}
        showOffers={showOffers}
      />
    );
  }

  if (showOfferRibbon) {
    return <OfferRibbon text={offerText} />;
  }

  return null;
});

export default PopupCornerRibbon;
