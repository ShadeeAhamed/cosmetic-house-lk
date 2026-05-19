const deliveryCharge = 450;
const whatsappNumber = "94762245570";
const paymentApiBase = (window.COSMETIC_HOUSE_PAYMENT_API || "").replace(/\/$/, "");

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
    image: "assets/products/cerave-moisturising-cream.jpg",
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
    image: "assets/products/beauty-of-joseon-relief-sun-spf50.jpg",
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
    image: "assets/products/maybelline-superstay-matte-ink.jpg",
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
    image: "assets/products/maybelline-fit-me-foundation.jpg",
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
    image: "assets/products/k18-leave-in-molecular-repair-mask.jpg",
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
    image: "assets/products/luxury-body-wash-glow-gel.jpg",
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
    image: "assets/products/daily-smooth-shampoo.jpg",
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
    image: "assets/products/celimax-vita-a-retinol-shot-tightening-serum-15ml.jpg",
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
    image: "assets/products/torriden-dive-in-hyaluronic-acid-soothing-cream-100ml.jpg",
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
    image: "assets/products/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50.jpg",
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
  cart: [],
  visibleCount: 48,
};

let catalogLoaded = false;
let isLoggedIn = false;

const productGrid = document.querySelector("[data-products]");
const loadMoreButton = document.querySelector("[data-load-more-products]");
const photoList = document.querySelector("[data-photo-list]");
const heroMix = document.querySelector("[data-hero-mix]");
const filterRow = document.querySelector("[data-filters]");
const searchInput = document.querySelector("[data-search]");
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
const galleryUploadInput = document.querySelector("[data-gallery-upload]");
const uploadName = document.querySelector("[data-upload-name]");
const cardForm = document.querySelector("[data-card-form]");
const paymentStatus = document.querySelector("[data-payment-status]");
const reviewForm = document.querySelector("[data-review-form]");
const reviewList = document.querySelector("[data-review-list]");
const assetDialog = document.querySelector("[data-asset-dialog]");
const assetProduct = document.querySelector("[data-asset-product]");
const assetFile = document.querySelector("[data-asset-file]");
const assetPreview = document.querySelector("[data-asset-preview]");
const assetFilename = document.querySelector("[data-asset-filename]");
const cameraDialog = document.querySelector("[data-camera-dialog]");
const cameraVideo = document.querySelector("[data-camera-video]");
const cameraCanvas = document.querySelector("[data-camera-canvas]");
const cameraStatus = document.querySelector("[data-camera-status]");
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
  const errorAction =
    mode === "card"
      ? "this.closest('.product-card')?.classList.add('image-unavailable');this.remove();"
      : "this.remove();";
  return `
    <div class="${mode === "detail" ? "dialog-photo" : "product-photo"} real-product-frame missing-image" style="--photo-color: ${product.color}">
      <img class="product-main-image" src="${product.image}" alt="${product.name}" loading="lazy" hidden onload="this.hidden=false;this.closest('.real-product-frame').classList.remove('missing-image');this.closest('.real-product-frame').classList.add('has-image');" onerror="${errorAction}" />
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
          <img src="${product.image}" alt="${product.name}" hidden onload="this.hidden=false;this.closest('.real-product-frame').classList.remove('missing-image');this.closest('.real-product-frame').classList.add('has-image');" onerror="this.remove();" />
          <span class="missing-photo"><strong>${product.brand}</strong><small>Trending beauty edit</small></span>
        </div>
      `,
    )
    .join("");
}

function filteredProducts() {
  const query = state.search.trim().toLowerCase();
  return products.filter((product) => {
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
      (state.category === "Fragrance" && /(mist|fragrance|perfume|scent|body spray)/.test(searchable));
    const matchesBrand = !activeBrand || normalizeText(product.brand).includes(activeBrand) || normalizeText(product.name).includes(activeBrand);
    const matchesSearch = !query || searchable.includes(query);
    return matchesCategory && matchesBrand && matchesSearch;
  });
}

