const deliveryCharge = 450;
const whatsappNumber = "94762245570";
const paymentApiBase = (window.COSMETIC_HOUSE_PAYMENT_API || "").replace(/\/$/, "");
const orderApiBase = paymentApiBase;
const authApiBase = paymentApiBase;
const shopifySettings = window.COSMETIC_HOUSE_SHOPIFY || {};

const products = [
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    slug: "the-ordinary-niacinamide-10-zinc-1",
    category: "Best Moving",
    type: "Serums",
    brand: "The Ordinary",
    image: "assets/products/the-ordinary-niacinamide-10-zinc-1.jpg",
    officialUrl: "https://theordinary.com/en-lk/niacinamide-10-zinc-1-serum-100436.html",
    price: 5150,
    color: "#151116",
    note: "Oil-control serum for blemish-prone routines.",
    description:
      "A high-demand serum style for customers who want a simple step for oily shine, visible pores, and uneven-looking texture.",
    benefits: ["Helps balance oily-looking areas", "Supports a smoother-looking skin texture", "Easy to layer under moisturizer"],
    bestFor: "Oily, combination, and blemish-prone skin. Patch test first if sensitive.",
    useWith: "Gentle cleanser, lightweight moisturizer, and daily sunscreen.",
    routine: "Use after cleansing before moisturizer. Start once daily or every other night.",
  },
  {
    name: "The Ordinary Hyaluronic Acid 2% + B5",
    slug: "the-ordinary-hyaluronic-acid-2-b5",
    category: "Best Moving",
    type: "Serums",
    brand: "The Ordinary",
    image: "assets/products/the-ordinary-hyaluronic-acid-2-b5.jpg",
    officialUrl: "https://theordinary.com/en-lk/hyaluronic-acid-2-b5-serum-100425.html",
    price: 5350,
    color: "#24091b",
    note: "Hydrating serum for plump, fresh skin.",
    description:
      "A hydrating serum option for customers who feel tightness, dehydration, or dullness without wanting a heavy cream.",
    benefits: ["Adds hydration", "Helps skin feel softer", "Works well before barrier cream"],
    bestFor: "Normal, dry, combination, and beginner skincare users.",
    useWith: "Gentle cleanser, moisturizer, and sunscreen in the morning.",
    routine: "Apply to slightly damp skin, then seal with moisturizer.",
  },
  {
    name: "CeraVe Moisturising Cream",
    slug: "cerave-moisturising-cream",
    category: "Moisturizers",
    type: "Creams",
    brand: "CeraVe",
    image: "assets/products/cerave-moisturizing-cream-340g.jpg",
    price: 7250,
    color: "#0e0d12",
    note: "Comfort cream for dry-feeling skin.",
    description:
      "A rich moisturizer choice for customers who want a stronger comfort step after serums or cleanser.",
    benefits: ["Comforts dry skin", "Helps support barrier feel", "Useful after active products"],
    bestFor: "Dry, sensitive-feeling, or barrier-weakened skin.",
    useWith: "Hydrating serum, gentle cleanser, and daytime sunscreen.",
    routine: "Apply morning and night as the last skincare step before sunscreen in the morning.",
  },
  {
    name: "Beauty of Joseon Relief Sun SPF50+",
    slug: "beauty-of-joseon-relief-sun-spf50",
    category: "Sunscreen",
    type: "SPF",
    brand: "Beauty of Joseon",
    image: "assets/products/beauty-of-joseon-relief-sun-rice-probiotics-spf50-pa.jpg",
    price: 6350,
    color: "#211019",
    note: "Soft sunscreen step for daily glow routines.",
    description:
      "A popular sunscreen style for customers who want a soft, comfortable daytime final step.",
    benefits: ["Daily daytime protection step", "Comfortable under makeup", "Helps protect glow routines"],
    bestFor: "All skin types, especially daily outdoor routines.",
    useWith: "Hydrating serum, moisturizer, and minimal daytime actives.",
    routine: "Use every morning as the last skincare step. Reapply when outdoors.",
  },
  {
    name: "Maybelline SuperStay Matte Ink",
    slug: "maybelline-superstay-matte-ink",
    category: "Makeup",
    type: "Lip Makeup",
    brand: "Maybelline",
    image: "assets/products/peptide-lip-tint-ribbon.jpg",
    price: 3950,
    color: "#2c071d",
    note: "Bold long-wear lip color.",
    description:
      "A statement lip option for customers who want stronger color payoff for photos, events, and daily glam.",
    benefits: ["Comfort matte look", "Easy to pair with blush", "Good for day-to-night makeup"],
    bestFor: "Customers who like soft glam and long-wear style lip color.",
    useWith: "Lip liner, cream blush, and a light base.",
    routine: "Apply after lip balm has settled. Blot once for a softer finish.",
  },
  {
    name: "Maybelline Fit Me Foundation",
    slug: "maybelline-fit-me-foundation",
    category: "Makeup",
    type: "Face Makeup",
    brand: "Maybelline",
    image: "assets/products/mac-m-a-c-sculpt-glow-duo-highlight-contour-palette.jpg",
    price: 4750,
    color: "#13080d",
    note: "Everyday base makeup with a polished finish.",
    description:
      "A base makeup choice for customers who want shade guidance, soft coverage, and easy blending.",
    benefits: ["Natural satin finish", "Buildable coverage", "Pairs with cream or powder products"],
    bestFor: "Normal, combination, and event makeup customers.",
    useWith: "Hydrating primer, setting powder, blush, and lipstick.",
    routine: "Apply thin layers with a sponge or brush after skincare and sunscreen.",
  },
  {
    name: "K18 Leave-In Molecular Repair Mask",
    slug: "k18-leave-in-molecular-repair-mask",
    category: "Shampoos & Hair",
    type: "Hair Treatments",
    brand: "K18",
    image: "assets/products/fino-premium-touch-penetrating-serum-hair-mask-hair-treatment-230g.jpg",
    price: 13850,
    color: "#0a0a0c",
    note: "Premium hair repair treatment.",
    description:
      "A premium haircare choice for customers who use heat styling, coloring, or frequent chemical treatments.",
    benefits: ["Helps hair feel smoother", "Adds glossy finish", "Supports weekly repair routines"],
    bestFor: "Dry, frizzy, colored, or heat-styled hair.",
    useWith: "Gentle shampoo, leave-in cream, and heat protection.",
    routine: "Use one to two times weekly after shampoo. Leave for a few minutes, then rinse.",
  },
  {
    name: "COSRX Low pH Good Morning Gel Cleanser",
    slug: "cosrx-low-ph-good-morning-gel-cleanser",
    category: "Face Wash",
    type: "Cleansers",
    brand: "COSRX",
    image: "assets/products/cosrx-low-ph-good-morning-gel-cleanser.jpg",
    price: 3950,
    color: "#1c1117",
    note: "Gentle cleanse for morning and night.",
    description:
      "A cleanser option for customers who want a simple first step before serums and moisturizer.",
    benefits: ["Removes daily oil and residue", "Keeps skin feeling soft", "Good first step for routines"],
    bestFor: "Most skin types, including beginner skincare customers.",
    useWith: "Hydrating serum, barrier cream, and sunscreen.",
    routine: "Use morning and night. Massage gently, rinse, then continue with serum.",
  },
  {
    name: "Luxury Body Wash Glow Gel",
    slug: "luxury-body-wash-glow-gel",
    category: "Body Wash",
    type: "Body Care",
    brand: "Cosmetic House Edit",
    image: "assets/products/dove-renewing-glow-pink-clay-shower-gel-500-ml.jpg",
    price: 2850,
    color: "#230015",
    note: "Soft shower gel for smooth, fresh-feeling skin.",
    description:
      "A body wash choice for fast-moving shower routines, designed to sit beautifully beside skincare and haircare.",
    benefits: ["Cleanses without a harsh feel", "Makes body-care shopping visible", "Good add-on product for orders"],
    bestFor: "Customers building a complete bath and body routine.",
    useWith: "Body lotion, body mist, deodorant, and shower accessories.",
    routine: "Use in the shower, rinse well, then apply body lotion while skin is slightly damp.",
  },
  {
    name: "Daily Smooth Shampoo",
    slug: "daily-smooth-shampoo",
    category: "Shampoos & Hair",
    type: "Shampoos",
    brand: "Cosmetic House Edit",
    image: "assets/products/tresemme-keratin-smooth-shampoo-conditioner-680ml.jpg",
    price: 3350,
    color: "#09070a",
    note: "Everyday shampoo category starter.",
    description:
      "A shampoo choice for haircare routines so customers can browse cleanser, treatment, and shower products together.",
    benefits: ["Supports haircare category browsing", "Easy add-on with masks", "Good for weekly replenishment"],
    bestFor: "Customers shopping for hair wash and treatment basics.",
    useWith: "Conditioner, hair mask, leave-in cream, and heat protection.",
    routine: "Massage into wet scalp, rinse, and follow with conditioner or mask.",
  },
  {
    name: "Celimax THE VITA-A Retinol Shot Tightening Serum 15ml",
    slug: "celimax-vita-a-retinol-shot-tightening-serum-15ml",
    category: "Best Moving",
    type: "Serums",
    brand: "Celimax",
    image: "assets/products/celimax-the-vita-a-retinol-shot-tightening-serum-30ml.jpg",
    price: 5705,
    color: "#1b0914",
    note: "Night serum for firm-looking skin routines.",
    description: "A retinol-style treatment for customers looking for a stronger night routine for texture and early aging concerns.",
    benefits: ["Supports smoother-looking texture", "Best for night routines", "Pairs well with barrier care"],
    bestFor: "Experienced skincare users. Avoid during pregnancy unless a doctor approves.",
    useWith: "Gentle cleanser, barrier moisturizer, and sunscreen the next morning.",
    routine: "Use at night two times weekly first. Do not combine with strong exfoliating acids at the beginning.",
  },
  {
    name: "Torriden DIVE-IN Low Molecular Hyaluronic Acid Soothing Cream 100ml",
    slug: "torriden-dive-in-hyaluronic-acid-soothing-cream-100ml",
    category: "Moisturizers",
    type: "Creams",
    brand: "Torriden",
    image: "assets/products/torriden-dive-in-low-molecular-hyaluronic-acid-soothing-cream-100ml.jpg",
    price: 6155,
    color: "#0b1620",
    note: "Hydrating cream for fresh, comfortable skin.",
    description: "A soothing hydration cream for customers who want moisture without a heavy, greasy finish.",
    benefits: ["Hydrates dry-feeling skin", "Comforts tightness", "Works after serums"],
    bestFor: "Normal, combination, and dehydrated skin.",
    useWith: "Hyaluronic serum, gentle cleanser, and sunscreen.",
    routine: "Apply after serum morning or night. Use sunscreen during daytime.",
  },
  {
    name: "Medicube PDRN Pink Peptide Serum",
    slug: "medicube-pdrn-pink-peptide-serum",
    category: "Best Moving",
    type: "Serums",
    brand: "Medicube",
    image: "assets/products/medicube-pdrn-pink-peptide-serum.jpg",
    price: 7001,
    color: "#26051a",
    note: "Glow serum for a bouncy-looking finish.",
    description: "A premium serum choice for customers asking for glow, smoother-looking skin, and a more polished routine.",
    benefits: ["Supports glowy-looking skin", "Good premium routine step", "Pairs well with moisturizer"],
    bestFor: "Normal, dry, and dull-looking skin.",
    useWith: "Hydrating cleanser, barrier cream, and sunscreen.",
    routine: "Use after cleansing before moisturizer. Patch test before daily use.",
  },
  {
    name: "Laneige Water Sleeping Mask 70ml",
    slug: "laneige-water-sleeping-mask-70ml",
    category: "Moisturizers",
    type: "Masks",
    brand: "Laneige",
    image: "assets/products/laneige-water-sleeping-mask-70ml.jpg",
    price: 7361,
    color: "#121529",
    note: "Night mask for hydrated morning skin.",
    description: "A night mask for customers who want a soft, rested-looking finish by morning.",
    benefits: ["Boosts overnight hydration feel", "Easy add-on for dry routines", "Comforts dull-looking skin"],
    bestFor: "Dry, normal, and dehydrated skin.",
    useWith: "Gentle cleanser, hydrating serum, and light moisturizer if needed.",
    routine: "Use as the last step at night two to three times weekly.",
  },
  {
    name: "Beauty Of Joseon Glow Serum: Propolis + Niacinamide",
    slug: "beauty-of-joseon-glow-serum-propolis-niacinamide",
    category: "Best Moving",
    type: "Serums",
    brand: "Beauty of Joseon",
    image: "assets/products/beauty-of-joseon-glow-serum-propolis-niacinamide.jpg",
    price: 5561,
    color: "#180e05",
    note: "Glow serum for uneven-looking tone.",
    description: "A glow-focused serum for customers who want a brighter, healthier-looking routine.",
    benefits: ["Supports glow", "Good for dull-looking skin", "Pairs with sunscreen"],
    bestFor: "Normal, combination, and dull-looking skin.",
    useWith: "Gentle cleanser, moisturizer, and SPF.",
    routine: "Use before moisturizer. Apply sunscreen in the morning.",
  },
  {
    name: "SKIN1004 Madagascar Centella Tone Brightening Capsule Ampoule",
    slug: "skin1004-madagascar-centella-tone-brightening-capsule-ampoule",
    category: "Best Moving",
    type: "Ampoules",
    brand: "SKIN1004",
    image: "assets/products/skin1004-madagascar-centella-tone-brightening-capsule-ampoule.jpg",
    price: 7775,
    color: "#10180f",
    note: "Brightening ampoule for calm glow routines.",
    description: "A brightening ampoule for customers who want a calm-looking, more even routine.",
    benefits: ["Supports bright-looking skin", "Light serum texture", "Pairs well with barrier cream"],
    bestFor: "Dull-looking, combination, and uneven-looking skin.",
    useWith: "Cleanser, moisturizer, and sunscreen.",
    routine: "Use after cleansing and before moisturizer. Start once daily.",
  },
  {
    name: "La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+",
    slug: "la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50",
    category: "Sunscreen",
    type: "SPF",
    brand: "La Roche-Posay",
    image: "assets/products/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50-non-perfumed.jpg",
    price: 7001,
    color: "#1b140c",
    note: "Premium sunscreen fluid for daily protection.",
    description: "A premium sunscreen option for customers who want a lightweight SPF step under makeup or daily wear.",
    benefits: ["Daily SPF step", "Light fluid finish", "Useful with active skincare routines"],
    bestFor: "Most skin types, especially customers using brightening or exfoliating products.",
    useWith: "Morning moisturizer and makeup base.",
    routine: "Apply as the last morning skincare step. Reapply outdoors.",
  },
  {
    name: "ST Ives Hydrating Vitamin E & Avocado Body Lotion",
    slug: "st-ives-hydrating-vitamin-e-avocado-body-lotion",
    category: "Body Wash",
    type: "Body Care",
    brand: "ST Ives",
    image: "assets/products/st-ives-hydrating-vitamin-e-avocado-body-lotion.jpg",
    price: 3650,
    color: "#162312",
    note: "Body lotion for soft-feeling skin.",
    description: "A bodycare add-on for customers who want moisture after shower routines.",
    benefits: ["Helps soften dry body skin", "Good after shower", "Easy repeat purchase"],
    bestFor: "Dry or normal body skin.",
    useWith: "Body wash, body mist, and deodorant.",
    routine: "Apply after shower while skin is slightly damp.",
  },
  {
    name: "Sol de Janeiro Brazilian Bum Bum Cream 240ml",
    slug: "sol-de-janeiro-brazilian-bum-bum-cream-240ml",
    category: "Body Wash",
    type: "Body Care",
    brand: "Sol de Janeiro",
    image: "assets/products/sol-de-janeiro-brazilian-bum-bum-cream-240ml.jpg",
    price: 13596,
    color: "#271206",
    note: "Premium body cream for scented bodycare routines.",
    description: "A premium body cream for customers who love fragrance-forward bodycare and soft skin routines.",
    benefits: ["Premium bodycare feel", "Great gift product", "Pairs with body mist"],
    bestFor: "Customers who like luxury bodycare and fragrance layering.",
    useWith: "Body wash and matching fragrance mist.",
    routine: "Massage onto body skin after shower.",
  },
  {
    name: "CeraVe SA Lotion for Rough & Bumpy Skin",
    slug: "cerave-sa-lotion-for-rough-bumpy-skin",
    category: "Body Wash",
    type: "Body Care",
    brand: "CeraVe",
    image: "assets/products/cerave-sa-lotion-for-rough-bumpy-skin.jpg",
    price: 7001,
    color: "#0f1218",
    note: "Body lotion for rough-feeling skin.",
    description: "A bodycare treatment-style lotion for customers asking about rough or bumpy-feeling body skin.",
    benefits: ["Helps smooth rough-feeling areas", "Bodycare treatment step", "Good for arms and legs"],
    bestFor: "Rough-feeling body skin. Avoid irritated or broken skin.",
    useWith: "Gentle body wash and sunscreen for exposed areas.",
    routine: "Apply to body skin as directed. Start slowly if sensitive.",
  },
];

