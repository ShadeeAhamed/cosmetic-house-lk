import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outDir = "business-suite-calendar";
const days = Number(process.argv[2] || 30);
const startDate = new Date();
const scheduleTimes = ["20:30", "12:30", "21:15", "19:45", "13:15", "20:00", "18:45"];

function normalize(value) {
  return String(value || "").toLowerCase();
}

function cleanBrand(product) {
  const text = normalize(`${product.name} ${product.brand}`).replace(/[.\-]/g, " ");
  const brands = [
    "The Ordinary",
    "Beauty of Joseon",
    "CeraVe",
    "Anua",
    "Medicube",
    "Laneige",
    "COSRX",
    "Cetaphil",
    "Neutrogena",
    "Dove",
    "Innisfree",
    "Torriden",
    "Rhode",
    "SKIN1004",
    "The Body Shop",
    "OGX",
    "Some By Mi",
    "Sol de Janeiro",
    "La Roche-Posay",
    "Nivea",
    "Vaseline",
    "St. Ives",
    "Balance Active",
    "Pixi",
    "Mielle",
    "Supergoop",
    "PanOxyl",
    "AXIS-Y",
    "Simple",
    "Fino",
    "TRESemme",
    "Round Lab",
    "Nature Republic",
    "Numbuzin",
  ];
  return brands.find((brand) => text.includes(normalize(brand).replace(/[.\-]/g, " "))) || product.brand?.replace(/Cosmo.*/i, "Beauty Edit") || "Beauty Edit";
}

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, count) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function byCategory(products, category) {
  return products.filter((product) => product.category === category || product.type === category);
}

function chooseProduct(products, day) {
  const cycle = [
    "Best Moving",
    "Sunscreen",
    "Face Wash",
    "Moisturizers",
    "Makeup",
    "Shampoos & Hair",
    "Body Wash",
  ];
  const category = cycle[day % cycle.length];
  const pool = byCategory(products, category);
  return (pool.length ? pool : products)[day % (pool.length || products.length)];
}

function contentTheme(product, day) {
  const lower = normalize(`${product.name} ${product.category}`);
  if (/sunscreen|spf|sun/.test(lower)) return "SPF reminder";
  if (/cleanser|face wash|cleansing/.test(lower)) return "Clean routine starter";
  if (/cream|moistur|lotion|barrier/.test(lower)) return "Barrier support";
  if (/serum|niacinamide|hyaluronic|retinol|vitamin/.test(lower)) return "Treatment focus";
  if (/shampoo|hair|conditioner/.test(lower)) return "Hair care reset";
  if (/mask|toner|ampoule|essence/.test(lower)) return "Routine booster";
  if (/body|wash|scrub|lotion/.test(lower)) return "Body care glow";
  if (/lip|foundation|makeup|mascara/.test(lower)) return "Makeup pick";
  return ["Routine pick", "Best mover", "Beauty shelf feature"][day % 3];
}

function categoryLabel(category) {
  const labels = {
    "Best Moving": "trending beauty",
    "Face Wash": "cleanser",
    "Shampoos & Hair": "hair care",
    Moisturizers: "moisturizer",
    Sunscreen: "SPF",
    Makeup: "makeup",
    "Body Wash": "body care",
  };
  return labels[category] || normalize(category || "beauty");
}

