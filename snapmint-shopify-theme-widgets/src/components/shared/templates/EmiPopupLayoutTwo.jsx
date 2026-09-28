import React, { useState } from "react";
import {
  formatButtonText,
  renderFeatureText,
  renderFooterText,
  getSoftBgTint,
  getGradientBg,
} from "../../../utils/templateHelpers";
import { moneyFormat } from "../../../utils/constants";
import { getWidgetEmiData } from "../../../utils/widgetLayoutHelper";
import { getDownPaymentAndEmi } from "../../../utils/emiCalculator";

const EmiPopupLayoutTwo = ({ popup, widgetConfig, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(0);

  const { price, moneyFormatString, applicablePlans } = popup;
  const { downPayment } = getWidgetEmiData(price, widgetConfig);
  const totalAmount = price;

  const titleText = widgetConfig?.titleText || "Pay Later";
  const logoUrl = widgetConfig?.logoUrl || "";
  const buttonText = widgetConfig?.buttonText || "Pay only ₹{amount} Now";
  const badgeText = widgetConfig?.badgeText || "& pay the rest in No Cost EMIs";
  const footerText =
    widgetConfig?.footerText || "Select Merchant Pay Later during checkout";
  const feature1Text = widgetConfig?.feature1Text || "0% Interest Installments";
  const feature2Text = widgetConfig?.feature2Text || "0 Extra Cost";
  const feature3Text = widgetConfig?.feature3Text || "UPI & Cards accepted";

  const titleColor = widgetConfig?.titleColor;
  const buttonTextColor = widgetConfig?.buttonTextColor;
  const badgeColor = widgetConfig?.badgeColor;
  const featureTextColor = widgetConfig?.featureTextColor;
  const backgroundColor = widgetConfig?.backgroundColor;
  const borderColor = widgetConfig?.borderColor;
  const footerBgColor = widgetConfig?.footerBgColor;
  const footerTextColor = widgetConfig?.footerTextColor;

  const formattedButtonText = formatButtonText(buttonText, downPayment);

  // Use applicablePlans from popup prop to generate options dynamically
  // Fallback to widgetConfig's plan if applicablePlans is empty
  const plans =
    applicablePlans && applicablePlans.length > 0
      ? applicablePlans
      : [
          {
            dpRate: widgetConfig?.dpPercent,
            dpType: widgetConfig?.dpType,
            emiAmountRate: widgetConfig?.emiPercent,
            tenure: widgetConfig?.tenure,
            minAmount: widgetConfig?.minAmount,
            maxAmount: widgetConfig?.maxAmount,
          },
        ];

  const containerStyle = {
    background: "#ffffff",
    border: borderColor ? `1px solid ${borderColor}` : "1px solid #e5e7eb",
  };

  const headerStyle = {
    background: backgroundColor
      ? getGradientBg(backgroundColor)
      : "linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)",
  };

  const middleSectionStyle = {
    background: backgroundColor ? getSoftBgTint(backgroundColor) : "#f3f4f6",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
    borderColor: borderColor || "#e5e7eb",
  };

  const footerStyle = {
    background: footerBgColor || "#f3f4f6",
    color: footerTextColor || "#374151",
  };

  return (
    <React.Fragment>
      <style>{`
                #snap-modalon_page_t2, #snap-modalon_page_t2 *, #snap-modalon_page_t2 :after, #snap-modalon_page_t2 :before {
                    box-sizing: border-box;
                }
                #snap-modalon_page_t2 {
                    display: flex;
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: 2147483647;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    align-items: center;
                    justify-content: center;
                    padding: 8px 0;
                }
                #snap-modalon_page_t2 .modal-wrpr {
                    background: #ffffff;
                    position: relative;
                    overflow: hidden;
                    width: 360px;
                    max-width: 429px;
                    height: 485px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin: 0 auto;
                    border-radius: 24px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
                    border: 1px solid #e5e7eb;
                    letter-spacing: normal;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                @media (max-width: 400px) {
                    #snap-modalon_page_t2 .modal-wrpr {
                        width: 100%;
                        max-width: calc(100vw - 32px);
                    }
                }
                #snap-modalon_page_t2 .snap-close-wrpr {
                    position: absolute;
                    top: 24px;
                    right: 22px;
                    cursor: pointer;
                    z-index: 99;
                    display: block !important;
                }
                #snap-modalon_page_t2 .snap-installment {
                    margin: 0 auto;
                    padding: 24px 0 6px;
                    background: transparent;
                    text-align: center;
                    position: relative;
                }
                .snap_merchant_img_wrpr {
                    width: 40px;
                    height: 40px;
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
                    color: #111827;
                    font-size: 14px;
                    font-weight: 700;
                    margin-top: 4px;
                    text-align: center;
                }
                .white_label_comany_name {
                    font-weight: 700;
                    color: #111827;
                }
                .snap_pay_only_text_t2 {
                    color: #111827;
                    text-align: center;
                    font-size: 18px;
                    font-weight: 500;
                    margin-top: 6px;
                }
                .snap_only_font_weight_t2 {
                    font-weight: 700;
                    color: #111827;
                }
                .snap_dp_amt_font_weight_t2 {
                    font-weight: 800;
                    color: #000000;
                }
                .downpymt_snap_t2 {
                    display: block;
                    font-size: 17px;
                    color: #111827;
                    margin-top: 2px;
                    font-weight: 500;
                }
                .downpymt_snap_t2 b {
                    font-weight: 700;
                    color: #111827;
                }
                .snap_middle_section {
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    margin: 12px 18px 24px;
                    position: relative;
                    background: #ffffff;
                    padding: 10px 14px 28px;
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
                    overflow-x: auto;
                    padding-bottom: 4px;
                }
                .snap_emi_section_t2 {
                    flex: 1;
                    min-width: 100px;
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
                    white-space: nowrap;
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
                    width: 270px;
                    position: absolute;
                    bottom: -18px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
                }
                .snap_total_order_value_section_t2 {
                    color: #4b5563;
                    font-size: 12px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 7px 14px;
                }
                .snap_total_order_value_amt_t2 {
                    color: #111827;
                    text-align: right;
                    font-weight: 700;
                    font-size: 13px;
                }
                .snapmint_frame_footer {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    text-align: center;
                    padding: 16px 18px 14px;
                }
                .snapmint_frame_footer_icon-wrpr_t2 {
                    color: #6b7280;
                    font-size: 11px;
                    font-weight: 500;
                    line-height: 1.3;
                    text-align: center;
                    max-width: 85px;
                    width: 85px;
                }
                .snap_border_gradient1_t2 {
                    filter: grayscale(100%) opacity(0.25);
                    height: 20px;
                }
                .snap_last_section {
                    background: #f3f4f6;
                    padding: 12px 16px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    border-bottom-left-radius: 24px;
                    border-bottom-right-radius: 24px;
                    margin-top: auto;
                    width: 100%;
                    min-height: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .snap_payment_text {
                    font-size: 12.5px;
                    color: #374151;
                    font-weight: 500;
                    line-height: 1.4;
                }
            `}</style>

      <div id="snap-modalon_page_t2" onClick={onClose}>
        <div
          className="coupoun_discount popuppiza no_cost_plan_normal"
          style={{ display: "block" }}
        >
          <div
            className="modal-wrpr plan_popup latest_2_plan_normak two_plan_nocost_popup_normal"
            style={containerStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="snapmint_lowest_emi flex flex-col justify-between h-full"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="snap_popup_bg flex flex-col justify-between h-full overflow-hidden rounded-3xl"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                {/* Close Button */}
                <div className="snap-close-wrpr" onClick={onClose}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L13 13M1 13L13 1"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Top Content */}
                <div>
                  {/* Installment Header */}
                  <div className="snap-installment" style={headerStyle}>
                    <div>
                      <div className="snap_merchant_img_wrpr">
                        <img
                          src={
                            logoUrl ||
                            "https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/powerlook_popup_pay_later.svg"
                          }
                          className="snap_merchant_img"
                          alt="Header Logo"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/powerlook_popup_pay_later.svg";
                          }}
                        />
                      </div>
                      <div
                        className="snap_merchant_name"
                        style={titleColor ? { color: titleColor } : {}}
                      >
                        <span
                          className="white_label_comany_name"
                          style={titleColor ? { color: titleColor } : {}}
                        >
                          {titleText}
                        </span>
                      </div>
                    </div>

                    <div
                      className="snap_pay_only_text_t2"
                      style={buttonTextColor ? { color: buttonTextColor } : {}}
                    >
                      {formattedButtonText === "Pay Now" ||
                      formattedButtonText === "Pay only ₹{amount} Now" ? (
                        <React.Fragment>
                          Pay{" "}
                          <span className="snap_only_font_weight_t2">only</span>{" "}
                          <span className="snap_dp_amt_font_weight_t2">
                            {moneyFormat(downPayment * 100, moneyFormatString)}
                          </span>{" "}
                          Now
                        </React.Fragment>
                      ) : (
                        formattedButtonText
                      )}
                    </div>
                    <span
                      className="downpymt_snap_t2 nocost"
                      style={badgeColor ? { color: badgeColor } : {}}
                    >
                      {badgeText === "& pay the rest in No Cost EMIs" ? (
                        <React.Fragment>
                          &amp; pay the rest in{" "}
                          <b style={badgeColor ? { color: badgeColor } : {}}>
                            No Cost EMIs
                          </b>
                        </React.Fragment>
                      ) : (
                        badgeText
                      )}
                    </span>
                  </div>

                  {/* Middle EMI Options Section */}
                  <div
                    className="snap_middle_section"
                    style={middleSectionStyle}
                  >
                    <div className="snap_emi_option_title_t2">EMI Options</div>
                    <div className="snap_display_flexs_t2">
                      {plans.map((plan, idx) => {
                        const { emi } = getDownPaymentAndEmi(price, plan);
                        return (
                          <div
                            key={idx}
                            className="snap_emi_section_t2"
                            onClick={() => setSelectedOption(idx)}
                          >
                            <span className="snap_emi_option_text_t2">
                              OPTION 0{idx + 1}
                            </span>
                            <div
                              className={`snap_emi_inner_section_t2 ${
                                selectedOption === idx ? "selected" : ""
                              }`}
                            >
                              <span
                                className={`snap_zero_perct_text_t2 ${
                                  selectedOption === idx ? "" : "unselected"
                                }`}
                              >
                                0% EMI
                              </span>
                              <div className="snap_emi_amt_val_t2">
                                {moneyFormat(emi * 100, moneyFormatString)}
                              </div>
                              <div className="snap_emi_month_t2">
                                {plan.tenure} Months Plan
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Total Order Value Pill */}
                    <div className="snap_bottom_middle_section">
                      <div className="snap_total_order_value_section_t2">
                        <span>Total Order Value</span>
                        <span className="snap_total_order_value_amt_t2">
                          {moneyFormat(totalAmount * 100, moneyFormatString)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Frame Footer Benefits */}
                  <div className="snapmint_frame_footer">
                    <div
                      className="snapmint_frame_footer_icon-wrpr_t2"
                      style={
                        featureTextColor ? { color: featureTextColor } : {}
                      }
                    >
                      <div>
                        {renderFeatureText(
                          feature1Text || "0% Interest Installments",
                        )}
                      </div>
                    </div>
                    <img
                      alt="divider"
                      className="snap_border_gradient1_t2"
                      src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
                    />
                    <div
                      className="snapmint_frame_footer_icon-wrpr_t2"
                      style={
                        featureTextColor ? { color: featureTextColor } : {}
                      }
                    >
                      <div>
                        {renderFeatureText(feature2Text || "0 Extra Cost")}
                      </div>
                    </div>
                    <img
                      alt="divider"
                      className="snap_border_gradient1_t2"
                      src="https://assets.snapmint.com/assets/express_checkout/Whitelabel_Images/Line_gradient_img.svg"
                    />
                    <div
                      className="snapmint_frame_footer_icon-wrpr_t2"
                      style={
                        featureTextColor ? { color: featureTextColor } : {}
                      }
                    >
                      <div>
                        {renderFeatureText(
                          feature3Text || "UPI & Cards accepted",
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Gray CTA Bar */}
                <div className="snap_last_section" style={footerStyle}>
                  <div
                    className="snap_payment_text"
                    style={footerTextColor ? { color: footerTextColor } : {}}
                  >
                    {renderFooterText(footerText)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmiPopupLayoutTwo;