const state = {
  category: "All",
  brand: "",
  search: "",
  sort: "featured",
  cart: [],
  wishlist: [],
  visibleCount: 10,
  recentlyViewed: [],
  currentProductIndex: null,
  currentOrderId: null,
  account: null,
};

let catalogLoaded = false;
let isLoggedIn = false;
let authMode = "login";
let authStep = "identity";

const productGrid = document.querySelector("[data-products]");
const loadMoreButton = document.querySelector("[data-load-more-products]");
const photoList = document.querySelector("[data-photo-list]");
const heroMix = document.querySelector("[data-hero-mix]");
const filterRow = document.querySelector("[data-filters]");
const searchInput = document.querySelector("[data-search]");
const searchSuggestionsPanel = document.querySelector("[data-search-suggestions]");
const sortSelect = document.querySelector("[data-sort]");
const cartDrawer = document.querySelector("[data-cart]");
const cartItems = document.querySelector("[data-cart-items]");
const cartRecommendations = document.querySelector("[data-cart-recommendations]");
const cartCount = document.querySelector("[data-cart-count]");
const subtotalEl = document.querySelector("[data-subtotal]");
const totalEl = document.querySelector("[data-total]");
const checkoutButton = document.querySelector("[data-checkout]");
const whatsAppCheckoutLink = document.querySelector("[data-whatsapp-checkout]");
const orderForm = document.querySelector("[data-order-form]");
const orderIdPreview = document.querySelector("[data-order-id]");
const orderIdField = document.querySelector("[data-order-id-field]");
const orderSubjectField = document.querySelector("[data-order-subject]");
const orderItemsField = document.querySelector("[data-order-items-field]");
const orderSubtotalField = document.querySelector("[data-order-subtotal-field]");
const orderTotalField = document.querySelector("[data-order-total-field]");
const orderPaymentField = document.querySelector("[data-order-payment-field]");
const orderWhatsAppField = document.querySelector("[data-order-whatsapp-field]");
const orderStatusPanel = document.querySelector("[data-order-status]");
const cancelOrderButton = document.querySelector("[data-cancel-order]");
const cancelReasonBox = document.querySelector("[data-cancel-reason-box]");
const cancelReasonField = document.querySelector("[data-cancel-reason]");
const confirmCancelButton = document.querySelector("[data-confirm-cancel]");
const mapPinButton = document.querySelector("[data-map-pin]");
const locationStatus = document.querySelector("[data-location-status]");
const onlinePaymentInput = document.querySelector('input[name="payment"][value="Online card payment"]');
const codPaymentInput = document.querySelector('input[name="payment"][value="Cash on delivery"]');
const whatsAppQuickLinks = document.querySelectorAll("[data-whatsapp-quick]");
const whatsAppTemplateLinks = document.querySelectorAll("[data-whatsapp-template]");
const productPage = document.querySelector("[data-product-page]");
const productPageContent = document.querySelector("[data-product-page-content]");
const themeLabel = document.querySelector("[data-theme-label]");
const aiForm = document.querySelector("[data-ai-form]");
const aiInput = document.querySelector("[data-ai-input]");
const aiLog = document.querySelector("[data-ai-log]");
const loginDialog = document.querySelector("[data-login-dialog]");
const loginForm = document.querySelector("[data-login-form]");
const loginTitle = document.querySelector("[data-login-title]");
const loginButton = document.querySelector("[data-open-login]");
const authModeButtons = document.querySelectorAll("[data-auth-mode]");
const signupOnlyFields = document.querySelectorAll("[data-signup-only]");
const loginOnlyFields = document.querySelectorAll("[data-login-only]");
const verificationStep = document.querySelector("[data-verification-step]");
const verifyCodeButton = document.querySelector("[data-send-code]");
const verificationCodeInput = document.querySelector("[data-verification-code]");
const authStatus = document.querySelector("[data-auth-status]");
const authSubmitButton = document.querySelector("[data-auth-submit]");
const authIntro = document.querySelector("[data-auth-intro]");
const forgotPasswordButton = document.querySelector("[data-forgot-password]");
const profileDialog = document.querySelector("[data-profile-dialog]");
const profileForm = document.querySelector("[data-profile-form]");
const profileTitle = document.querySelector("[data-profile-title]");
const profileStatus = document.querySelector("[data-profile-status]");
const ordersDialog = document.querySelector("[data-orders-dialog]");
const ordersButton = document.querySelector("[data-open-orders]");
const customerOrdersList = document.querySelector("[data-customer-orders]");
const galleryUploadInput = document.querySelector("[data-gallery-upload]");
const uploadName = document.querySelector("[data-upload-name]");
const cardForm = document.querySelector("[data-card-form]");
const paymentStatus = document.querySelector("[data-payment-status]");
const reviewForm = document.querySelector("[data-review-form]");
const reviewList = document.querySelector("[data-review-list]");
let visibleReviewCount = 9;
const assetDialog = document.querySelector("[data-asset-dialog]");
const assetProduct = document.querySelector("[data-asset-product]");
const assetFile = document.querySelector("[data-asset-file]");
const assetPreview = document.querySelector("[data-asset-preview]");
const assetFilename = document.querySelector("[data-asset-filename]");
const cameraDialog = document.querySelector("[data-camera-dialog]");
const cameraVideo = document.querySelector("[data-camera-video]");
const cameraCanvas = document.querySelector("[data-camera-canvas]");
const cameraStatus = document.querySelector("[data-camera-status]");
const toastStack = document.querySelector("[data-toast-stack]");
const megaMenu = document.querySelector("[data-mega-menu]");
const quickViewDialog = document.querySelector("[data-quick-view-dialog]");
const quickViewContent = document.querySelector("[data-quick-view-content]");
let cameraStream = null;
let capturedImageName = "";
const paymentGateway = {
  checked: false,
  ready: false,
  message: "Secure card payment will activate after merchant approval.",
};

const formatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

function money(value) {
  return formatter.format(value).replace("LKR", "LKR ");
}

function whatsAppUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function ownerConfirmationNote() {
  return "Please confirm my order details and next steps.";
}