function caption(product, brand, theme) {
  return [
    `${theme}: ${product.name}`,
    "",
    `A thoughtful ${categoryLabel(product.category)} pick for customers building a simple beauty routine in Sri Lanka.`,
    "",
    "Message Sophia with your skin type, main concern, current products, and budget. We will help you choose without overloading your routine.",
    "",
    "Supplier price and availability will be confirmed before payment.",
    "",
    "#CosmeticHouse #CosmeticHouseLK #SkincareSriLanka #SriLankaBeauty #BeautyRoutine",
    brand !== "Beauty Edit" ? `#${brand.replace(/[^A-Za-z0-9]/g, "")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function storyFrames(product, theme) {
  return [
    `${theme}: ${product.name}`,
    `Best for: ${product.bestFor || "customers looking for a simple routine match"}`,
    "Reply with your skin type + budget. Sophia will suggest a simple routine after price and availability are confirmed.",
  ];
}

function reelIdea(product) {
  return {
    idea: `12-second product routine reel for ${product.name}`,
    shotList: [
      "0-2s: Product close-up on Cosmetic House theme background",
      "2-5s: Texture / packaging detail",
      "5-8s: Routine placement text overlay",
      "8-12s: CTA: DM Sophia your skin concern + budget",
    ],
  };
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

const catalog = JSON.parse(await readFile("catalog-data.json", "utf8")).filter((product) => product.name && product.image);
const calendar = [];

for (let index = 0; index < days; index += 1) {
  const product = chooseProduct(catalog, index);
  const brand = cleanBrand(product);
  const date = addDays(startDate, index);
  const theme = contentTheme(product, index);
  calendar.push({
    date: dateString(date),
    time: scheduleTimes[index % scheduleTimes.length],
    channels: "Facebook Page + Instagram",
    productName: product.name,
    brand,
    category: product.category,
    imagePath: product.image,
    imageFullPath: resolve(product.image),
    theme,
    feedCaption: caption(product, brand, theme),
    storyFrames: storyFrames(product, theme),
    reel: reelIdea(product),
    ownerCheck: "Confirm supplier price, availability, and approved image before scheduling.",
  });
}

await mkdir(outDir, { recursive: true });
await writeFile(`${outDir}/meta-business-suite-30-day-calendar.json`, `${JSON.stringify(calendar, null, 2)}\n`, "utf8");

const csvHeader = [
  "date",
  "time",
  "channels",
  "productName",
  "brand",
  "category",
  "imagePath",
  "imageFullPath",
  "theme",
  "feedCaption",
  "storyFrame1",
  "storyFrame2",
  "storyFrame3",
  "reelIdea",
  "reelShotList",
  "ownerCheck",
];
const csvRows = calendar.map((item) =>
  [
    item.date,
    item.time,
    item.channels,
    item.productName,
    item.brand,
    item.category,
    item.imagePath,
    item.imageFullPath,
    item.theme,
    item.feedCaption,
    item.storyFrames[0],
    item.storyFrames[1],
    item.storyFrames[2],
    item.reel.idea,
    item.reel.shotList.join(" | "),
    item.ownerCheck,
  ]
    .map(csvEscape)
    .join(","),
);
await writeFile(`${outDir}/meta-business-suite-30-day-calendar.csv`, `${csvHeader.join(",")}\n${csvRows.join("\n")}\n`, "utf8");

const markdown = [
  "# Cosmetic House Meta Business Suite 30-Day Calendar",
  "",
  "Use this to schedule posts in Meta Business Suite for Facebook and Instagram together.",
  "",
  ...calendar.flatMap((item) => [
    `## ${item.date} ${item.time} - ${item.theme}`,
    "",
    `Product: ${item.productName}`,
    `Brand: ${item.brand}`,
    `Category: ${item.category}`,
    `Image: ${item.imagePath}`,
    `Image full path: ${item.imageFullPath}`,
    "",
    "Caption:",
    "",
    item.feedCaption,
    "",
    "Story frames:",
    ...item.storyFrames.map((frame, frameIndex) => `${frameIndex + 1}. ${frame}`),
    "",
    `Reel: ${item.reel.idea}`,
    ...item.reel.shotList.map((shot) => `- ${shot}`),
    "",
    `Owner check: ${item.ownerCheck}`,
    "",
  ]),
];
await writeFile(`${outDir}/meta-business-suite-30-day-calendar.md`, `${markdown.join("\n")}\n`, "utf8");

console.log(`Generated ${calendar.length} Business Suite schedule items in ${outDir}`);