function productRating(product) {
  const seed = product.name.length + product.brand.length + product.price;
  return {
    rating: seed % 5 === 0 ? "4.7" : seed % 3 === 0 ? "4.8" : "4.9",
    count: 18 + (seed % 84),
  };
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
          </button>
          <div class="body">
            <div class="card-meta-row">
              <span class="badge">${product.brand} / ${product.category}</span>
              <button class="wishlist-button" type="button" aria-label="Add ${product.name} to wishlist">♡</button>
            </div>
            <button class="product-title" type="button" data-view="${index}">${product.name}</button>
            <div class="rating-row"><span>★★★★★</span><small>${rating.rating} (${rating.count})</small></div>
            <p>${product.note}</p>
            <div class="best-for-labels"><span>${product.type}</span><span>${product.category}</span></div>
            <div class="price-row">
              <strong>${money(product.price)}</strong>
              <span>Available</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="button primary" type="button" data-add="${index}">Quick add</button>
          </div>
        </article>
      `;
    })
    .join("");
  const canLoadMore = items.length > state.visibleCount;
  loadMoreButton.hidden = !canLoadMore;
  loadMoreButton.disabled = !canLoadMore;
  loadMoreButton.textContent = canLoadMore ? `Show more products (${items.length - state.visibleCount} left)` : "All products shown";
}

function renderPhotoList() {
  photoList.innerHTML = products
    .slice(0, 40)
    .map(
      (product) => `
        <article class="photo-item">
          <div class="photo-thumb real-product-frame" style="--photo-color: ${product.color}">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.closest('.photo-item')?.remove();" />
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
  reviewList.innerHTML = getReviews()
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
    .join("");
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
  productPage.hidden = false;
  document.body.classList.add("product-mode");
  history.replaceState(null, "", `#product/${product.slug}`);
  productPageContent.innerHTML = `
    <div class="product-page-photo">
      ${productImageMarkup(product, "detail")}
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
        <div class="rating-row detail-rating"><span>★★★★★</span><small>${rating.rating} out of 5 • ${rating.count} reviews</small></div>
        <div class="price-row">
          <strong>${money(product.price)}</strong>
          <span>Available to order</span>
        </div>
      </div>
      <div class="detail-list">
        <article><strong>Why use it</strong><span>${product.benefits.join(", ")}.</span></article>
        <article><strong>Best for</strong><span>${product.bestFor}</span></article>
        <article><strong>Ingredient focus</strong><span>${ingredientFocus(product)}</span></article>
        <article><strong>Best to use with</strong><span>${product.useWith}</span></article>
        <article><strong>Routine pairing</strong><span>${pairingRecommendation(product)}</span></article>
        <article><strong>How to use</strong><span>${product.routine}</span></article>
        <article><strong>Delivery</strong><span>Delivery and payment options are shown clearly in your cart review before confirmation.</span></article>
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
      <a class="button secondary" href="${whatsAppUrl(`Hi Cosmetic House.lk, I want help with ${product.name}. My skin type/concern is: `)}" target="_blank" rel="noreferrer">Ask on WhatsApp</a>
      <button class="button primary" type="button" data-add="${index}">Add to cart</button>
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
  if (checkoutButton) checkoutButton.textContent = payment === "Online card payment" && paymentGateway.ready ? "Pay securely" : "Place order";
  cardForm.hidden = selectedPaymentMethod() !== "Online card payment";
  if (paymentStatus) paymentStatus.textContent = paymentGateway.message;
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
  openCart();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  renderCart();
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
  state.visibleCount = 48;
  renderFilters();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (viewButton) renderProductPage(Number(viewButton.dataset.view));
});

productPageContent.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const relatedButton = event.target.closest("[data-view-related]");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (relatedButton) renderProductPage(Number(relatedButton.dataset.viewRelated));
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
  if (!state.cart.length) {
    event.preventDefault();
    alert("Please add at least one product before placing an order.");
    return;
  }
  renderCart();
  if (selectedPaymentMethod() === "Online card payment") {
    event.preventDefault();
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Opening secure payment...";
    try {
      await startPayhereCheckout(orderForm);
    } catch (error) {
      alert(error.message);
      checkoutButton.disabled = false;
      checkoutButton.textContent = "Place order";
    }
    return;
  }
  const order = {
    id: state.currentOrderId,
    createdAt: new Date().toISOString(),
    payment: selectedPaymentMethod(),
    items: state.cart.map((product) => ({
      name: product.name,
      price: product.price,
      slug: product.slug,
    })),
    total: totalEl.textContent,
  };
  try {
    const savedOrders = JSON.parse(localStorage.getItem("cosmetic-house-orders")) || [];
    savedOrders.unshift(order);
    localStorage.setItem("cosmetic-house-orders", JSON.stringify(savedOrders.slice(0, 20)));
  } catch {
    // Email notification still submits even if local browser storage is unavailable.
  }
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  state.brand = "";
  state.visibleCount = 48;
  renderProducts();
});

document.querySelectorAll("[data-category-jump]").forEach((link) => {
  link.addEventListener("click", () => {
    state.category = link.dataset.categoryJump;
    state.brand = "";
    state.visibleCount = 48;
    renderFilters();
    renderProducts();
  });
});

document.querySelectorAll("[data-brand-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = "All";
    state.brand = button.dataset.brandJump;
    state.search = "";
    searchInput.value = "";
    state.visibleCount = 48;
    renderFilters();
    renderProducts();
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

loadMoreButton.addEventListener("click", () => {
  state.visibleCount += 48;
  renderProducts();
});

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
document.querySelector("[data-back-shop]").addEventListener("click", () => {
  productPage.hidden = true;
  document.body.classList.remove("product-mode");
  history.replaceState(null, "", "#top");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelector("[data-open-login]").addEventListener("click", () => loginDialog.showModal());
document.querySelector("[data-close-login]").addEventListener("click", () => loginDialog.close());
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
  isLoggedIn = true;
  loginDialog.close();
  aiLog.insertAdjacentHTML("beforeend", "<p>Welcome back. Your beauty profile is ready for browsing, reviews, and routine guidance.</p>");
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
}

initStorefront();