function showToast(message, type = "success") {
  if (!toastStack) return;
  const toast = document.createElement("p");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastStack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function createOrderId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CHLK-${datePart}-${randomPart}`;
}

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function productText(product) {
  return normalizeText(`${product.name} ${product.brand} ${product.category} ${product.type} ${product.note} ${product.description}`);
}

function productIdentityText(product) {
  return normalizeText(`${product.name} ${product.brand} ${product.category} ${product.type} ${product.note}`);
}

function productNameText(product) {
  return normalizeText(`${product.name} ${product.brand} ${product.type} ${product.note}`);
}

function inferBrand(product) {
  const name = normalizeText(product.name);
  const normalizedName = name.replace(/[.\-]/g, " ");
  const brands = [
    "The Ordinary",
    "Beauty of Joseon",
    "La Roche-Posay",
    "CeraVe",
    "Anua",
    "Medicube",
    "Laneige",
    "Biodance",
    "COSRX",
    "Cetaphil",
    "Neutrogena",
    "Dove",
    "EOS",
    "Innisfree",
    "Dr. Althea",
    "Torriden",
    "Rhode",
    "SKIN1004",
    "K Secret",
    "The Body Shop",
    "OGX",
    "Some By Mi",
    "Sol de Janeiro",
    "L'Oreal",
    "Nivea",
    "Johnson's",
    "Vaseline",
    "St. Ives",
    "Balance Active",
    "Fade Out",
    "Pixi",
    "Mielle",
    "Supergoop",
    "PanOxyl",
    "AXIS-Y",
    "Simple",
    "Pyary",
    "Yoko",
    "Fino",
    "TRESemme",
    "Tiam",
    "Round Lab",
    "Nature Republic",
  ];
  return brands.find((brand) => normalizedName.includes(normalizeText(brand).replace(/[.\-]/g, " "))) || product.brand || "Beauty Edit";
}

function sanitizeCatalogProduct(product) {
  const brand = inferBrand(product);
  const { sourceUrl, ...cleanProduct } = product;
  return {
    ...cleanProduct,
    brand,
  };
}

function productInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function productImageMarkup(product, mode = "card") {
  const missing = `<span class="missing-photo"><strong>${product.brand}</strong><small>${product.name}</small></span>`;
  const imageSrc = `${product.image}?v=20260521c`;
  const errorAction =
    mode === "card"
      ? "this.onerror=null;this.src='cosmetic-house-logo.jpeg';this.closest('.real-product-frame')?.classList.remove('missing-image');this.closest('.real-product-frame')?.classList.add('has-image','fallback-image');"
      : "this.onerror=null;this.src='cosmetic-house-logo.jpeg';this.closest('.real-product-frame')?.classList.remove('missing-image');this.closest('.real-product-frame')?.classList.add('has-image','fallback-image');";
  return `
    <div class="${mode === "detail" ? "dialog-photo" : "product-photo"} real-product-frame missing-image" style="--photo-color: ${product.color}">
      <img class="product-main-image" src="${imageSrc}" alt="${product.name}" loading="${mode === "card" ? "lazy" : "eager"}" decoding="async" onload="this.closest('.real-product-frame').classList.remove('missing-image');this.closest('.real-product-frame').classList.add('has-image');" onerror="${errorAction}" />
      ${missing}
      <strong>${productInitials(product.name)}</strong>
    </div>
  `;
}

function renderFilters() {
  const priority = [
    "All",
    "Best Moving",
    "Skincare",
    "Korean Beauty",
    "Cleansers",
    "Serums",
    "Moisturizers",
    "Sunscreen",
    "Makeup",
    "Body Care",
    "Shampoos & Hair",
    "Fragrance",
    "Luxury Brands",
  ];
  const existing = [...new Set(products.flatMap((product) => [product.category, product.type]))];
  const categories = [...priority, ...existing.filter((category) => !priority.includes(category))];
  filterRow.innerHTML = categories
    .map(
      (category) =>
        `<button type="button" class="${state.category === category ? "active" : ""}" data-category="${category}">${category}</button>`,
    )
    .join("");
}

function renderHeroMix() {
  const mixSlots = [
    { brand: "The Ordinary", file: "assets/products/hero-the-ordinary-cutout.png" },
    { brand: "CeraVe", file: "assets/products/hero-cerave-cutout.png" },
    { brand: "Rhode", file: "assets/products/hero-rhode-cutout.png" },
    { brand: "Anua", file: "assets/products/hero-anua-cutout.png" },
  ];
  const mix = mixSlots.map((slot) => {
    const match = products.find((product) => product.brand.toLowerCase().includes(slot.brand.toLowerCase()));
    return {
      name: match?.name || `${slot.brand} beauty edit`,
      brand: slot.brand,
      image: slot.file,
      color: match?.color || "#160811",
    };
  });
  heroMix.innerHTML = mix
    .map(
      (product) => `
        <div class="hero-mix-card real-product-frame missing-image" style="--photo-color:${product.color}">
          <img src="${product.image}?v=20260521c" alt="${product.name}" loading="eager" decoding="async" onload="this.closest('.real-product-frame').classList.remove('missing-image');this.closest('.real-product-frame').classList.add('has-image');" onerror="this.closest('.hero-mix-card')?.remove();" />
        </div>
      `,
    )
    .join("");
}

function filteredProducts() {
  const query = state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const searchable = productText(product);
    const activeCategory = normalizeText(state.category);
    const activeBrand = normalizeText(state.brand);
    const matchesCategory =
      state.category === "All" ||
      normalizeText(product.category) === activeCategory ||
      normalizeText(product.type) === activeCategory ||
      (state.category === "Skincare" && /(serum|cream|cleanser|spf|sunscreen|moistur|toner|ampoule|mask|retinol|niacinamide)/.test(searchable)) ||
      (state.category === "Korean Beauty" && /(beauty of joseon|anua|cosrx|laneige|skin1004|torriden|medicube|biodance|round lab|some by mi|innisfree|dr\. althea|k secret|celimax)/.test(searchable)) ||
      (state.category === "Luxury Brands" && /(rhode|sol de janeiro|k18|la roche|laneige|supergoop|rare|dior|cerave)/.test(searchable)) ||
      (state.category === "Fragrance" && /(mist|fragrance|perfume|scent|body spray)/.test(searchable)) ||
      (state.category === "Cleansers" && /(cleanser|cleansing|face wash|gel wash|micellar|foam|wash)/.test(searchable)) ||
      (state.category === "Serums" && /(serum|ampoule|niacinamide|retinol|retinal|vitamin c|hyaluronic|peptide|alpha arbutin|bha|aha)/.test(searchable)) ||
      (state.category === "Body Care" && /(body|lotion|scrub|polish|wash|shower|vaseline|dove|salt bath)/.test(searchable)) ||
      ((state.category === "SPF & Sun Care" || state.category === "Sunscreen") && /(spf|sun|sunscreen|uv|anthelios)/.test(searchable));
    const matchesBrand = !activeBrand || normalizeText(product.brand).includes(activeBrand) || normalizeText(product.name).includes(activeBrand);
    const matchesSearch = !query || searchable.includes(query);
    return matchesCategory && matchesBrand && matchesSearch;
  });
  return filtered.sort((a, b) => {
    if (state.sort === "price-low") return a.price - b.price;
    if (state.sort === "price-high") return b.price - a.price;
    if (state.sort === "rating") return Number(productRating(b).rating) - Number(productRating(a).rating);
    return products.indexOf(a) - products.indexOf(b);
  });
}

function productRating(product) {
  const seed = product.name.length + product.brand.length + product.price;
  return {
    rating: seed % 5 === 0 ? "4.7" : seed % 3 === 0 ? "4.8" : "4.9",
    count: 18 + (seed % 84),
  };
}

function productTag(product) {
  const text = productText(product);
  if (product.category === "Best Moving") return "Hot Selling";
  if (/tiktok|viral|rhode|anua|beauty of joseon|cosrx|skin1004/.test(text)) return "Trending";
  if (product.price > 9000) return "Luxury Pick";
  if (/sunscreen|spf/.test(text)) return "Daily Essential";
  return "Customer Favorite";
}

function stockLabel(product) {
  const seed = product.slug.length + product.name.length + product.price;
  if (seed % 7 === 0) return "Limited Stock";
  if (seed % 5 === 0) return "Fast Moving";
  return "Available";
}

function persistRecentlyViewed(product) {
  state.recentlyViewed = [product.slug, ...state.recentlyViewed.filter((slug) => slug !== product.slug)].slice(0, 8);
  localStorage.setItem("cosmetic-house-recently-viewed", JSON.stringify(state.recentlyViewed));
}

function recentlyViewedProducts(currentProduct) {
  return state.recentlyViewed
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product) => product && product.slug !== currentProduct.slug)
    .slice(0, 4);
}

function ingredientFocus(product) {
  const text = productText(product);
  if (text.includes("niacinamide")) return "Niacinamide support for tone, oil-control, and smoother-looking texture.";
  if (text.includes("retinol") || text.includes("retinal")) return "Retinoid care for night routines focused on texture and early-aging concerns.";
  if (text.includes("hyaluronic")) return "Hyaluronic hydration for plump, fresh, comfortable-looking skin.";
  if (text.includes("salicylic") || text.includes("bha")) return "BHA-style care for pores, oiliness, and blemish-prone routines.";
  if (text.includes("vitamin c")) return "Vitamin C-style brightening support for dull-looking skin.";
  if (text.includes("spf") || text.includes("sun") || text.includes("sunscreen")) return "Daily UV protection step for morning routines.";
  if (text.includes("cleanser") || text.includes("wash")) return "A clean first step to prepare skin or hair for the rest of the routine.";
  return "A focused beauty step selected to fit simple, balanced routines.";
}

function pairingRecommendation(product) {
  const text = productText(product);
  if (text.includes("sunscreen") || text.includes("spf")) return "Pair with a gentle cleanser, hydrating serum, and light moisturizer.";
  if (text.includes("retinol") || text.includes("retinal")) return "Pair with a gentle cleanser, barrier moisturizer, and morning sunscreen.";
  if (text.includes("cleanser") || text.includes("wash")) return "Pair with a serum, moisturizer, and daytime SPF.";
  if (text.includes("hair") || text.includes("shampoo")) return "Pair with conditioner, a weekly mask, and heat protection.";
  return product.useWith || "Pair with cleanser, moisturizer, and sunscreen for a balanced routine.";
}

function relatedProducts(product, limit = 4) {
  const words = [product.brand, product.category, product.type].map(normalizeText);
  return products
    .filter((candidate) => candidate.slug !== product.slug && words.some((word) => word && productText(candidate).includes(word)))
    .slice(0, limit);
}

function mergeCatalogProducts(catalogProducts) {
  const cleanCatalog = catalogProducts.filter((product) => product.slug && product.image).map(sanitizeCatalogProduct);
  if (!cleanCatalog.length) return;
  products.length = 0;
  products.push(...cleanCatalog);
}

function renderProducts() {
  productGrid.classList.add("is-filtering");
  const items = filteredProducts();
  const visibleItems = items.slice(0, state.visibleCount);
  productGrid.innerHTML = visibleItems
    .map((product) => {
      const index = products.indexOf(product);
      const rating = productRating(product);
      return `
        <article class="product-card">
          <button class="product-open" type="button" data-view="${index}" aria-label="Open ${product.name}">
            ${productImageMarkup(product)}
            <span class="product-ribbon">${productTag(product)}</span>
          </button>
          <div class="body">
            <div class="card-meta-row">
              <span class="badge">${product.brand} / ${product.category}</span>
              <button class="wishlist-button${state.wishlist.includes(product.slug) ? " saved" : ""}" type="button" aria-label="Save ${product.name} to wishlist">
                ${state.wishlist.includes(product.slug) ? "Saved" : "Love"}
              </button>
            </div>
            <button class="product-title" type="button" data-view="${index}">${product.name}</button>
            <div class="rating-row"><span>5 stars</span><small>${rating.rating} (${rating.count})</small></div>
            <p>${product.note}</p>
            <div class="best-for-labels"><span>${product.type}</span><span>${product.category}</span></div>
            <div class="price-row">
              <strong>${money(product.price)}</strong>
              <span>${stockLabel(product)}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="button primary" type="button" data-add="${index}">Quick add</button>
            <button class="button secondary" type="button" data-quick-view="${index}">Quick view</button>
          </div>
        </article>
      `;
    })
    .join("");
  const canLoadMore = items.length > state.visibleCount;
  loadMoreButton.hidden = !canLoadMore;
  loadMoreButton.disabled = !canLoadMore;
  loadMoreButton.textContent = canLoadMore ? `Show more products (${items.length - state.visibleCount} left)` : "All products shown";
  setTimeout(() => productGrid.classList.remove("is-filtering"), 160);
}

function renderPhotoList() {
  photoList.innerHTML = products
    .slice(0, 40)
    .map(
      (product) => `
        <article class="photo-item">
          <div class="photo-thumb real-product-frame" style="--photo-color: ${product.color}">
            <img src="${product.image}?v=20260521c" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='cosmetic-house-logo.jpeg';this.closest('.real-product-frame')?.classList.add('fallback-image');" />
          </div>
          <div>
            <span class="badge">${product.brand}</span>
            <h3>${product.name}</h3>
            <p>${product.note}</p>
            <strong>${money(product.price)}</strong>
            <button class="text-button" type="button" data-view="${products.indexOf(product)}">View details</button>
          </div>
        </article>
      `,
    )
    .join("");
}

const defaultReviews = [
  { name: "Nethmi", email: "nethmi@example.com", rating: "5", sample: true, text: "Helpful routine guidance and clear product explanations before checkout." },
  { name: "Amaya", email: "amaya@example.com", rating: "5", sample: true, text: "Loved how simple the serum and sunscreen steps were explained." },
  { name: "Dinuki", email: "dinuki@example.com", rating: "4", sample: true, text: "Friendly response and good help choosing a beginner routine." },
  { name: "Hiruni", email: "hiruni@example.com", rating: "5", sample: true, text: "The product page made it easy to understand how to use each item." },
  { name: "Kavindi", email: "kavindi@example.com", rating: "5", sample: true, text: "Nice skincare suggestions for oily skin without pushing too many products." },
  { name: "Sashini", email: "sashini@example.com", rating: "4", sample: true, text: "Good service and useful advice for matching moisturizer with serum." },
  { name: "Tharushi", email: "tharushi@example.com", rating: "5", sample: true, text: "Clean product photos and easy checkout flow." },
  { name: "Imasha", email: "imasha@example.com", rating: "5", sample: true, text: "The routine guide helped me understand morning and night steps." },
  { name: "Rashmi", email: "rashmi@example.com", rating: "4", sample: true, text: "Quick replies and practical beauty advice." },
  { name: "Shanika", email: "shanika@example.com", rating: "5", sample: true, text: "Good explanation about patch testing and using actives slowly." },
  { name: "Malki", email: "malki@example.com", rating: "5", sample: true, text: "Easy to browse by cleanser, sunscreen, and moisturizer categories." },
  { name: "Ishara", email: "ishara@example.com", rating: "4", sample: true, text: "Helpful for comparing products before messaging to order." },
  { name: "Nadeesha", email: "nadeesha@example.com", rating: "5", sample: true, text: "The Beauty AI routine answer felt clear and beginner friendly." },
  { name: "Dilmi", email: "dilmi@example.com", rating: "5", sample: true, text: "Professional page and simple product descriptions." },
  { name: "Piumi", email: "piumi@example.com", rating: "4", sample: true, text: "Good guidance, especially for sunscreen and moisturizer pairing." },
  { name: "Hashini", email: "hashini@example.com", rating: "5", sample: true, text: "Loved the premium look and easy product opening pages." },
  { name: "Sachini", email: "sachini@example.com", rating: "5", sample: true, text: "The cart recommendations make it easier to complete a routine." },
  { name: "Anjali", email: "anjali@example.com", rating: "4", sample: true, text: "Clear pricing and product information before final confirmation." },
  { name: "Minoli", email: "minoli@example.com", rating: "5", sample: true, text: "Helpful product benefits and how-to-use details." },
  { name: "Ruwani", email: "ruwani@example.com", rating: "5", sample: true, text: "The website feels trustworthy and easy to scan." },
  { name: "Fathima", email: "fathima@example.com", rating: "4", sample: true, text: "Good mix of skincare, haircare, and makeup categories." },
  { name: "Ayesha", email: "ayesha@example.com", rating: "5", sample: true, text: "Nice support for choosing products by concern and budget." },
  { name: "Nimasha", email: "nimasha@example.com", rating: "5", sample: true, text: "Product pages explain benefits without feeling confusing." },
  { name: "Dulani", email: "dulani@example.com", rating: "4", sample: true, text: "Good shopping flow from product card to cart." },
  { name: "Sanduni", email: "sanduni@example.com", rating: "5", sample: true, text: "Beautiful theme and clear routine advice." },
];

function getReviews() {
  try {
    const savedReviews = JSON.parse(localStorage.getItem("cosmetic-house-reviews")) || [];
    return [...savedReviews, ...defaultReviews].slice(0, 30);
  } catch {
    return defaultReviews;
  }
}

function renderReviews() {
  const reviews = getReviews();
  const visible = reviews.slice(0, visibleReviewCount);
  reviewList.innerHTML =
    visible
    .map(
      (review) => `
        <article class="review-card">
          <strong>${review.name}</strong>
          <small>${review.sample ? "Verified customer" : review.email || "Email verified"}</small>
          <span class="review-stars-clean">${Array.from({ length: Number(review.rating) }, () => "&#9733;").join("")}</span>
          <p>${review.text}</p>
        </article>
      `,
    )
      .join("") +
    (reviews.length > visibleReviewCount
      ? `<button class="button secondary full review-more-button" type="button" data-show-more-reviews>Show more reviews</button>`
      : "");
}

function renderAssetProducts() {
  if (!assetProduct || !assetFilename) return;
  assetProduct.innerHTML = products
    .map((product) => `<option value="${product.image}">${product.name}</option>`)
    .join("");
  assetFilename.textContent = assetProduct.value || "";
}

async function loadCatalogProducts() {
  if (catalogLoaded) return;
  try {
    if (Array.isArray(window.COSMETIC_HOUSE_CATALOG) && window.COSMETIC_HOUSE_CATALOG.length) {
      mergeCatalogProducts(window.COSMETIC_HOUSE_CATALOG);
      catalogLoaded = true;
      renderFilters();
      renderProducts();
      renderPhotoList();
      renderHeroMix();
      renderAssetProducts();
      return;
    }
    const response = await fetch("catalog-data.json", { cache: "no-store" });
    if (!response.ok) return;
    const catalogProducts = await response.json();
    mergeCatalogProducts(catalogProducts);
    catalogLoaded = true;
    renderFilters();
    renderProducts();
    renderPhotoList();
    renderHeroMix();
    renderAssetProducts();
  } catch {
    catalogLoaded = false;
  }
}

function renderProductPage(index) {
  const product = products[index];
  const rating = productRating(product);
  const related = relatedProducts(product);
  state.currentProductIndex = index;
  persistRecentlyViewed(product);
  const recent = recentlyViewedProducts(product);
  productPage.hidden = false;
  document.body.classList.add("product-mode");
  history.replaceState(null, "", `#product/${product.slug}`);
  productPageContent.innerHTML = `
    <div class="product-page-photo">
      ${productImageMarkup(product, "detail")}
      <div class="detail-gallery" aria-label="Product gallery">
        <button type="button" class="active"><img src="${product.image}?v=20260521c" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='cosmetic-house-logo.jpeg';" /></button>
        ${related
          .slice(0, 3)
          .map((item) => `<button type="button" data-view-related="${products.indexOf(item)}"><img src="${item.image}?v=20260521c" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='cosmetic-house-logo.jpeg';" /></button>`)
          .join("")}
      </div>
      <div class="routine-wheel" aria-label="Routine placement">
        <span>Cleanse</span>
        <span>Treat</span>
        <span>Moisturize</span>
        <span>Protect</span>
      </div>
    </div>
    <div class="product-page-body">
      <div>
        <p class="eyebrow">${product.brand} / ${product.category}</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="rating-row detail-rating"><span>5 stars</span><small>${rating.rating} out of 5 - ${rating.count} reviews</small></div>
        <div class="price-row">
          <strong>${money(product.price)}</strong>
          <span>${stockLabel(product)}</span>
        </div>
      </div>
        <div class="detail-trust-row">
          <span>100% authentic sourcing</span>
          <span>Islandwide delivery</span>
          <span>COD / bank / card ready</span>
        </div>
      <div class="detail-list">
        <article><strong>Why use it</strong><span>${product.benefits.join(", ")}.</span></article>
        <article><strong>Best for</strong><span>${product.bestFor}</span></article>
        <article><strong>Ingredient focus</strong><span>${ingredientFocus(product)}</span></article>
        <article><strong>Best to use with</strong><span>${product.useWith}</span></article>
        <article><strong>Routine pairing</strong><span>${pairingRecommendation(product)}</span></article>
        <article><strong>How to use</strong><span>${product.routine}</span></article>
        <article><strong>Delivery</strong><span>Estimated delivery is usually 2-5 working days after confirmation, depending on city and courier flow.</span></article>
        <article><strong>FAQ</strong><span>Patch test first. Avoid using too many actives together. Message us if you need routine matching before ordering.</span></article>
      </div>
      <div class="love-panel">
        <strong>Beauty match idea</strong>
        <p>Build a balanced routine with one focused step, one support product, and daily protection instead of adding too many actives at once.</p>
      </div>
      ${
        related.length
          ? `<div class="related-products"><strong>Complete the routine</strong><div>${related
              .map((item) => {
                const relatedIndex = products.indexOf(item);
                return `<button type="button" data-view-related="${relatedIndex}">${item.name}<span>${money(item.price)}</span></button>`;
              })
              .join("")}</div></div>`
          : ""
      }
      ${
        recent.length
          ? `<div class="related-products"><strong>Recently viewed</strong><div>${recent
              .map((item) => `<button type="button" data-view-related="${products.indexOf(item)}">${item.name}<span>${money(item.price)}</span></button>`)
              .join("")}</div></div>`
          : ""
      }
      <a class="button secondary" href="${whatsAppUrl(`Hi Cosmetic House.lk, I want help with ${product.name}. My skin type/concern is: `)}" target="_blank" rel="noreferrer">Ask on WhatsApp</a>
      <div class="product-page-cta">
        <button class="button primary" type="button" data-add="${index}">Add to cart</button>
        <a class="button secondary" href="${whatsAppUrl(`Hi Cosmetic House.lk, quick order for ${product.name}. Please confirm availability and final price.`)}" target="_blank" rel="noreferrer">WhatsApp order</a>
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectedPaymentMethod() {
  const selected = document.querySelector('input[name="payment"]:checked');
  if (selected?.disabled) return "Cash on delivery";
  return selected?.value || "Cash on delivery";
}

