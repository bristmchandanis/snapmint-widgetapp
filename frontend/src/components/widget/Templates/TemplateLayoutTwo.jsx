import React, { useState } from "react";
import {
    calculateEMISchedule,
    formatButtonText,
    renderFeatureText,
    renderFooterText,
    getSoftBgTint,
    getGradientBg,
} from "../../../../utils/helpers";

const TemplateLayoutTwo = ({
    sampleAmount = 3000,
    isSelected = false,
    titleText = 'Pay Later',
    logoUrl,
    buttonText = 'Pay only ₹{amount} Now',
    badgeText = '& pay the rest in No Cost EMIs',
    footerText = 'Select Merchant Pay Later during checkout',
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
    const [selectedOption, setSelectedOption] = useState(1);

    const { totalAmount, downPayment, emi1 } = calculateEMISchedule(sampleAmount);
    const emi2 = Math.round(totalAmount / 6);
    const formattedButtonText = formatButtonText(buttonText, downPayment);

    const containerStyle = {
        background: '#ffffff',
        border: isSelected ? '2px solid #111827' : (borderColor ? `1px solid ${borderColor}` : '1px solid #e5e7eb'),
    };

    const headerStyle = {
        background: backgroundColor ? getGradientBg(backgroundColor) : 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)',
    };

    const middleSectionStyle = {
        background: backgroundColor ? getSoftBgTint(backgroundColor) : '#f3f4f6',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        borderColor: borderColor || '#e5e7eb',
    };

    const footerStyle = {
        background: footerBgColor || '#f9fafb',
        color: footerTextColor || '#374151',
    };

    return (
        <React.Fragment>
            <style>{`
                #snap-modalon_page_t2, #snap-modalon_page_t2 *, #snap-modalon_page_t2 :after, #snap-modalon_page_t2 :before {
                    box-sizing: border-box;
                }
                #snap-modalon_page_t2 {
                    display: flex;
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }
                #snap-modalon_page_t2 .modal-wrpr {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    max-width: 360px;
                    height: 448px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin: 0 auto;
                    border-radius: 24px;
                    letter-spacing: normal;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    transition: border 0.15s ease, box-shadow 0.15s ease;
                }
                #snap-modalon_page_t2 .snap-close-wrpr {
                    position: absolute;
                    top: 19px;
                    right: 20px;
                    cursor: pointer;
                    z-index: 99;
                    display: block !important;
                }
                #snap-modalon_page_t2 .snap-installment {
                    margin: 0 auto;
                    padding: 20px 0 8px;
                    background: transparent;
                    text-align: center;
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
                    margin-top: 2px;
                    text-align: center;
                }
                .white_label_comany_name {
                    font-weight: 700;
                }
                .snap_pay_only_text_t2 {
                    text-align: center;
                    font-size: 17px;
                    font-weight: 500;
                    margin-top: 6px;
                }
                .snap_only_font_weight_t2 {
                    font-weight: 700;
                    color: inherit;
                }
                .snap_dp_amt_font_weight_t2 {
                    font-weight: 800;
                    color: inherit;
                }
                .downpymt_snap_t2 {
                    display: block;
                    font-size: 15px;
                    margin-top: 2px;
                    font-weight: 500;
                }
                .downpymt_snap_t2 b {
                    font-weight: 700;
                    color: inherit;
                }
                .snap_middle_section {
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    margin: 14px 16px 24px;
                    position: relative;
                    padding: 12px 14px 28px;
                }
                .snap_emi_option_title_t2 {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 12px;
                    text-align: center;
                }
                .snap_display_flexs_t2 {
                    display: flex;
                    gap: 10px;
                }
                .snap_emi_section_t2 {
                    flex: 1;
                    cursor: pointer;
                }
                .snap_emi_option_text_t2 {
                    font-size: 10px;
                    font-weight: 700;
                    color: #9ca3af;
                    letter-spacing: 0.05em;
                    display: block;
                    text-align: center;
                    margin-bottom: 8px;
                }
                .snap_emi_inner_section_t2 {
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 12px 8px;
                    text-align: center;
                    position: relative;
                    transition: all 0.2s ease;
                    background: #ffffff;
                }
                .snap_emi_inner_section_t2.selected {
                    border-color: #000000;
                    background: #fafafa;
                }
                .snap_zero_perct_text_t2 {
                    position: absolute;
                    top: -9px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #000000;
                    color: #ffffff;
                    font-size: 9px;
                    font-weight: 700;
                    padding: 1px 7px;
                    border-radius: 99px;
                }
                .snap_zero_perct_text_t2.unselected {
                    background: #e5e7eb;
                    color: #6b7280;
                }
                .snap_emi_amt_val_t2 {
                    font-size: 16px;
                    font-weight: 800;
                    color: #111827;
                    margin-top: 2px;
                }
                .snap_emi_month_t2 {
                    font-size: 10.5px;
                    color: #6b7280;
                    font-weight: 500;
                    margin-top: 2px;
                }
                .snap_bottom_middle_section {
                    border: 1px solid #e5e7eb;
                    background: #ffffff;
                    border-radius: 8px;
                    width: 250px;
                    position: absolute;
                    bottom: -16px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
                }
                .snap_total_order_value_section_t2 {
                    color: #4b5563;
                    font-size: 11.5px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 6px 12px;
                }
                .snap_total_order_value_amt_t2 {
                    color: #111827;
                    text-align: right;
                    font-weight: 700;
                    font-size: 12.5px;
                }
                .snapmint_frame_footer {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    text-align: center;
                    padding: 18px 16px 16px;
                }
                .snapmint_frame_footer_icon-wrpr_t2 {
                    font-size: 10.5px;
                    font-weight: 500;
                    line-height: 1.3;
                    text-align: center;
                    max-width: 85px;
                    width: 85px;
                }
                .snap_border_gradient1_t2 {
                    filter: grayscale(100%) opacity(0.25);
                    height: 18px;
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
                .snap_payment_text {
                    font-size: 12px;
                    color: inherit;
                    font-weight: 500;
                    line-height: 1.4;
                }
            `}</style>

            <div id="snap-modalon_page_t2">
                <div className="modal-wrpr" style={containerStyle}>
                    {/* Close Button */}
                    <div className="snap-close-wrpr">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M1 13L13 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Top Content */}
                    <div>
                        {/* Installment Header */}
                        <div className="snap-installment" style={headerStyle}>
                            <div>
                                <div className="snap_merchant_img_wrpr">
                                    <img
                                        src={logoUrl || "https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/powerlook_popup_pay_later.svg"}
                                        className="snap_merchant_img"
                                        alt="Header Logo"
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

                            <div className="snap_pay_only_text_t2" style={{ color: buttonTextColor || '#111827' }}>
                                {formattedButtonText === 'Pay Now' ? (
                                    <>Pay <span className="snap_only_font_weight_t2">only</span> <span className="snap_dp_amt_font_weight_t2">₹{downPayment.toLocaleString()}</span> Now</>
                                ) : (
                                    formattedButtonText
                                )}
                            </div>
                            <span
                                className="downpymt_snap_t2 nocost"
                                style={{ color: badgeColor || '#4b5563' }}
                            >
                                {badgeText === '& pay the rest in No Cost EMIs' ? (
                                    <>&amp; pay the rest in <b style={{ color: badgeColor || '#4b5563' }}>No Cost EMIs</b></>
                                ) : (
                                    badgeText
                                )}
                            </span>
                        </div>

                        {/* Middle EMI Options Section */}
                        <div className="snap_middle_section" style={middleSectionStyle}>
                            <div className="snap_emi_option_title_t2">EMI Options</div>
                            <div className="snap_display_flexs_t2">
                                {/* Option 1 */}
                                <div
                                    className="snap_emi_section_t2"
                                    onClick={() => setSelectedOption(1)}
                                >
                                    <span className="snap_emi_option_text_t2">OPTION 01</span>
                                    <div className={`snap_emi_inner_section_t2 ${selectedOption === 1 ? 'selected' : ''}`}>
                                        <span className={`snap_zero_perct_text_t2 ${selectedOption === 1 ? '' : 'unselected'}`}>
                                            0% EMI
                                        </span>
                                        <div className="snap_emi_amt_val_t2">₹{emi1.toLocaleString()}</div>
                                        <div className="snap_emi_month_t2">3 Months Plan</div>
                                    </div>
                                </div>

                                {/* Option 2 */}
                                <div
                                    className="snap_emi_section_t2"
                                    onClick={() => setSelectedOption(2)}
                                >
                                    <span className="snap_emi_option_text_t2">OPTION 02</span>
                                    <div className={`snap_emi_inner_section_t2 ${selectedOption === 2 ? 'selected' : ''}`}>
                                        <span className={`snap_zero_perct_text_t2 ${selectedOption === 2 ? '' : 'unselected'}`}>
                                            0% EMI
                                        </span>
                                        <div className="snap_emi_amt_val_t2">₹{emi2.toLocaleString()}</div>
                                        <div className="snap_emi_month_t2">6 Months Plan</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Total Order Value Pill */}
                            <div className="snap_bottom_middle_section">
                                <div className="snap_total_order_value_section_t2">
                                    <span>Total Order Value</span>
                                    <span className="snap_total_order_value_amt_t2">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Frame Footer Benefits */}
                        <div className="snapmint_frame_footer">
                            <div className="snapmint_frame_footer_icon-wrpr_t2" style={{ color: featureTextColor || '#6b7280' }}>
                                <div>{renderFeatureText(feature1Text || '0% Interest Installments')}</div>
                            </div>
                            <img
                                alt="divider"
                                className="snap_border_gradient1_t2"
                                src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
                            />
                            <div className="snapmint_frame_footer_icon-wrpr_t2" style={{ color: featureTextColor || '#6b7280' }}>
                                <div>{renderFeatureText(feature2Text || '0 Extra Cost')}</div>
                            </div>
                            <img
                                alt="divider"
                                className="snap_border_gradient1_t2"
                                src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
                            />
                            <div className="snapmint_frame_footer_icon-wrpr_t2" style={{ color: featureTextColor || '#6b7280' }}>
                                <div>{renderFeatureText(feature3Text || 'UPI & Cards accepted')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Gray CTA Bar */}
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

export default TemplateLayoutTwo;
