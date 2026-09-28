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