function renderCart() {
  const subtotal = state.cart.reduce((sum, product) => sum + product.price, 0);
  const total = subtotal ? subtotal + deliveryCharge : 0;
  const orderId = state.currentOrderId || createOrderId();
  state.currentOrderId = orderId;

  cartCount.textContent = state.cart.length;
  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(total);
  if (orderStatusPanel && !orderStatusPanel.dataset.persist) orderStatusPanel.hidden = true;
  if (cancelReasonBox) cancelReasonBox.hidden = true;

  cartItems.innerHTML = state.cart.length
    ? state.cart
        .map(
          (product, index) => `
            <div class="cart-item">
              <div>
                <strong>${product.name}</strong>
                <small>${money(product.price)}</small>
              </div>
              <button type="button" data-remove="${index}">Remove</button>
            </div>
          `,
        )
        .join("")
    : `<p class="cart-note">Add products to prepare an order request.</p>`;

  renderCartRecommendations();

  const payment = selectedPaymentMethod();
  const orderItems = state.cart.map((product) => `- ${product.name}: ${money(product.price)}`).join("\n") || "- Product name";
  const message = `Hi Cosmetic House.lk, I want to order.\nOrder ID: ${orderId}\n${orderItems}\n\nDelivery: ${money(deliveryCharge)}\nTotal: ${money(total)}\nPayment method: ${payment}\n${ownerConfirmationNote()}`;
  if (whatsAppCheckoutLink) whatsAppCheckoutLink.href = whatsAppUrl(message);
  if (orderIdPreview) orderIdPreview.textContent = orderId;
  if (orderIdField) orderIdField.value = orderId;
  if (orderSubjectField) orderSubjectField.value = `New Cosmetic House order ${orderId}`;
  if (orderItemsField) orderItemsField.value = orderItems;
  if (orderSubtotalField) orderSubtotalField.value = money(subtotal);
  if (orderTotalField) orderTotalField.value = money(total);
  if (orderPaymentField) orderPaymentField.value = payment;
  if (orderWhatsAppField) orderWhatsAppField.value = message;
  if (checkoutButton) checkoutButton.disabled = !state.cart.length;
  if (cancelOrderButton) cancelOrderButton.disabled = !state.cart.length;
  if (checkoutButton) {
    checkoutButton.textContent = shopifyEnabled()
      ? "Checkout with Shopify"
      : payment === "Online card payment" && paymentGateway.ready
        ? "Pay securely"
        : "Place order";
  }
  cardForm.hidden = selectedPaymentMethod() !== "Online card payment";
  if (paymentStatus) {
    paymentStatus.textContent = shopifyEnabled()
      ? "Secure checkout will open in Shopify."
      : paymentGateway.message;
  }
  autofillOrderForm();
}

