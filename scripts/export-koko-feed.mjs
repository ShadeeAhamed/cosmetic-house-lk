import { readFile, writeFile } from "node:fs/promises";
import { buildMerchantFeed } from "../services/kokoService.js";

const catalogSource = await readFile(new URL("../catalog-data.js", import.meta.url), "utf8");
const jsonMatch = catalogSource.match(/window\.COSMETIC_HOUSE_CATALOG\s*=\s*(\[[\s\S]*?\]);/);

if (!jsonMatch) {
  throw new Error("Could not locate products array in catalog-data.js");
}

const products = Function(`"use strict"; return (${jsonMatch[1]});`)();
const feed = buildMerchantFeed(
  products.map((product) => ({
    sku: product.slug,
    title: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    image: `https://cosmetichouse.com.lk/${product.image}`,
    url: `https://cosmetichouse.com.lk/products/${product.slug}.html`,
    availability: "available_to_order",
  })),
);

await writeFile(new URL("../koko-product-feed.json", import.meta.url), `${JSON.stringify(feed, null, 2)}\n`);
