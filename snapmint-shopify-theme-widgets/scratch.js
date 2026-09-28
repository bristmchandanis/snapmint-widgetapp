// Verify EMI calculations for order price ₹6900.99

const orderPrice = 6900.99;

// parseNum gives parseInt("6900.99") = 6900
// Since 6900 < 10000, price = 6900
const price = 6900;

const plans = [
  { tenure: 3, dp_rate: 0.25, dp_type: "percentage", min: 199, max: 200000, emi_rate: 0.25 },
  { tenure: 6, dp_rate: 0.25, dp_type: "percentage", min: 5000, max: 200000, emi_rate: 0.125 },
  { tenure: 9, dp_rate: 0.25, dp_type: "percentage", min: 10000, max: 200000, emi_rate: 0.0833 },
  { tenure: 3, dp_rate: 0,    dp_type: "fixed",      min: 199, max: 200000, emi_rate: 0.3333 },
  { tenure: 6, dp_rate: 0,    dp_type: "fixed",      min: 5000, max: 200000, emi_rate: 0.1667 },
  { tenure: 9, dp_rate: 0,    dp_type: "fixed",      min: 10000, max: 200000, emi_rate: 0.1111 },
];

console.log(`\n=== Order Price: ₹${orderPrice} → Parsed Price: ₹${price} ===\n`);

// Filter applicable plans
const applicable = plans.filter(p => price >= p.min && price <= p.max);
console.log(`Applicable plans: ${applicable.length}\n`);

applicable.forEach((plan, i) => {
  let dp, emi;
  
  if (plan.dp_type === "flat") {
    dp = Math.round(plan.dp_rate);
    emi = Math.round((price - plan.dp_rate) / plan.tenure);
  } else {
    // "percentage" and "fixed" both use rate-based calc
    dp = Math.round(price * plan.dp_rate);
    emi = Math.round(price * plan.emi_rate);
  }
  
  const total = dp + (emi * plan.tenure);
  const diff = total - price;
  
  console.log(`Plan ${i+1}: dp_type="${plan.dp_type}", tenure=${plan.tenure}mo, dp_rate=${plan.dp_rate}, emi_rate=${plan.emi_rate}`);
  console.log(`  DP  = ${price} × ${plan.dp_rate} = ₹${dp}`);
  console.log(`  EMI = ${price} × ${plan.emi_rate} = ₹${emi}`);
  console.log(`  Total = ₹${dp} + (₹${emi} × ${plan.tenure}) = ₹${dp} + ₹${emi * plan.tenure} = ₹${total}`);
  console.log(`  Match: ${total} vs ${price} → ${diff === 0 ? '✅ EXACT' : `❌ OFF BY ₹${diff}`}`);
  console.log();
});

// User's check: 863 * 6 + 863 (assuming DP = EMI)
console.log(`\n=== User's Verification ===`);
console.log(`863 × 6 + 863 (assuming DP=EMI) = ${863*6} + 863 = ${863*6 + 863}`);
console.log(`But actual DP for 6-month percentage plan = ₹${Math.round(price * 0.25)} (25% of ${price})`);
console.log(`Correct: ${Math.round(price*0.25)} + (863 × 6) = ${Math.round(price*0.25) + 863*6}`);
console.log(`\nFor fixed 6-month plan: DP=₹0, so 0 + (1150 × 6) = ${0 + 1150*6}`);
