import ApiService from "./apiService";

export const ApiBaseUrl = "https://p2q5vzlw-5000.inc1.devtunnels.ms/api";
export const baseUrl = "/company";

export const apiService = ApiService();

export const ONBOARD_FILTER_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
];

export const WIDGET_FILTER_OPTIONS = [
  { label: "All Widget Status", value: "ALL" },
  { label: "Enabled", value: "ENABLED" },
  { label: "Disabled", value: "DISABLED" },
];

export const SUPERMASTER_ADMIN = 'SUPERMASTER_ADMIN';

export const ONBOARDING_STEPS = [
  { id: '01', label: 'Merchant' },
  { id: '02', label: 'Plans' },
  { id: '03', label: 'Price bands' },
  { id: '04', label: 'Configure' },
  { id: '05', label: 'Customisation' },
  { id: '06', label: 'Coupons' },
  { id: '07', label: 'Targeting' },
  { id: '08', label: 'Preview' },
  { id: '09', label: 'Publish' },
];
