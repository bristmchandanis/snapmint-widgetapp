import React from 'react';
import { SnapmintLogo, ShieldLockIcon, UsersGroupIcon } from './PopupIcons';

// Default Trust & Brand footer
export function PopupFooter({ rbi }) {
  const showTrust = rbi ? rbi.enabled !== false : true;
  const iconsColor = rbi?.iconsColour || '#FF6F00';
  const textColor = rbi?.textColour || '#64768B';

  return (
    <div className="snp-footer" data-snp-el="footer">
      <div className="snp-footer-brand-row" data-snp-el="pay-with-brand">
        <span className="snp-footer-text">Pay with</span>
        <div className="snp-brand-logo-wrapper">
          <SnapmintLogo />
        </div>
        <span className="snp-footer-text">at 0% EMI</span>
      </div>
      {showTrust && (
        <div className="snp-trust-bar" data-snp-el="trust-bar">
          <div className="snp-trust-item" data-snp-el="rbi-badge">
            <ShieldLockIcon color={iconsColor} />
            <span className="snp-trust-text" style={{ color: textColor }}>RBI REGULATED</span>
          </div>
          <div className="snp-trust-item" data-snp-el="trusted-badge">
            <UsersGroupIcon color={iconsColor} />
            <span className="snp-trust-text" style={{ color: textColor }}>TRUSTED BY 5 CR+ USERS</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Eligibility-based footer (banner / dark credit box)
export function EligibilityFooter({
  popupType = 'eligibility-payment',
  merchantName = "Neeman's",
  limit = '₹10,000',
  rbi,
  onCheckLimit,
}) {
  const showTrust = rbi ? rbi.enabled !== false : true;
  const iconsColor = rbi?.iconsColour || '#FF6F00';

  return (
    <div className="snp-credit-selected-container" data-snp-el="eligibility-footer" style={{ width: '100%', marginTop: '12px' }}>
      {popupType === 'eligibility-payment' && (
        <div className="snp-select-payment-banner">
          <div className="snp-arrow-circle">
            <svg
              className="snp-arrow-icon"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <span className="snp-select-payment-text">
            Select {merchantName || 'Snapmint'} on the payment screen
          </span>
        </div>
      )}

      {popupType === 'eligibility-emi' && (
        <div className="snp-footer-brand-row" style={{ justifyContent: 'center', marginBottom: '12px' }}>
          <span className="snp-footer-text" style={{ fontSize: '12.5px', fontStyle: 'italic' }}>
            Pay with <strong>{merchantName}</strong> at 0% EMI
          </span>
        </div>
      )}

      <div className="snp-dark-credit-box">
        <div className="snp-dark-credit-header">
          <span className="snp-dark-credit-title">
            Unlock your limits Up to <strong>{limit}</strong>
          </span>
          <div className="snp-dark-badges">
            <span className="snp-dark-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Instant Approval
            </span>
            <span className="snp-dark-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              5 Cr+ Users
            </span>
          </div>
        </div>

        <button type="button" className="snp-check-limit-btn" onClick={onCheckLimit}>
          <span>Check Limit</span>
          <svg
            className="snp-btn-chevron"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="snp-dark-credit-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>Powered by</span>
          <strong className="snp-white-brand">
            <SnapmintLogo width={58} height={12} fill="white" />
          </strong>
          <span>· No Credit Score Impact</span>
        </div>

        {showTrust && (
          <div
            className="snp-trust-bar"
            style={{
              marginTop: '4px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <div className="snp-trust-item">
              <ShieldLockIcon color={iconsColor} />
              <span className="snp-trust-text" style={{ color: '#94A3B8' }}>RBI REGULATED</span>
            </div>
            <div className="snp-trust-item">
              <UsersGroupIcon color={iconsColor} />
              <span className="snp-trust-text" style={{ color: '#94A3B8' }}>TRUSTED BY 5 CR+ USERS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Unified Modal Footer that automatically picks between EligibilityFooter and PopupFooter based on popupType
export function ModalFooter({ popupType, merchantName, limit, rbi, onCheckLimit }) {
  if (popupType === 'eligibility-payment' || popupType === 'eligibility-emi') {
    return (
      <EligibilityFooter
        popupType={popupType}
        merchantName={merchantName}
        limit={limit}
        rbi={rbi}
        onCheckLimit={onCheckLimit}
      />
    );
  }
  return <PopupFooter rbi={rbi} />;
}

// Shared 3-column features bar (0% Interest, 0 Extra Cost, UPI + Cards)
export function ModalFeatures() {
  return (
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
  );
}