function cartSuggestionProducts() {
  const inCart = new Set(state.cart.map((product) => product.slug));
  const lastItem = state.cart[state.cart.length - 1];
  const priorityTypes = lastItem ? [lastItem.type, lastItem.category, "Sunscreen", "Moisturizers", "Cleansers", "Body Care"] : [];
  const scored = products
    .filter((product) => !inCart.has(product.slug))
    .map((product) => {
      let score = 0;
      if (priorityTypes.includes(product.type)) score += 3;
      if (priorityTypes.includes(product.category)) score += 2;
      if (["Sunscreen", "Moisturizers", "Face Wash", "Best Moving"].includes(product.category)) score += 1;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  return scored.slice(0, 4).map((item) => item.product);
}

function availableProducts() {
  return products.filter((product) => product.price > 0);
}

function findProductsByWords(words, limit = 5) {
  const terms = words.filter(Boolean).map(normalizeText);
  return availableProducts()
    .map((product) => {
      const text = productText(product);
      const score = terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, limit)
    .map((item) => item.product);
}

function cheapestProducts(limit = 5, filterWords = []) {
  const filtered = filterWords.length ? findProductsByWords(filterWords, 40) : availableProducts();
  return filtered.sort((a, b) => a.price - b.price).slice(0, limit);
}

function bestBrandProducts(limit = 6) {
  const preferred = ["The Ordinary", "CeraVe", "Beauty of Joseon", "Anua", "COSRX", "La Roche-Posay", "SKIN1004", "Laneige", "Medicube", "Torriden"];
  return preferred
    .map((brand) => availableProducts().find((product) => normalizeText(product.brand).includes(normalizeText(brand)) || normalizeText(product.name).includes(normalizeText(brand))))
    .filter(Boolean)
    .slice(0, limit);
}

function pickOne(words, fallbackWords = []) {
  return findProductsByWords(words, 1)[0] || findProductsByWords(fallbackWords, 1)[0] || availableProducts()[0];
}

function extractBudget(text) {
  const match = text.replace(/,/g, "").match(/(?:under|below|less than|budget|lkr|rs\.?)\s*(\d{3,6})|(\d{3,6})\s*(?:lkr|rs\.?|budget)/i);
  return match ? Number(match[1] || match[2]) : null;
}

function concernWordsFor(text) {
  if (/oily|pimple|acne|blemish|pores/.test(text)) return ["niacinamide", "salicylic", "acne", "blemish", "oil", "cleanser", "gel", "sunscreen", "spf"];
  if (/dry|dehydrat|barrier|sensitive/.test(text)) return ["hyaluronic", "cream", "moistur", "barrier", "soothing", "gentle", "cleanser", "sunscreen", "spf"];
  if (/bright|dark spot|pigment|glow|dull/.test(text)) return ["bright", "glow", "vitamin", "niacinamide", "sunscreen", "spf", "serum"];
  if (/hair|shampoo|frizz|damage/.test(text)) return ["shampoo", "mask", "hair", "conditioner", "treatment"];
  return ["cleanser", "serum", "moistur", "sunscreen", "spf"];
}

function affordableMatches(words, budget = null, limit = 8, textBuilder = productIdentityText) {
  const terms = words.map(normalizeText).filter(Boolean);
  return availableProducts()
    .filter((product) => !budget || product.price <= budget)
    .map((product) => {
      const text = textBuilder(product);
      const score = terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, limit)
    .map((item) => item.product);
}

function chooseAffordable(words, budget, usedSlugs = new Set(), textBuilder = productIdentityText) {
  const matches = affordableMatches(words, budget, 12, textBuilder).filter((product) => !usedSlugs.has(product.slug));
  return matches[0] || null;
}

function budgetRoutine(text) {
  const budget = extractBudget(text);
  const usedSlugs = new Set();
  const cleanser = chooseAffordable(["cleanser", "face wash", "cleansing foam", ...concernWordsFor(text)], budget, usedSlugs);
  if (cleanser) usedSlugs.add(cleanser.slug);
  const treatment = chooseAffordable(["serum", "ampoule", "toner", "niacinamide", "salicylic", ...concernWordsFor(text)], budget, usedSlugs);
  if (treatment) usedSlugs.add(treatment.slug);
  const moisturizer = chooseAffordable(["cream", "moistur", "lotion", "barrier", "soothing"], budget, usedSlugs);
  if (moisturizer) usedSlugs.add(moisturizer.slug);
  const sunscreen = chooseAffordable(["sunscreen", "spf", "sun stick", "sun cream"], budget, usedSlugs, productNameText);
  if (sunscreen) usedSlugs.add(sunscreen.slug);
  const picks = [cleanser, treatment, moisturizer, sunscreen].filter(Boolean);
  const budgetLine = budget ? ` under ${money(budget)}` : "";
  const sunscreenNote = sunscreen ? "" : "<br>No sunscreen matched that budget exactly, so increase the SPF budget slightly if possible.";
  return `<strong>Best budget routine${budgetLine}</strong><br>${formatProductList(picks)}${sunscreenNote}<br><br>Use order: cleanser, treatment serum, moisturizer, then sunscreen in the morning. At night skip sunscreen and keep the treatment once daily at first.`;
}

function formatProductList(list) {
  if (!list.length) return "I could not find a matching item in the current catalog.";
  return list.map((product, index) => `${index + 1}. ${product.name} - ${money(product.price)}`).join("<br>");
}

function buildRoutine(goalText) {
  const oily = /oily|pimple|acne|blemish|pores/.test(goalText);
  const dry = /dry|dehydrat|barrier|sensitive/.test(goalText);
  const bright = /bright|dark spot|pigment|glow|dull/.test(goalText);

  const cleanser = pickOne(["cleanser", "face wash", "cleansing foam"], ["cleanser"]);
  const treatment = oily
    ? pickOne(["niacinamide", "salicylic", "azelaic", "acne"], ["serum"])
    : dry
      ? pickOne(["hyaluronic", "soothing", "barrier"], ["serum"])
      : bright
        ? pickOne(["bright", "glow", "vitamin", "niacinamide"], ["serum"])
        : pickOne(["serum", "ampoule"], ["serum"]);
  const moisturizer = pickOne(["cream", "moistur", "lotion"], ["cream"]);
  const sunscreen = pickOne(["sunscreen", "spf", "uv"], ["spf"]);

  return `
    <strong>Suggested Cosmetic House routine</strong><br>
    Morning:<br>
    1. Cleanse: ${cleanser?.name || "Gentle cleanser"}<br>
    2. Treat: ${treatment?.name || "Light serum"}<br>
    3. Moisturize: ${moisturizer?.name || "Moisturizer"}<br>
    4. Protect: ${sunscreen?.name || "Sunscreen SPF"}<br><br>
    Night:<br>
    1. Cleanse again.<br>
    2. Use the treatment product only once daily at first.<br>
    3. Finish with moisturizer.<br><br>
    Start slowly, patch test, and avoid adding too many active products in the same week.
  `;
}

function renderCartRecommendations() {
  if (!state.cart.length) {
    cartRecommendations.innerHTML = "";
    return;
  }
  const suggestions = cartSuggestionProducts();
  if (!suggestions.length) {
    cartRecommendations.innerHTML = "";
    return;
  }
  cartRecommendations.innerHTML = `
    <strong>Complete the routine</strong>
    <div class="mini-products">
      ${suggestions
        .map((product) => {
          const index = products.indexOf(product);
          return `
            <article class="mini-product">
              <div>
                <span>${product.category}</span>
                <p>${product.name}</p>
                <small>${money(product.price)}</small>
              </div>
              <button type="button" data-add-recommendation="${index}">Add</button>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSearchSuggestions() {
  if (!searchSuggestionsPanel) return;
  const query = state.search.trim().toLowerCase();
  if (!query) {
    searchSuggestionsPanel.hidden = true;
    searchSuggestionsPanel.innerHTML = "";
    return;
  }
  const matches = filteredProducts().slice(0, 5);
  searchSuggestionsPanel.hidden = !matches.length;
  searchSuggestionsPanel.innerHTML = matches
    .map(
      (product) => `
        <button type="button" data-view="${products.indexOf(product)}">
          <img src="${product.image}?v=20260521c" alt="" loading="lazy" onerror="this.onerror=null;this.src='cosmetic-house-logo.jpeg';" />
          <span><strong>${product.name}</strong><small>${product.brand} - ${money(product.price)}</small></span>
        </button>
      `,
    )
    .join("");
}

function toggleWishlist(index) {
  const product = products[index];
  if (!product) return;
  const exists = state.wishlist.includes(product.slug);
  state.wishlist = exists ? state.wishlist.filter((slug) => slug !== product.slug) : [product.slug, ...state.wishlist].slice(0, 80);
  localStorage.setItem("cosmetic-house-wishlist", JSON.stringify(state.wishlist));
  showToast(exists ? "Removed from wishlist" : "Saved to wishlist");
  renderProducts();
}

function renderQuickView(index) {
  const product = products[index];
  const rating = productRating(product);
  quickViewContent.innerHTML = `
    <div class="quick-view-grid">
      ${productImageMarkup(product, "detail")}
      <div>
        <p class="eyebrow">${product.brand} / ${product.category}</p>
        <h2>${product.name}</h2>
        <div class="rating-row"><span>5 stars</span><small>${rating.rating} (${rating.count})</small></div>
        <p>${product.note}</p>
        <strong class="quick-price">${money(product.price)}</strong>
        <div class="quick-actions">
          <button class="button primary" type="button" data-add="${index}">Add to cart</button>
          <button class="button secondary" type="button" data-view="${index}">Full details</button>
        </div>
      </div>
    </div>
  `;
  quickViewDialog.showModal();
}

function openInitialProductFromHash() {
  const slug = window.location.hash.replace("#product/", "");
  if (!slug) return;
  const index = products.findIndex((product) => product.slug === slug);
  if (index >= 0) renderProductPage(index);
}

function openCart() {
  renderCart();
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function addToCart(index) {
  state.cart.push(products[index]);
  showToast(`${products[index].name} added to cart`);
  openCart();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  renderCart();
}

function orderPayloadFromForm(form) {
  const formData = new FormData(form);
  const subtotal = state.cart.reduce((sum, product) => sum + product.price, 0);
  const email = String(formData.get("customer_email") || "").trim();
  const phone = String(formData.get("customer_phone") || "").trim();
  return {
    id: state.currentOrderId,
    source: "website",
    status: "New Order",
    payment: selectedPaymentMethod(),
    paymentStatus: selectedPaymentMethod() === "Online card payment" ? "Pending" : "Pending",
    customer: {
      name: formData.get("customer_name"),
      email,
      phone,
      city: formData.get("delivery_city"),
      district: formData.get("delivery_district"),
      address: formData.get("delivery_address"),
      locationLink: formData.get("location_link"),
      gender: state.account?.gender || "",
    },
    items: state.cart.map((product) => ({
      name: product.name,
      price: product.price,
      slug: product.slug,
      quantity: 1,
    })),
    subtotal,
    delivery: deliveryCharge,
    total: subtotal + deliveryCharge,
  };
}

async function recordOrder(payload) {
  const now = new Date().toISOString();
  const finalPayload = {
    ...payload,
    createdAt: payload.createdAt || now,
    updatedAt: now,
    activity: payload.activity || [{ at: now, text: `${payload.source || "website"} order created` }],
  };
  try {
    const savedOrders = JSON.parse(localStorage.getItem("cosmetic-house-orders")) || [];
    savedOrders.unshift(finalPayload);
    localStorage.setItem("cosmetic-house-orders", JSON.stringify(savedOrders.slice(0, 50)));
  } catch {
    // The server/email flow still continues if browser storage is unavailable.
  }
  if (!orderApiBase) return;
  try {
    await fetch(`${orderApiBase}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
      keepalive: true,
    });
  } catch {
    // FormSubmit and WhatsApp backup remain available if the admin API is temporarily unavailable.
  }
}

function localCustomerOrders() {
  const contact = normalizeText(state.account?.contact || "");
  try {
    return (JSON.parse(localStorage.getItem("cosmetic-house-orders")) || []).filter((order) => {
      const email = normalizeText(order.customer?.email);
      const phone = normalizeText(order.customer?.phone);
      return contact && (email === contact || phone === contact);
    });
  } catch {
    return [];
  }
}

async function loadCustomerOrders() {
  if (!customerOrdersList) return;
  customerOrdersList.innerHTML = `<p class="cart-note">Loading your orders...</p>`;
  let customerOrders = localCustomerOrders();
  const contact = state.account?.contact;
  if (orderApiBase && contact) {
    try {
      const response = await fetch(`${orderApiBase}/api/customer/orders?contact=${encodeURIComponent(contact)}`, { cache: "no-store" });
      const payload = await response.json();
      if (response.ok && payload.ok) customerOrders = payload.orders || customerOrders;
    } catch {
      // Local order history is shown if the live server is unreachable.
    }
  }
  customerOrdersList.innerHTML = customerOrders.length
    ? customerOrders
        .slice(0, 20)
        .map(
          (order) => `
            <article class="customer-order-card">
              <div><strong>${order.id}</strong><span>${order.status || "New Order"}</span></div>
              <p>${(order.items || []).map((item) => item.name).join(", ")}</p>
              <small>${money(Number(order.total || 0))} - ${order.paymentMethod || order.payment || "Payment pending"}</small>
            </article>
          `,
        )
        .join("")
    : `<p class="cart-note">No orders found yet. Orders placed while logged in will appear here.</p>`;
}

function validateOrderContact(form) {
  const formData = new FormData(form);
  const email = String(formData.get("customer_email") || "").trim();
  const phone = String(formData.get("customer_phone") || "").trim();
  if (email || phone) return true;
  showToast("Add an email or phone number to submit the order", "info");
  form.querySelector('[name="customer_phone"]')?.focus();
  return false;
}

function showOrderSuccess(orderId) {
  if (!orderStatusPanel) return;
  orderStatusPanel.dataset.persist = "true";
  orderStatusPanel.hidden = false;
  orderStatusPanel.innerHTML = `
    <strong>Order submitted</strong>
    <p>Your order ID is <b>${orderId}</b>. It is now saved for admin review.</p>
  `;
}

function showCancellationSaved(orderId, reason) {
  if (!orderStatusPanel) return;
  orderStatusPanel.dataset.persist = "true";
  orderStatusPanel.hidden = false;
  orderStatusPanel.innerHTML = `
    <strong>Cancellation saved</strong>
    <p>Order reference <b>${orderId}</b> was cancelled. Reason: ${reason}</p>
  `;
}

function shopifyEnabled() {
  return Boolean(shopifySettings.enabled && shopifySettings.shopDomain && shopifySettings.storefrontAccessToken);
}

function shopifyVariantForProduct(product) {
  return shopifySettings.variantMap?.[product.slug] || product.shopifyVariantId || "";
}

function shopifyFallbackUrl() {
  if (shopifySettings.fallbackShopUrl) return shopifySettings.fallbackShopUrl;
  if (shopifySettings.shopDomain) return `https://${shopifySettings.shopDomain}`;
  return "";
}

async function startShopifyCheckout() {
  if (!shopifyEnabled()) {
    const fallback = shopifyFallbackUrl();
    if (fallback) {
      window.location.href = fallback;
      return;
    }
    throw new Error("Shopify checkout is waiting for your Shopify store URL and Storefront token.");
  }

  const lines = state.cart
    .map((product) => ({ merchandiseId: shopifyVariantForProduct(product), quantity: 1 }))
    .filter((line) => line.merchandiseId);

  if (!lines.length || lines.length !== state.cart.length) {
    throw new Error("Some products are not linked to Shopify variants yet. Add the Shopify variant IDs first.");
  }

  const response = await fetch(`https://${shopifySettings.shopDomain}/api/${shopifySettings.apiVersion || "2026-04"}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifySettings.storefrontAccessToken,
    },
    body: JSON.stringify({
      query: `
        mutation CreateCart($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart { id checkoutUrl }
            userErrors { field message }
          }
        }
      `,
      variables: { lines },
    }),
  });

  const payload = await response.json();
  const errors = payload?.data?.cartCreate?.userErrors || payload?.errors || [];
  const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;
  if (!response.ok || errors.length || !checkoutUrl) {
    throw new Error(errors[0]?.message || "Shopify checkout could not start.");
  }
  window.location.href = checkoutUrl;
}

async function cancelCurrentOrder() {
  const reason = cancelReasonField?.value.trim();
  if (!reason) {
    showToast("Add a cancellation reason first", "info");
    cancelReasonField?.focus();
    return;
  }
  const subtotal = state.cart.reduce((sum, product) => sum + product.price, 0);
  const orderId = state.currentOrderId || createOrderId();
  await recordOrder({
    id: orderId,
    source: "website",
    status: "Cancelled",
    payment: selectedPaymentMethod(),
    paymentStatus: "Cancelled",
    customer: { name: "Customer", email: "", phone: "", city: "", address: "" },
    items: state.cart.map((product) => ({ name: product.name, price: product.price, slug: product.slug, quantity: 1 })),
    subtotal,
    delivery: deliveryCharge,
    total: subtotal ? subtotal + deliveryCharge : 0,
    tracking: `Cancellation reason: ${reason}`,
    activity: [{ at: new Date().toISOString(), text: `Customer cancelled: ${reason}` }],
  });
  state.cart = [];
  state.currentOrderId = null;
  cancelReasonField.value = "";
  if (orderStatusPanel) delete orderStatusPanel.dataset.persist;
  renderCart();
  showCancellationSaved(orderId, reason);
  showToast("Cancellation reason saved", "info");
}

function submitPayherePayment(fields, action) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.hidden = true;
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

async function startPayhereCheckout(form) {
  if (!paymentApiBase || !paymentGateway.ready) {
    throw new Error("Online card payment is being activated. Please choose cash on delivery or bank transfer for now.");
  }

  const formData = new FormData(form);
  const subtotal = state.cart.reduce((sum, product) => sum + product.price, 0);
  const total = subtotal + deliveryCharge;
  const response = await fetch(`${paymentApiBase}/api/payhere/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: state.currentOrderId,
      amount: total,
      items: state.cart.map((product) => ({
        name: product.name,
        price: product.price,
        quantity: 1,
      })),
      customer: {
        name: formData.get("customer_name"),
        email: formData.get("customer_email"),
        phone: formData.get("customer_phone"),
        city: formData.get("delivery_city"),
        address: formData.get("delivery_address"),
      },
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.fields || !payload.action) {
    throw new Error(payload.message || "Payment gateway could not start.");
  }
  submitPayherePayment(payload.fields, payload.action);
}

async function checkPaymentGateway() {
  if (!paymentApiBase) {
    paymentGateway.checked = true;
    paymentGateway.ready = false;
    paymentGateway.message = "Online card payment is being activated. Please choose cash on delivery or bank transfer for now.";
  } else {
    try {
      const response = await fetch(`${paymentApiBase}/health`, { cache: "no-store" });
      const payload = await response.json();
      paymentGateway.checked = true;
      paymentGateway.ready = Boolean(payload.payhereConfigured);
      paymentGateway.message = paymentGateway.ready
        ? "Secure card payment is available through the approved payment gateway."
        : "Online card payment is being activated. Please choose cash on delivery or bank transfer for now.";
    } catch {
      paymentGateway.checked = true;
      paymentGateway.ready = false;
      paymentGateway.message = "Payment gateway check is temporarily unavailable. Please choose cash on delivery or bank transfer.";
    }
  }

  if (onlinePaymentInput) onlinePaymentInput.disabled = !paymentGateway.ready;
  if (!paymentGateway.ready && onlinePaymentInput?.checked) {
    onlinePaymentInput.checked = false;
    if (codPaymentInput) codPaymentInput.checked = true;
  }
  renderCart();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("cosmetic-house-theme", theme);
  themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
}

function cosmeticsReply(question) {
  const text = question.toLowerCase();
  const hasUpload = Boolean(capturedImageName || galleryUploadInput?.files?.length);
  const uploadNote = hasUpload
    ? " I also see that you added an image, so I can include it as routine context when giving beauty guidance."
    : "";
  if (text.includes("product name") || text.includes("product names") || text.includes("what products") || text.includes("suggest product") || text.includes("recommend product")) {
    const matches = findProductsByWords(text.split(/\s+/), 6);
    return `<strong>Product suggestions from our catalog</strong><br>${formatProductList(matches.length ? matches : bestBrandProducts(6))}<br><br>Tell me your skin type and budget and I can make this into a morning/night routine.${uploadNote}`;
  }
  if (text.includes("cheap") || text.includes("low price") || text.includes("lowest") || text.includes("budget") || text.includes("affordable")) {
    const matches = affordableMatches(concernWordsFor(text), extractBudget(text), 6);
    return `${budgetRoutine(text)}<br><br><strong>More low-price matches</strong><br>${formatProductList(matches.length ? matches : cheapestProducts(6))}`;
  }
  if (text.includes("good brand") || text.includes("best brand") || text.includes("brands")) {
    return `<strong>Good brands in our catalog</strong><br>${formatProductList(bestBrandProducts(8))}<br><br>For skincare beginners, I would start with CeraVe, The Ordinary, Beauty of Joseon, Anua, COSRX, or La Roche-Posay depending on skin concern.`;
  }
  if (text.includes("routine") || text.includes("order") || text.includes("steps") || text.includes("skin care") || text.includes("skincare")) {
    return `${buildRoutine(text)}${uploadNote}`;
  }
  if (text.includes("ordinary") || text.includes("niacinamide") || text.includes("niacidamide")) {
    const matches = findProductsByWords(["ordinary", "niacinamide"], 5);
    return `<strong>The Ordinary / niacinamide options</strong><br>${formatProductList(matches)}<br><br>Niacinamide is usually chosen for oily-looking skin, pores, and uneven tone. Use after cleansing, then moisturizer, and sunscreen in the morning.`;
  }
  if (text.includes("niacinamide")) {
    return "Niacinamide is usually chosen for oily-looking skin, pores, and uneven tone. It pairs well with hyaluronic acid and moisturizer. Use sunscreen daily, and reduce frequency if your skin feels irritated.";
  }
  if (text.includes("hyaluronic") || text.includes("dehydrated")) {
    return "Hyaluronic acid is best for dehydration and plumpness. Apply it on slightly damp skin, then lock it with moisturizer. It is usually easy to pair with niacinamide, sunscreen, and barrier creams.";
  }
  if (text.includes("retinol") || text.includes("retinal")) {
    return "Retinol-style products are night products. Start two nights a week, avoid mixing the same night with strong exfoliating acids, moisturize well, and use sunscreen every morning. Avoid during pregnancy unless a doctor approves.";
  }
  if (text.includes("salicylic") || text.includes("bha")) {
    return "Salicylic acid is usually used for oily and blemish-prone skin. Start two or three nights weekly, avoid using it with retinol on the same night at first, and moisturize to protect the barrier.";
  }
  if (text.includes("vitamin c") || text.includes("bright")) {
    return "Vitamin C is usually a morning brightening step before moisturizer and sunscreen. If sensitive, use it every other morning first. Do not skip SPF when using brightening routines.";
  }
  if (text.includes("delivery") || text.includes("ship")) {
    return "We deliver islandwide in Sri Lanka. Add products to the cart to review the final delivery line, total, and payment method before confirmation.";
  }
  if (text.includes("pay") || text.includes("card") || text.includes("cod") || text.includes("cash")) {
    return "You can choose online card payment, bank transfer, or cash on delivery. Review your cart to pick the best option before confirming your order.";
  }
  if (text.includes("oily") || text.includes("pimple") || text.includes("acne")) {
    return `${buildRoutine("oily acne niacinamide salicylic cleanser sunscreen")}<br><br>For oily or blemish-prone skin, avoid adding many actives together.${uploadNote}`;
  }
  if (text.includes("dry") || text.includes("barrier") || text.includes("sensitive")) {
    return `${buildRoutine("dry sensitive barrier hyaluronic cream")}<br><br>Pause strong exfoliants until your skin feels comfortable. See a dermatologist for burning, swelling, infection, or severe irritation.${uploadNote}`;
  }
  if (text.includes("sunscreen") || text.includes("spf")) {
    return "Sunscreen should be your final morning skincare step. Use it every day, especially when using brightening, exfoliating, or acne-care products.";
  }
  if (text.includes("hair")) {
    return "For dry or damaged hair, use a repair mask once or twice weekly, then add leave-in cream and heat protection before styling.";
  }
  return `${buildRoutine(text)}<br><br>For a better match, tell me: skin type, main concern, current products, and budget.${uploadNote}`;
}

filterRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  state.brand = "";
  state.visibleCount = 10;
  renderFilters();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");
  const quickButton = event.target.closest("[data-quick-view]");
  const wishlistButton = event.target.closest(".wishlist-button");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (quickButton) renderQuickView(Number(quickButton.dataset.quickView));
  if (wishlistButton) {
    const wishlistIndex = Number(wishlistButton.closest(".product-card")?.querySelector("[data-view]")?.dataset.view);
    if (Number.isFinite(wishlistIndex)) toggleWishlist(wishlistIndex);
  }
  if (viewButton && !wishlistButton) renderProductPage(Number(viewButton.dataset.view));
});

productPageContent.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const relatedButton = event.target.closest("[data-view-related]");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (relatedButton) renderProductPage(Number(relatedButton.dataset.viewRelated));
});

quickViewContent?.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (viewButton) {
    quickViewDialog.close();
    renderProductPage(Number(viewButton.dataset.view));
  }
});

photoList.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (!viewButton) return;
  renderProductPage(Number(viewButton.dataset.view));
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  removeFromCart(Number(button.dataset.remove));
});

