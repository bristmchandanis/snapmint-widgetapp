import React from "react";
import {
    calculateEMISchedule,
    formatButtonText,
    renderFeatureText,
    renderFormattedText,
    renderFooterText,
    getSoftBgTint,
    getGradientBg,
    getNextMonthNames,
} from "../../../../utils/helpers";

const TemplateLayoutOne = ({
    sampleAmount = 3000,
    isSelected = false,
    titleText = 'Pay Later',
    logoUrl,
    buttonText = 'Pay only ₹{amount} Now',
    badgeText = '',
    footerText = 'Select Merchant Pay Later on the payment screen',
    step1Text = 'Pay Now',
    feature1Text = '0% Interest Installments',
    feature2Text = '0 Extra Cost',
    feature3Text = 'UPI & Cards accepted',
    titleColor,
    buttonTextColor,
    badgeColor,
    featureTextColor,
    backgroundColor,
    borderColor,
    footerBgColor,
    footerTextColor,
}) => {
    const { totalAmount, downPayment, emi1, emi2 } = calculateEMISchedule(sampleAmount);
    const formattedButtonText = formatButtonText(buttonText, downPayment);
    const { nextMonth1, nextMonth2 } = getNextMonthNames();

    const containerStyle = {
        background: '#ffffff',
        border: isSelected ? '2px solid #111827' : (borderColor ? `1px solid ${borderColor}` : '1px solid #e5e7eb'),
        boxShadow: isSelected
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    };

    const headerStyle = {
        background: backgroundColor ? getGradientBg(backgroundColor) : 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)',
    };

    const middleSectionStyle = {
        background: backgroundColor ? getSoftBgTint(backgroundColor) : '#f3f4f6',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        ...(borderColor ? { borderColor: borderColor } : {}),
    };

    const footerStyle = {
        ...(footerBgColor ? { background: footerBgColor } : {}),
        ...(footerTextColor ? { color: footerTextColor } : {}),
    };

    return (
        <React.Fragment>
            <style>{`
                #snap-modalon_page, #snap-modalon_page *, #snap-modalon_page :after, #snap-modalon_page :before {
                    box-sizing: border-box;
                }
                #snap-modalon_page {
                    display: flex;
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }
                #snap-modalon_page .modal-wrpr {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    max-width: 360px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin: 0 auto;
                    border-radius: 24px;
                    letter-spacing: normal;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    transition: border 0.15s ease, box-shadow 0.15s ease;
                }
                #snap-modalon_page .snap-close-wrpr {
                    position: absolute;
                    top: 19px;
                    right: 20px;
                    cursor: pointer;
                    z-index: 99;
                    display: block !important;
                }
                #snap-modalon_page .snap-installment {
                    margin: 0 auto;
                    padding: 18px 0 8px;
                    background: transparent;
                    text-align: center;
                    border-bottom: none;
                    position: relative;
                }
                .snap_merchant_img_wrpr {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 6px;
                    overflow: hidden;
                }
                .snap_merchant_img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }
                .snap_merchant_name {
                    font-size: 13.5px;
                    font-weight: 700;
                    margin-bottom: 4px !important;
                    text-align: center;
                    display: block;
                }
                .white_label_comany_name {
                    font-weight: 700;
                }
                .snap_pay_only_text {
                    text-align: center;
                    font-size: 17px;
                    font-weight: 500;
                    margin-top: 4px;
                }
                .snap_only_font_weight {
                    font-weight: 700;
                    color: inherit;
                }
                .snap_dp_amt_font_weight {
                    font-weight: 800;
                    color: inherit;
                }
                #snap-modalon_page .snapmint_frame_footer {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    text-align: center;
                    border-radius: 16px;
                    padding: 10px 18px 6px;
                    margin: 4px 0 0;
                }
                .snapmint_frame_footer .snapmint_frame_footer_icon-wrpr {
                    text-align: center;
                    font-size: 11px;
                    font-weight: 500;
                    line-height: 1.3;
                    max-width: 85px;
                    width: 85px;
                }
                .snap_border_gradient1 {
                    filter: grayscale(100%) opacity(0.25);
                    height: 20px;
                }
                .snap_middle_section {
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                    margin: 20px 16px 4px;
                    position: relative;
                    padding-top: 4px;
                }
                .snap_top_middle_section {
                    border: 1px solid #e5e7eb;
                    background: #ffffff;
                    border-radius: 8px;
                    width: 250px;
                    position: absolute;
                    top: -16px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
                }
                .snap_total_order_value_section {
                    color: #4b5563;
                    font-size: 11.5px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 6px 12px;
                }
                .snap_total_order_value_amt {
                    color: #111827;
                    text-align: right;
                    font-weight: 700;
                    font-size: 12.5px;
                }
                #snap-modalon_page .snap_how_works_steps {
                    display: flex;
                    padding-bottom: 10px;
                    padding-top: 20px;
                    justify-content: space-between;
                }
                #snap-modalon_page .snap_how_works_steps .pizza_img_snap {
                    flex: 1;
                    text-align: center;
                }
                .pizza_img_snap svg {
                    margin: 0 auto 2px;
                }
                .snap_threepie_emi_amt {
                    color: #111827;
                    font-size: 13.5px;
                    font-weight: 700;
                }
                .snap_emi_date {
                    color: #6b7280;
                    font-size: 10.5px;
                    font-weight: 500;
                    margin-top: 2px;
                }
                .snap_dark_green_clr {
                    color: #111827 !important;
                    font-weight: 700 !important;
                }
                .snap_flex_wl {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 8px 0 10px;
                }
                .snap_powered_text {
                    color: #9ca3af;
                    font-size: 10.5px;
                }
                .snap_powered_img {
                    filter: grayscale(100%);
                    max-height: 15px;
                }
                .snap_last_section {
                    padding: 10px 16px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    border-bottom-left-radius: 23px;
                    border-bottom-right-radius: 23px;
                    margin-top: auto;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #snap-modalon_page .snap_payment_text {
                    font-size: 12px;
                    color: inherit;
                    font-weight: 500;
                    line-height: 1.4;
                }
            `}</style>

            <div id="snap-modalon_page">
                <div className="modal-wrpr popuppiza white_label_normal_3_pies" style={containerStyle}>
                    {/* Close Button */}
                    <div className="snap-close-wrpr">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M1 13L13 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Top Content */}
                    <div>
                        {/* Header Section */}
                        <div className="snap-installment" style={headerStyle}>
                            <div>
                                <div className="snap_merchant_img_wrpr">
                                    <img
                                        alt="Header Logo"
                                        src={logoUrl || "https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/powerlook_popup_pay_later.svg"}
                                        className="snap_merchant_img"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/powerlook_popup_pay_later.svg";
                                        }}
                                    />
                                </div>
                                <div className="snap_merchant_name" style={{ color: titleColor || '#111827' }}>
                                    <span className="white_label_comany_name" style={{ color: titleColor || '#111827' }}>{titleText}</span>
                                </div>
                            </div>

                            <div className="snap_pay_only_text" style={{ color: buttonTextColor || '#111827' }}>
                                {formattedButtonText === 'Pay Now' || formattedButtonText === 'Pay only ₹{amount} Now' ? (
                                    <>Pay <span className="snap_only_font_weight">only</span> <span className="snap_dp_amt_font_weight">₹{downPayment.toLocaleString()}</span> Now</>
                                ) : (
                                    formattedButtonText
                                )}
                            </div>

                            <div className="snapmint_frame_footer">
                                <div className="snapmint_frame_footer_icon-wrpr" style={{ color: featureTextColor || '#6b7280' }}>
                                    <div>{renderFeatureText(feature1Text || '0% Interest Installments')}</div>
                                </div>
                                <img
                                    alt="divider"
                                    className="snap_border_gradient1"
                                    src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
                                />
                                <div className="snapmint_frame_footer_icon-wrpr" style={{ color: featureTextColor || '#6b7280' }}>
                                    <div>{renderFeatureText(feature2Text || '0 Extra Cost')}</div>
                                </div>
                                <img
                                    alt="divider"
                                    className="snap_border_gradient1"
                                    src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
                                />
                                <div className="snapmint_frame_footer_icon-wrpr" style={{ color: featureTextColor || '#6b7280' }}>
                                    <div>{renderFeatureText(feature3Text || 'UPI & Cards accepted')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Total Order Value & 3 Steps */}
                        <div className="snap_middle_section" style={middleSectionStyle}>
                            <div className="snap_top_middle_section">
                                <div className="snap_total_order_value_section">
                                    <span>Total Order Value</span>
                                    <span className="snap_total_order_value_amt">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="snap_how_works_steps">
                                <div className="pizza_img_snap">
                                    <svg width="48" height="48" viewBox="0 0 56 56" className="mx-auto mb-1">
                                        <defs>
                                            <linearGradient id="pieGradDark1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#111827" />
                                                <stop offset="100%" stopColor="#4b5563" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="28" cy="28" r="24" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                                        <path d="M 28 28 L 28 4 A 24 24 0 0 1 48.78 40 Z" fill="url(#pieGradDark1)" />
                                        <circle cx="28" cy="28" r="4" fill="#ffffff" />
                                    </svg>
                                    <div className="snap_threepie_emi_amt">₹{downPayment.toLocaleString()}</div>
                                    <div className="snap_emi_date snap_dark_green_clr">
                                        {step1Text || 'Pay Now'}
                                    </div>
                                </div>
                                <div className="pizza_img_snap">
                                    <svg width="48" height="48" viewBox="0 0 56 56" className="mx-auto mb-1">
                                        <defs>
                                            <linearGradient id="pieGradDark2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#111827" />
                                                <stop offset="100%" stopColor="#4b5563" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="28" cy="28" r="24" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                                        <path d="M 28 28 L 28 4 A 24 24 0 1 1 7.22 40 Z" fill="url(#pieGradDark2)" />
                                        <circle cx="28" cy="28" r="4" fill="#ffffff" />
                                    </svg>
                                    <div className="snap_threepie_emi_amt">₹{emi1.toLocaleString()}</div>
                                    <div className="snap_emi_date">3<sup>rd</sup> {nextMonth1}</div>
                                </div>
                                <div className="pizza_img_snap">
                                    <svg width="48" height="48" viewBox="0 0 56 56" className="mx-auto mb-1">
                                        <defs>
                                            <linearGradient id="pieGradDark3" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#111827" />
                                                <stop offset="100%" stopColor="#374151" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="28" cy="28" r="24" fill="url(#pieGradDark3)" stroke="#111827" strokeWidth="1" />
                                        <line x1="28" y1="4" x2="28" y2="28" stroke="#ffffff" strokeWidth="1.5" />
                                        <line x1="28" y1="28" x2="48.78" y2="40" stroke="#ffffff" strokeWidth="1.5" />
                                        <line x1="28" y1="28" x2="7.22" y2="40" stroke="#ffffff" strokeWidth="1.5" />
                                        <circle cx="28" cy="28" r="4" fill="#ffffff" />
                                    </svg>
                                    <div className="snap_threepie_emi_amt">₹{emi2.toLocaleString()}</div>
                                    <div className="snap_emi_date">3<sup>rd</sup> {nextMonth2}</div>
                                </div>
                            </div>
                        </div>

                        {/* Powered By */}
                        <div className="snap_flex_wl snap_center_wl">
                            <span className="snap_powered_text">Powered by</span>
                            <img
                                src="https://assets.snapmint.com/assets/merchant/SnapMint_logo_grey.svg"
                                className="snap_powered_img"
                                alt="Snapmint"
                            />
                        </div>
                    </div>

                    {/* Bottom Footer (Gray Background Block) */}
                    <div className="snap_last_section" style={footerStyle}>
                        <div className="snap_payment_text" style={{ color: footerTextColor || '#374151' }}>
                            {renderFooterText(footerText)}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TemplateLayoutOne;