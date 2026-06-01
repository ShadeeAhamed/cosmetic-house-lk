export const KOKO_CONFIG = {
  merchantId: "",
  apiKey: "",
  secret: "",
  webhook: "",
  environment: "pending",
  status: "COMING_SOON",
  currency: "LKR",
  country: "LK",
  installments: 3,
  brand: {
    logo: "assets/brand/koko-logo.svg",
    primary: "#2b5cff",
    accent: "#ff9bd8",
  },
  endpoints: {
    createSession: "/api/koko/session",
    verifyPayment: "/api/koko/verify",
    webhook: "/api/koko/webhook",
  },
};

export const KOKO_ENV_PLACEHOLDERS = [
  "KOKO_MERCHANT_ID=",
  "KOKO_API_KEY=",
  "KOKO_SECRET=",
  "KOKO_WEBHOOK=",
];

export default KOKO_CONFIG;