cartRecommendations.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-recommendation]");
  if (!button) return;
  state.cart.push(products[Number(button.dataset.addRecommendation)]);
  renderCart();
});

function setupWhatsAppLinks() {
  const quickMessage =
    "Hi Cosmetic House.lk, I need help choosing cosmetics. My skin type is: , my concern is: , my budget is: . Please suggest available products.";
  whatsAppQuickLinks.forEach((link) => {
    link.href = whatsAppUrl(quickMessage);
  });
  const templates = {
    routine:
      "Hi Cosmetic House.lk, please suggest a routine for me. Skin type: . Main concern: . Current products: . Budget: .",
    order:
      "Hi Cosmetic House.lk, I want to confirm an order. Product name: . Quantity: . City: . Payment method: . Please confirm my order details and next steps.",
    price:
      "Hi Cosmetic House.lk, please check price and availability for this product: .",
  };
  whatsAppTemplateLinks.forEach((link) => {
    link.href = whatsAppUrl(templates[link.dataset.whatsappTemplate] || quickMessage);
  });
}

document.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener("change", renderCart);
});

orderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.cart.length) {
    showToast("Please add at least one product before placing an order", "info");
    return;
  }
  if (!validateOrderContact(orderForm)) return;
  saveDeliveryDetailsFromForm(orderForm);
  renderCart();
  const payload = orderPayloadFromForm(orderForm);
  if (shopifyEnabled()) {
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Opening Shopify...";
    try {
      await recordOrder({ ...payload, source: "website-shopify", status: "Pending", payment: "Shopify checkout" });
      await startShopifyCheckout();
    } catch (error) {
      alert(error.message);
      checkoutButton.disabled = false;
      renderCart();
    }
    return;
  }
  if (selectedPaymentMethod() === "Online card payment") {
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Opening secure payment...";
    try {
      await recordOrder(payload);
      await startPayhereCheckout(orderForm);
    } catch (error) {
      alert(error.message);
      checkoutButton.disabled = false;
      checkoutButton.textContent = "Place order";
    }
    return;
  }
  checkoutButton.disabled = true;
  checkoutButton.textContent = "Submitting order...";
  await recordOrder(payload);
  showOrderSuccess(payload.id);
  state.cart = [];
  state.currentOrderId = null;
  orderForm.reset();
  renderCart();
  showToast("Order submitted successfully");
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  state.brand = "";
  state.visibleCount = 10;
  renderProducts();
  renderSearchSuggestions();
});

