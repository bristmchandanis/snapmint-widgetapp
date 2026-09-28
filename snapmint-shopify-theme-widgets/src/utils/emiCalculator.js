/**
 * Parse a price string and extract the numeric value.
 * Mirrors the legacy `parseNum` function from legacy-engine.js (line 3403).
 */
export const parseNum = (str) => {
  if (str == null) return 0;
  str = str.toString();
  if (str.toLowerCase().indexOf("rs") > -1) {
    str = str.replace(/[^0-9.]/g, "");
    return parseInt(str.substring(str.indexOf(".") + 1)) || 0;
  }
  str = str.toString().replace(/[^\d.-]/g, "");
  return parseInt(str) || 0;
};

/**
 * Calculate downPayment and EMI for a given order value and a single plan.
 *
 * Supports plan types based on `dpType` (from API doc):
 *
 * 1. Percentage plans (dpType === "percentage"):
 *    dp_rate and emi_amount_rate are percentage values (decimal rate).
 *    - downPayment = orderValue × dpRate
 *    - emi         = orderValue × emiAmountRate
 *    Example: dp_rate=0.25 → 25% DP, emi_amount_rate=0.25 → 25% EMI
 *
 * 2. Fixed DP plans (dpType === "fixed"):
 *    dp_rate is a flat/absolute ₹ amount (e.g. ₹0, ₹1, ₹18, ₹19).
 *    - downPayment = dpRate (fixed ₹ amount)
 *    - emi         = (orderValue - dpRate) / tenure
 *    - emiAmountRate is NOT used for fixed DP plans.
 *
 * @param {number} orderValue - The product price
 * @param {object} plan - A single plan object with dpRate, dpType, emiAmountRate, tenure, minAmount, maxAmount
 * @returns {{ downPayment: number, emi: number }}
 */
export const getDownPaymentAndEmi = (orderValue = 0, plan = {}) => {
  let downPayment = 0;
  let emi = 0;

  if (!plan || !plan.dpType) {
    return { downPayment: 0, emi: 0 };
  }
  if (plan.dpType === "fixed") {
    // Flat DP plans: dpRate is the flat/absolute ₹ amount (e.g. 0, 1, 18, 19)
    downPayment = Math.round(plan.dpRate);
    emi = Math.round((orderValue - plan.dpRate) / plan.tenure);
  } else {
    // "percentage" and "fixed" plans: dpRate and emiAmountRate are decimal rates
    // e.g. dpRate=0.25 means 25%, emiAmountRate=0.25 means 25%
    downPayment = Math.round(orderValue * plan.dpRate);
    emi = Math.round(orderValue * plan.emiAmountRate);
  }

  return { downPayment, emi };
};

/**
 * Check if a product price falls within the valid plan range.
 *
 * @param {number} price - The product price
 * @param {Array} plans - The plans array
 * @returns {boolean}
 */
export const isPriceInPlanRange = (price, plans = []) => {
  if (!plans.length) return false;
  return plans.some(
    (plan) => price >= plan.minAmount && price <= plan.maxAmount,
  );
};
