import { mkdir, stat, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

const feedBaseUrl = "https://cosmocosmetic.lk/products.json?limit=250";
const outputDir = "assets/products";
const catalogPath = "catalog-data.json";

function moneyNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function categoryFor(product) {
  const text = `${product.title} ${product.product_type || ""}`.toLowerCase();
  if (/lip|foundation|mascara|makeup/.test(text)) return "Makeup";
  if (/shampoo|hair|scalp/.test(text)) return "Shampoos & Hair";
  if (/body|lotion|wash/.test(text)) return "Body Wash";
  if (/cleanser|face wash|foam/.test(text)) return "Face Wash";
  if (/sun|spf|uv/.test(text)) return "Sunscreen";
  if (/cream|moistur/.test(text)) return "Moisturizers";
  return "Best Moving";
}

function imageUrlFor(product) {
  const image = product.images?.[0];
  if (!image?.src) return "";
  return image.src.startsWith("//") ? `https:${image.src}` : image.src;
}

async function download(url, filePath) {
  try {
    const existing = await stat(filePath);
    if (existing.size > 0) return "exists";
  } catch {
    // File is not there yet.
  }
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Download failed ${response.status}: ${url}`);
  }
  await mkdir(dirname(filePath), { recursive: true });
  await pipeline(response.body, createWriteStream(filePath));
  return "downloaded";
}

async function fetchAllProducts() {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const feedUrl = `${feedBaseUrl}&page=${page}`;
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`Feed failed ${response.status}: ${feedUrl}`);
    const feed = await response.json();
    const pageProducts = feed.products || [];
    if (!pageProducts.length) break;
    all.push(...pageProducts);
  }
  return all;
}

const feedProducts = await fetchAllProducts();
const catalog = [];
let downloaded = 0;
let existing = 0;
let skipped = 0;

await mkdir(outputDir, { recursive: true });

for (const product of feedProducts) {
  const variant = product.variants?.[0] || {};
  const supplierPrice = moneyNumber(variant.price);
  const price = supplierPrice >= 5000 ? supplierPrice - 100 : Math.max(0, supplierPrice - 50);
  const type = product.product_type || product.tags?.[0] || "Beauty";
  const image = `${outputDir}/${product.handle}.jpg`;
  const remoteImage = imageUrlFor(product);

  catalog.push({
    name: product.title,
    slug: product.handle,
    category: categoryFor(product),
    type,
    brand: product.vendor || "Beauty Edit",
    image,
    sourceUrl: `https://cosmocosmetic.lk/products/${product.handle}`,
    price: Math.round(price),
    color: "#160811",
    note: `${type} selected for Cosmetic House LK customers.`,
    description: `${product.title} is listed as a ${type} item. Confirm availability, final supplier price, and suitability before accepting payment.`,
    benefits: [
      "Adds more choice to the Cosmetic House catalog",
      "Can be paired into a guided routine",
      "Includes a supplier-approved product image slot",
    ],
    bestFor: "Customers looking for this product type. Ask skin type, routine, and concern before recommending.",
    useWith: "Pair with a simple routine and avoid adding too many active product steps at once.",
    routine: "Use according to product label directions. Patch test when trying a new cosmetic product.",
  });

  if (!remoteImage) {
    skipped += 1;
    continue;
  }

  try {
    const result = await download(remoteImage, join(process.cwd(), image));
    if (result === "exists") existing += 1;
    if (result === "downloaded") downloaded += 1;
  } catch (error) {
    skipped += 1;
    console.warn(error.message);
  }
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

const report = {
  feed: feedBaseUrl,
  products: catalog.length,
  downloaded,
  existing,
  skipped,
  outputDir,
  catalogPath,
};

await writeFile("image-download-report.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
