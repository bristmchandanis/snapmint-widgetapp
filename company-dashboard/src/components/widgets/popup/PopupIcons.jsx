import React from 'react';

// Utility to format amounts with the Indian Rupee symbol (e.g. ₹1,200)

export function formatRupee(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Modal Close (X) Icon
export function CloseIcon({ width = 24, height = 24, className = 'snp-close-icon', ...props }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

// Limited Time Deal Clock Icon
export function ClockIcon({ width = 16, height = 16, className = 'snp-deal-icon', ...props }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M7.99992 14.6666C11.6818 14.6666 14.6666 11.6818 14.6666 7.99992C14.6666 4.31802 11.6818 1.33325 7.99992 1.33325C4.31802 1.33325 1.33325 4.31802 1.33325 7.99992C1.33325 11.6818 4.31802 14.6666 7.99992 14.6666Z"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4V8L10.6667 9.33333"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Order Value Chevron Icon
export function ChevronRightIcon({ width = 16, height = 16, className = 'snp-total-chevron', ...props }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

// Snapmint Brand Logo (58x12)
export function SnapmintLogo({ width = 58, height = 12, className = 'snp-brand-logo', ...props }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 58 12"
      fill="none"
      {...props}
    >
      <path d="M5.96856 3.14523L5.21626 4.57755C4.38734 4.12968 3.62181 3.88709 3.04807 3.88709C2.65263 3.88709 2.3721 4.04016 2.3721 4.35983C2.3721 5.30615 5.99419 4.84584 5.98096 7.2499C5.98096 8.66923 4.74448 9.44922 3.08638 9.44922C1.93863 9.44922 0.829189 9.11683 0 8.47748L0.7016 7.07086C1.47953 7.62069 2.3721 7.92765 3.13736 7.92765C3.57111 7.92765 3.88966 7.77431 3.88966 7.45463C3.88966 6.44421 0.33151 6.96863 0.344462 4.55186C0.344462 3.13252 1.54319 2.36524 3.13736 2.36524C4.13217 2.36524 5.1267 2.64651 5.96856 3.14523Z" fill="white" />
      <path d="M13.7194 5.01282V9.36035H11.5259V5.62675C11.5259 4.82107 11.0538 4.32236 10.3145 4.32236C9.51093 4.32236 9.00057 4.89788 8.91156 5.71627V9.36035H6.70508V2.46813H8.91156V3.59349C9.39601 2.7878 10.1869 2.37888 11.2071 2.3659C12.7246 2.3659 13.7194 3.40174 13.7194 5.01282Z" fill="white" />
      <path d="M18.6868 7.02363V6.4097H17.2968C16.6335 6.4097 16.3023 6.63986 16.3023 7.15128C16.3023 7.65027 16.6594 7.96967 17.2712 7.96967C17.9601 7.96967 18.5468 7.58617 18.6868 7.02363ZM20.8547 4.86272V9.36359H18.6997V8.57089C18.2536 9.15913 17.5264 9.46582 16.5955 9.46582C15.1289 9.46582 14.2363 8.57089 14.2363 7.3049C14.2363 6.00051 15.1672 5.23351 16.876 5.22052H18.6868V5.11829C18.6868 4.44053 18.2406 4.03134 17.3481 4.03134C16.774 4.03134 16.0215 4.2358 15.2945 4.60686L14.6698 3.14912C15.7412 2.65041 16.7101 2.36886 17.8579 2.36886C19.7455 2.36886 20.8423 3.30247 20.8547 4.86272Z" fill="white" />
      <path d="M27.2462 5.88123C27.2462 4.83268 26.6212 4.0911 25.703 4.0911C24.8107 4.0911 24.1857 4.83268 24.1857 5.88123C24.1857 6.95547 24.8107 7.68406 25.703 7.68406C26.6212 7.68406 27.2462 6.94248 27.2462 5.88123ZM29.4656 5.94505C29.4656 8.04214 28.2159 9.43579 26.2897 9.43579C25.3974 9.43579 24.6702 9.0777 24.1857 8.43863V11.8398H21.9795V2.46703H24.1857V3.37494C24.6702 2.7483 25.3715 2.39022 26.239 2.39022C28.1776 2.39022 29.4656 3.80955 29.4656 5.94505Z" fill="white" />
      <path d="M41.5792 5.20457V9.36035H40.5847V5.47313C40.5847 4.27124 39.8831 3.56779 38.7224 3.56779C37.3324 3.60619 36.5291 4.60363 36.5291 6.04866V9.36035H35.5216V5.47313C35.5216 4.27124 34.833 3.56779 33.6596 3.56779C32.2823 3.60619 31.4531 4.60363 31.4531 6.04866V9.36035H30.4707V2.62147H31.4531V4.14332C31.8995 3.09477 32.8051 2.59605 34.0167 2.58334C35.2791 2.58334 36.1463 3.2354 36.4271 4.34777C36.8477 3.15887 37.7915 2.59605 39.0798 2.58334C40.6483 2.58334 41.5792 3.5805 41.5792 5.20457Z" fill="white" />
      <path d="M43.2704 2.62147H44.2522V9.36035H43.2704V2.62147ZM44.4055 0.690437C44.4055 1.08692 44.1249 1.3809 43.7551 1.3809C43.3853 1.3809 43.1045 1.08692 43.1045 0.690437C43.1045 0.294228 43.3853 -2.76566e-05 43.7551 -2.76566e-05C44.1249 -2.76566e-05 44.4055 0.294228 44.4055 0.690437Z" fill="white" />
      <path d="M52.32 5.20457V9.36035H51.3254V5.47313C51.3254 4.28395 50.6112 3.5805 49.4251 3.5805C48.0988 3.59349 47.2826 4.46272 47.1679 5.74142V9.36035H46.1729V2.62147H47.1679V4.10491C47.6397 3.08178 48.545 2.59605 49.7693 2.58334C51.3762 2.58334 52.32 3.5805 52.32 5.20457Z" fill="white" />
      <path d="M57.4898 8.90334C57.018 9.22301 56.5079 9.40205 55.9722 9.41504C54.9904 9.41504 54.2634 8.8268 54.2634 7.49671V3.6479H53.2939V2.84222H54.2634V1.0648H55.245V2.84222L57.3751 2.82951V3.6479H55.245V7.31767C55.245 8.13634 55.5641 8.44303 56.1381 8.44303C56.4823 8.44303 56.8394 8.32781 57.2092 8.09766L57.4898 8.90334Z" fill="white" />
    </svg>
  );
}

// Shield Lock Icon (RBI REGULATED)
export function ShieldLockIcon({ width = 16, height = 16, color = '#FF6F00', className = 'snp-trust-icon', ...props }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.83333 14.1651C6.36611 13.7956 5.15486 12.9538 4.19958 11.6396C3.2443 10.3255 2.76666 8.86617 2.76666 7.26172V3.39839L7.83333 1.49839L12.9 3.39839V7.26172C12.9 8.86617 12.4224 10.3255 11.4671 11.6396C10.5118 12.9538 9.30055 13.7956 7.83333 14.1651ZM6.56667 10.3651H9.1C9.27944 10.3651 9.42986 10.3044 9.55125 10.183C9.67264 10.0616 9.73333 9.91117 9.73333 9.73172V7.83172C9.73333 7.65228 9.67264 7.50186 9.55125 7.38047C9.42986 7.25908 9.27944 7.19839 9.1 7.19839V6.56506C9.1 6.21672 8.97597 5.91853 8.72792 5.67047C8.47986 5.42242 8.18167 5.29839 7.83333 5.29839C7.485 5.29839 7.1868 5.42242 6.93875 5.67047C6.69069 5.91853 6.56667 6.21672 6.56667 6.56506V7.19839C6.38722 7.19839 6.2368 7.25908 6.11542 7.38047C5.99403 7.50186 5.93333 7.65228 5.93333 7.83172V9.73172C5.93333 9.91117 5.99403 10.0616 6.11542 10.183C6.2368 10.3044 6.38722 10.3651 6.56667 10.3651ZM7.2 7.19839V6.56506C7.2 6.38561 7.26069 6.2352 7.38208 6.11381C7.50347 5.99242 7.65389 5.93172 7.83333 5.93172C8.01278 5.93172 8.16319 5.99242 8.28458 6.11381C8.40597 6.2352 8.46667 6.38561 8.46667 6.56506V7.19839H7.2Z"
        fill={color}
      />
    </svg>
  );
}

// Users Group Icon (TRUSTED BY 5 CR+ USERS)
export function UsersGroupIcon({ width = 16, height = 16, color = '#FF6F00', className = 'snp-trust-icon', ...props }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.71597 0.936432C2.67891 0.936432 1.83581 1.77954 1.83581 2.8166C1.83581 3.83387 2.63141 4.65718 3.66847 4.6928C3.70014 4.68885 3.7318 4.68885 3.75555 4.6928C3.76347 4.6928 3.76743 4.6928 3.77534 4.6928C3.7793 4.6928 3.7793 4.6928 3.78326 4.6928C4.79657 4.65718 5.59218 3.83387 5.59614 2.8166C5.59614 1.77954 4.75303 0.936432 3.71597 0.936432Z"
        fill={color}
      />
      <path
        d="M5.72697 5.74588C4.62262 5.00965 2.8216 5.00965 1.70934 5.74588C1.20664 6.08233 0.929562 6.53753 0.929562 7.02439C0.929562 7.51125 1.20664 7.96249 1.70538 8.29499C2.25953 8.66706 2.98785 8.8531 3.71616 8.8531C4.4445 8.8531 5.17281 8.66706 5.72697 8.29499C6.22571 7.95854 6.50278 7.5073 6.50278 7.01647C6.49882 6.52961 6.22571 6.07837 5.72697 5.74588Z"
        fill={color}
      />
      <path
        d="M8.06633 3.04965C8.12966 3.81755 7.58342 4.49045 6.8274 4.58149C6.82344 4.58149 6.82344 4.58149 6.81948 4.58149H6.80761C6.78386 4.58149 6.76011 4.58149 6.74032 4.58941C6.35637 4.6092 6.00408 4.48649 5.73888 4.26087C6.14658 3.89671 6.38012 3.35048 6.33262 2.75674C6.30491 2.43612 6.19408 2.14321 6.02783 1.89384C6.17825 1.81864 6.35241 1.77114 6.53053 1.7553C7.30635 1.68801 7.99904 2.26592 8.06633 3.04965Z"
        fill={color}
      />
      <path
        d="M8.85774 6.71178C8.82608 7.09573 8.58066 7.42822 8.16901 7.65384C7.77318 7.87155 7.27444 7.97446 6.77966 7.96259C7.06466 7.7053 7.2309 7.38468 7.26257 7.04427C7.30215 6.55345 7.06862 6.08242 6.60154 5.70639C6.33634 5.4966 6.0276 5.33035 5.69115 5.20765C6.56592 4.95432 7.66631 5.12453 8.34317 5.67076C8.70733 5.96367 8.89337 6.33179 8.85774 6.71178Z"
        fill={color}
      />
    </svg>
  );
}

// Cashback Coin Icon
export function CashbackCoinIcon({ width = 16, height = 16, className = 'snp-coin-icon', ...props }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <circle cx="8" cy="8" r="7.5" fill="#FFE500" stroke="#FFB800" />
      <circle cx="8" cy="8" r="5.5" stroke="#FFB800" strokeDasharray="1.5 1.5" />
      <path
        d="M6 5.5H10M6 7.5H9.5M6 5.5V11M8 7.5L10 11"
        stroke="#B25E00"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 12-point scalloped rosette flower badge for coupons
const ROSETTE_PATH =
  'M 12 1 L 13.9 4.8 L 17.5 2.5 L 18 6.8 L 22.1 6.3 L 20.8 10.4 L 23.9 12 L 20.8 13.6 L 22.1 17.7 L 18 17.2 L 17.5 21.5 L 13.9 19.2 L 12 23 L 10.1 19.2 L 6.5 21.5 L 6 17.2 L 1.9 17.7 L 3.2 13.6 L 0.1 12 L 3.2 10.4 L 1.9 6.3 L 6 6.8 L 6.5 2.5 L 10.1 4.8 Z';

export function RosettePercentBadge({ color = '#BE185D', size = 15, className = 'shrink-0' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d={ROSETTE_PATH} fill={color} />
      <text x="12" y="15.2" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif">
        %
      </text>
    </svg>
  );
}

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
      {/* 3rd Option: Payment instruction banner */}
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

      {/* 4th Option: Brand line */}
      {popupType === 'eligibility-emi' && (
        <div className="snp-footer-brand-row" style={{ justifyContent: 'center', marginBottom: '12px' }}>
          <span className="snp-footer-text" style={{ fontSize: '12.5px', fontStyle: 'italic' }}>
            Pay with <strong>{merchantName}</strong> at 0% EMI
          </span>
        </div>
      )}

      {/* Dark Credit Box */}
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