searchSuggestionsPanel?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  searchSuggestionsPanel.hidden = true;
  renderProductPage(Number(button.dataset.view));
});

sortSelect?.addEventListener("change", (event) => {
  state.sort = event.target.value;
  state.visibleCount = 10;
  renderProducts();
  showToast("Product list sorted", "info");
});

document.querySelectorAll("[data-category-jump]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    state.category = link.dataset.categoryJump;
    state.brand = "";
    state.visibleCount = 10;
    renderFilters();
    renderProducts();
    megaMenu.hidden = true;
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-brand-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = "All";
    state.brand = button.dataset.brandJump;
    state.search = "";
    searchInput.value = "";
    state.visibleCount = 10;
    renderFilters();
    renderProducts();
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

loadMoreButton.addEventListener("click", () => {
  state.visibleCount += 10;
  renderProducts();
});

cancelOrderButton?.addEventListener("click", () => {
  if (!state.cart.length) return;
  cancelReasonBox.hidden = !cancelReasonBox.hidden;
});

confirmCancelButton?.addEventListener("click", cancelCurrentOrder);

document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
document.querySelectorAll("[data-focus-search]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => searchInput?.focus(), 450);
  });
});
document.querySelectorAll("[data-mega-trigger]").forEach((button) => {
  button.addEventListener("click", () => {
    megaMenu.hidden = !megaMenu.hidden;
  });
});
document.addEventListener("click", (event) => {
  if (!megaMenu?.hidden && !event.target.closest("[data-mega-menu]") && !event.target.closest("[data-mega-trigger]")) {
    megaMenu.hidden = true;
  }
});
document.querySelector("[data-close-quick-view]")?.addEventListener("click", () => quickViewDialog.close());
document.querySelector("[data-back-shop]").addEventListener("click", () => {
  productPage.hidden = true;
  document.body.classList.remove("product-mode");
  history.replaceState(null, "", "#top");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
loginButton?.addEventListener("click", () => {
  if (isLoggedIn) {
    populateProfileForm();
    profileDialog?.showModal();
    return;
  }
  updateAuthMode("login");
  loginDialog.showModal();
});
document.querySelector("[data-close-login]").addEventListener("click", () => {
  sessionStorage.setItem("cosmetic-house-login-dismissed", "true");
  loginDialog.close();
});
document.querySelector("[data-close-profile]")?.addEventListener("click", () => profileDialog?.close());
document.querySelector("[data-close-orders]")?.addEventListener("click", () => ordersDialog?.close());
ordersButton?.addEventListener("click", async () => {
  if (!isLoggedIn) {
    updateAuthMode("login");
    loginDialog.showModal();
    return;
  }
  ordersDialog?.showModal();
  await loadCustomerOrders();
});
document.querySelector("[data-logout]")?.addEventListener("click", () => {
  state.account = null;
  isLoggedIn = false;
  localStorage.removeItem("cosmetic-house-account");
  updateAccountButton();
  profileDialog?.close();
  showToast("Logged out");
});

mapPinButton?.addEventListener("click", () => {
  const city = orderForm?.elements.delivery_city?.value || "";
  const district = orderForm?.elements.delivery_district?.value || "";
  const address = orderForm?.elements.delivery_address?.value || "";
  const query = [address, city, district, "Sri Lanka"].filter(Boolean).join(", ");
  if (!query.trim()) {
    locationStatus.textContent = "Add delivery city or address first, then open Maps.";
    orderForm?.elements.delivery_city?.focus();
    return;
  }
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
  locationStatus.textContent = "Maps opened. Paste the share link into the location field if you want.";
});

function updateAuthMode(mode) {
  authMode = mode;
  authStep = "identity";
  loginForm.dataset.mode = mode;
  loginForm.dataset.step = "identity";
  authModeButtons.forEach((button) => button.classList.toggle("active", button.dataset.authMode === mode));
  signupOnlyFields.forEach((field) => {
    field.hidden = mode !== "signup";
    field.querySelectorAll("input, select, textarea").forEach((input) => {
      input.required = mode === "signup" && ["full_name", "address", "confirm_password"].includes(input.name);
    });
  });
  loginOnlyFields.forEach((field) => {
    field.hidden = mode !== "login";
  });
  if (verificationStep) verificationStep.hidden = true;
  if (verificationCodeInput) {
    verificationCodeInput.required = false;
    verificationCodeInput.value = "";
  }
  const passwordField = loginForm.elements.password;
  if (passwordField) {
    passwordField.autocomplete = mode === "signup" ? "new-password" : "current-password";
  }
  if (authSubmitButton) authSubmitButton.textContent = "Continue";
  if (forgotPasswordButton) forgotPasswordButton.hidden = mode !== "login";
  if (loginTitle) loginTitle.textContent = mode === "signup" ? "Create your beauty account" : "Login to Cosmetic House.lk";
  if (authIntro) {
    authIntro.textContent =
      mode === "signup"
        ? "Create an account once, then your delivery details, wishlist, and order history stay ready."
        : "Login with the email or phone number you used when you signed up.";
  }
  if (authStatus) authStatus.textContent = mode === "signup" ? "Enter your details first. The verification code appears after Continue." : "Login with your email or phone number.";
}

authModeButtons.forEach((button) => button.addEventListener("click", () => updateAuthMode(button.dataset.authMode)));
function displayName(account = state.account) {
  const rawName = String(account?.name || "").trim();
  if (rawName) return rawName.split(/\s+/)[0];
  return String(account?.contact || "Profile").split("@")[0].slice(0, 18);
}

function updateAccountButton() {
  if (!loginButton) return;
  loginButton.textContent = isLoggedIn ? `Hi ${displayName()}` : "Login";
  loginButton.setAttribute("aria-label", isLoggedIn ? "Open profile" : "Login or sign up");
  if (ordersButton) ordersButton.hidden = !isLoggedIn;
}

function populateProfileForm() {
  if (!profileForm || !state.account) return;
  profileTitle.textContent = `Hi ${displayName()}`;
  profileForm.elements.full_name.value = state.account.name || "";
  profileForm.elements.address.value = state.account.address || "";
  profileForm.elements.gender.value = state.account.gender || "";
  profileForm.elements.contact.value = state.account.contact || "";
  if (profileStatus) profileStatus.textContent = "Edit your profile details and save.";
}

function savedDeliveryDetails() {
  try {
    return JSON.parse(localStorage.getItem("cosmetic-house-delivery-profile") || "null") || {};
  } catch {
    return {};
  }
}

function saveDeliveryDetailsFromForm(form) {
  const formData = new FormData(form);
  const details = {
    customer_name: String(formData.get("customer_name") || "").trim(),
    customer_email: String(formData.get("customer_email") || "").trim(),
    customer_phone: String(formData.get("customer_phone") || "").trim(),
    delivery_city: String(formData.get("delivery_city") || "").trim(),
    delivery_district: String(formData.get("delivery_district") || "").trim(),
    delivery_address: String(formData.get("delivery_address") || "").trim(),
    location_link: String(formData.get("location_link") || "").trim(),
  };
  localStorage.setItem("cosmetic-house-delivery-profile", JSON.stringify(details));
}

function autofillOrderForm() {
  if (!orderForm) return;
  const delivery = savedDeliveryDetails();
  const account = state.account || {};
  const values = {
    customer_name: delivery.customer_name || account.name || "",
    customer_email: delivery.customer_email || (String(account.contact || "").includes("@") ? account.contact : ""),
    customer_phone: delivery.customer_phone || (!String(account.contact || "").includes("@") ? account.contact : ""),
    delivery_city: delivery.delivery_city || "",
    delivery_district: delivery.delivery_district || "",
    delivery_address: delivery.delivery_address || account.address || "",
    location_link: delivery.location_link || "",
  };
  Object.entries(values).forEach(([name, value]) => {
    const field = orderForm.elements[name];
    if (field && !field.value) field.value = value;
  });
}

function authProfileFromForm(formData) {
  return {
    name: String(formData.get("full_name") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    gender: String(formData.get("gender") || "").trim(),
  };
}

function validContact(contact) {
  const value = String(contact || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.replace(/\D/g, "").length >= 9;
}

function authPassword(formData) {
  return String(formData.get("password") || "");
}

function validateSignupDetails(formData) {
  const profile = authProfileFromForm(formData);
  const contact = String(formData.get("contact") || "").trim();
  const password = authPassword(formData);
  const confirmPassword = String(formData.get("confirm_password") || "");
  if (!profile.name) return { ok: false, message: "Add your full name.", field: "full_name" };
  if (!profile.address) return { ok: false, message: "Add your delivery address.", field: "address" };
  if (!validContact(contact)) return { ok: false, message: "Add a valid email or phone number.", field: "contact" };
  if (password.length < 8) return { ok: false, message: "Use at least 8 characters for your password.", field: "password" };
  if (password !== confirmPassword) return { ok: false, message: "Passwords do not match.", field: "confirm_password" };
  return { ok: true };
}

function validateLoginDetails(formData) {
  const contact = String(formData.get("contact") || "").trim();
  if (!validContact(contact)) return { ok: false, message: "Add your signup email or phone number.", field: "contact" };
  if (!authPassword(formData)) return { ok: false, message: "Enter your password.", field: "password" };
  return { ok: true };
}

function focusAuthField(name) {
  const field = loginForm?.elements?.[name];
  if (field && typeof field.focus === "function") field.focus();
}

async function localPasswordHash(contact, password) {
  const text = `${String(contact || "").trim().toLowerCase()}::${password}`;
  if (window.crypto?.subtle) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return btoa(unescape(encodeURIComponent(text)));
}

async function requestVerificationCode() {
  const formData = new FormData(loginForm);
  const contact = String(formData.get("contact") || "").trim();
  const password = authPassword(formData);
  const validation = validateSignupDetails(formData);
  if (!validation.ok) {
    authStatus.textContent = validation.message;
    focusAuthField(validation.field);
    return false;
  }
  authStatus.textContent = "Sending verification code...";
  authSubmitButton.disabled = true;
  try {
    if (!authApiBase) throw new Error("Verification server is not connected yet.");
    const response = await fetch(`${authApiBase}/api/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact,
        password,
        profile: authProfileFromForm(formData),
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || "Could not send verification code.");
    authStatus.textContent = "Verification code sent. Check your email or WhatsApp, then enter the code below.";
  } catch (error) {
    authStatus.textContent = error.message || "Live verification is being connected. Please try again shortly.";
    return false;
  } finally {
    authSubmitButton.disabled = false;
  }
  authStep = "verify";
  loginForm.dataset.step = "verify";
  if (verificationStep) verificationStep.hidden = false;
  if (verificationCodeInput) verificationCodeInput.required = true;
  if (authSubmitButton) authSubmitButton.textContent = "Verify & continue";
  verificationCodeInput?.focus();
  return true;
}

async function verifyCodeAndSaveAccount(formData) {
  const contact = String(formData.get("contact") || "").trim();
  const code = String(formData.get("verification_code") || "").trim();
  const profile = authProfileFromForm(formData);
  if (!code) {
    authStatus.textContent = "Enter the verification code.";
    verificationCodeInput?.focus();
    return null;
  }
  const response = await fetch(`${authApiBase}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact, code, profile }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.message || "Verification failed.");
  return payload.user;
}

async function loginWithAccount(formData) {
  const contact = String(formData.get("contact") || "").trim();
  const password = String(formData.get("password") || "");
  const validation = validateLoginDetails(formData);
  if (!validation.ok) {
    focusAuthField(validation.field);
    throw new Error(validation.message);
  }
  if (authApiBase) {
    const response = await fetch(`${authApiBase}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, password }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || "Login failed.");
    return payload.user;
  }
  const registered = JSON.parse(localStorage.getItem("cosmetic-house-registered-account") || "null");
  const hash = await localPasswordHash(contact, password);
  if (!registered || registered.contact !== contact || registered.passwordHash !== hash) {
    throw new Error("Create an account first, then login with the same email or phone and password.");
  }
  return registered;
}

verifyCodeButton?.addEventListener("click", requestVerificationCode);
document.querySelector("[data-open-asset]")?.addEventListener("click", () => assetDialog?.showModal());
document.querySelector("[data-close-asset]")?.addEventListener("click", () => assetDialog?.close());

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
});

aiForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = aiInput.value.trim();
  if (!question) return;
  aiLog.insertAdjacentHTML("beforeend", `<p class="user">${question}</p>`);
  aiLog.insertAdjacentHTML("beforeend", `<p>${cosmeticsReply(question)}</p>`);
  aiInput.value = "";
  aiLog.scrollTop = aiLog.scrollHeight;
});

function handleUploadChange(input, source) {
  const file = input.files?.[0];
  capturedImageName = file ? file.name : capturedImageName;
  uploadName.textContent = file ? file.name : "No image selected";
  if (file) {
    aiLog.insertAdjacentHTML(
      "beforeend",
      `<p>${source} image received: ${file.name}. Ask your skin concern and I will guide you with a suitable Cosmetic House routine.</p>`,
    );
  }
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraStatus.textContent = "Camera is not available in this browser. Use Gallery / File instead.";
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "user" } },
      audio: false,
    });
    cameraVideo.srcObject = cameraStream;
    cameraStatus.textContent = "Camera ready. Tap Capture when the photo looks clear.";
  } catch {
    cameraStatus.textContent = "Camera permission was blocked or unavailable. Use Gallery / File instead.";
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
}

function captureCameraPhoto() {
  if (!cameraVideo.videoWidth) {
    cameraStatus.textContent = "Start the camera first, then capture.";
    return;
  }
  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;
  const context = cameraCanvas.getContext("2d");
  context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
  capturedImageName = `camera-photo-${Date.now()}.jpg`;
  uploadName.textContent = capturedImageName;
  aiLog.insertAdjacentHTML(
    "beforeend",
    `<p>Camera photo captured. Ask your skin concern and I will build a product routine from the Cosmetic House catalog.</p>`,
  );
  stopCamera();
  cameraDialog.close();
}

document.querySelector("[data-open-camera]").addEventListener("click", async () => {
  cameraDialog.showModal();
  await startCamera();
});
document.querySelector("[data-start-camera]").addEventListener("click", startCamera);
document.querySelector("[data-capture-camera]").addEventListener("click", captureCameraPhoto);
document.querySelector("[data-close-camera]").addEventListener("click", () => {
  stopCamera();
  cameraDialog.close();
});
cameraDialog.addEventListener("close", stopCamera);
galleryUploadInput.addEventListener("change", () => handleUploadChange(galleryUploadInput, "Gallery/file"));

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAuthSubmit();
});

async function handleAuthSubmit() {
  const formData = new FormData(loginForm);
  const contact = String(formData.get("contact") || "").trim();
  if (authMode === "signup" && authStep === "identity") {
    await requestVerificationCode();
    return;
  }
  if (authMode === "signup") {
    try {
      authSubmitButton.disabled = true;
      authSubmitButton.textContent = "Verifying...";
      const verifiedUser = await verifyCodeAndSaveAccount(formData);
      if (!verifiedUser) return;
      state.account = verifiedUser;
      const passwordHash = await localPasswordHash(contact, String(formData.get("password") || ""));
      localStorage.setItem("cosmetic-house-registered-account", JSON.stringify({ ...state.account, passwordHash }));
    } catch (error) {
      authStatus.textContent = error.message || "Verification failed.";
      return;
    } finally {
      authSubmitButton.disabled = false;
      authSubmitButton.textContent = "Verify & continue";
    }
  } else {
    try {
      authSubmitButton.disabled = true;
      authSubmitButton.textContent = "Logging in...";
      state.account = await loginWithAccount(formData);
    } catch (error) {
      authStatus.textContent = error.message || "Create an account first, then login.";
      return;
    } finally {
      authSubmitButton.disabled = false;
      authSubmitButton.textContent = "Continue";
    }
  }
  localStorage.setItem("cosmetic-house-account", JSON.stringify(state.account));
  sessionStorage.setItem("cosmetic-house-login-dismissed", "true");
  isLoggedIn = true;
  updateAccountButton();
  autofillOrderForm();
  loginDialog.close();
  showToast(authMode === "signup" ? "Beauty account created" : "Logged in successfully");
  aiLog.insertAdjacentHTML("beforeend", "<p>Welcome back. Your beauty profile is ready for browsing, reviews, and routine guidance.</p>");
}

loginForm?.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-toggle-password]");
  if (!toggle) return;
  const input = toggle.closest(".password-shell")?.querySelector("input");
  if (!input) return;
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  toggle.textContent = shouldShow ? "Hide" : "Show";
  toggle.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
});

forgotPasswordButton?.addEventListener("click", () => {
  const contact = String(loginForm.elements.contact?.value || "").trim();
  authStatus.textContent = contact
    ? "Password reset is prepared for the live account server. For now, message us on WhatsApp and we will verify your account safely."
    : "Enter your email or phone number first, then tap Forgot password.";
  if (!contact) loginForm.elements.contact?.focus();
});

profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.account) return;
  const formData = new FormData(profileForm);
  const updated = {
    ...state.account,
    name: String(formData.get("full_name") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    gender: String(formData.get("gender") || "").trim(),
    updatedAt: new Date().toISOString(),
  };
  try {
    if (authApiBase) {
      const response = await fetch(`${authApiBase}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Could not save profile.");
      state.account = payload.user;
    } else {
      state.account = updated;
    }
    localStorage.setItem("cosmetic-house-account", JSON.stringify(state.account));
    updateAccountButton();
    populateProfileForm();
    if (profileStatus) profileStatus.textContent = "Profile saved.";
    showToast("Profile updated");
  } catch (error) {
    if (profileStatus) profileStatus.textContent = error.message || "Could not save profile.";
  }
});

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("[data-review-email]").value.trim();
  if (!email && !isLoggedIn) {
    loginDialog.showModal();
    return;
  }
  const reviews = getReviews();
  reviews.unshift({
    name: document.querySelector("[data-review-name]").value.trim(),
    email,
    rating: document.querySelector("[data-review-rating]").value,
    text: document.querySelector("[data-review-text]").value.trim(),
    sample: false,
  });
  localStorage.setItem("cosmetic-house-reviews", JSON.stringify(reviews.filter((review) => !review.sample).slice(0, 25)));
  reviewForm.reset();
  renderReviews();
});

reviewList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-show-more-reviews]");
  if (!button) return;
  visibleReviewCount += 9;
  renderReviews();
});

assetProduct?.addEventListener("change", () => {
  assetFilename.textContent = assetProduct.value;
});

assetFile?.addEventListener("change", () => {
  const file = assetFile.files?.[0];
  if (!file || !assetPreview || !assetFilename || !assetProduct) return;
  const url = URL.createObjectURL(file);
  assetPreview.innerHTML = `<img src="${url}" alt="Product preview" />`;
  assetFilename.textContent = `Save as: ${assetProduct.value}`;
});

async function initStorefront() {
  setTheme(localStorage.getItem("cosmetic-house-theme") || "light");
  trackWebsiteVisit();
  try {
    state.recentlyViewed = JSON.parse(localStorage.getItem("cosmetic-house-recently-viewed")) || [];
  } catch {
    state.recentlyViewed = [];
  }
  try {
    state.wishlist = JSON.parse(localStorage.getItem("cosmetic-house-wishlist")) || [];
  } catch {
    state.wishlist = [];
  }
  try {
    state.account = JSON.parse(localStorage.getItem("cosmetic-house-account")) || null;
    isLoggedIn = Boolean(state.account);
  } catch {
    state.account = null;
  }
  updateAccountButton();
  autofillOrderForm();
  renderReviews();
  renderCart();
  setupWhatsAppLinks();
  checkPaymentGateway();
  await loadCatalogProducts();
  if (!catalogLoaded) {
    renderFilters();
    renderProducts();
    renderPhotoList();
    renderHeroMix();
    renderAssetProducts();
  }
  openInitialProductFromHash();
  maybeOpenLoginPrompt();
}

initStorefront();

function trackWebsiteVisit() {
  const visitId = sessionStorage.getItem("cosmetic-house-visit-id") || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem("cosmetic-house-visit-id", visitId);
  let localVisits = [];
  try {
    localVisits = JSON.parse(localStorage.getItem("cosmetic-house-visits") || "[]");
  } catch {
    localVisits = [];
  }
  if (!localVisits.some((visit) => visit.id === visitId)) {
    localVisits.push({ id: visitId, page: location.pathname || "/", createdAt: new Date().toISOString() });
    localStorage.setItem("cosmetic-house-visits", JSON.stringify(localVisits.slice(-250)));
  }
  if (!authApiBase || sessionStorage.getItem("cosmetic-house-visit-synced") === "true") return;
  fetch(`${authApiBase}/api/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: visitId, page: location.pathname || "/", referrer: document.referrer }),
    keepalive: true,
  })
    .then(() => sessionStorage.setItem("cosmetic-house-visit-synced", "true"))
    .catch(() => {});
}

function maybeOpenLoginPrompt() {
  if (isLoggedIn || sessionStorage.getItem("cosmetic-house-login-dismissed") === "true") return;
  window.setTimeout(() => {
    updateAuthMode("login");
    if (!loginDialog.open) loginDialog.showModal();
  }, 800);
}
