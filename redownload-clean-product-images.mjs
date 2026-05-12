import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = process.cwd();
const catalogPath = path.join(root, "catalog-data.json");
const productsDir = path.join(root, "assets", "products");
const backupDir = path.join(root, "assets", `products-watermark-backup-${new Date().toISOString().replace(/[:.]/g, "-")}`);
const failedPath = path.join(root, "assets", "clean-image-download-failures.json");

function absolutizeUrl(url, baseUrl) {
  if (!url) return null;
  const cleaned = url.replaceAll("&amp;", "&").trim();
  if (cleaned.startsWith("//")) return `https:${cleaned}`;
  return new URL(cleaned, baseUrl).toString();
}

function pickImageUrl(html, pageUrl) {
  const patterns = [
    /<meta\s+property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image:secure_url["']/i,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /data-featured-media-url=["']([^"']+)["']/i,
    /<img[^>]+class=["'][^"']*product[^"']*["'][^>]+src=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return absolutizeUrl(match[1], pageUrl);
  }

  return null;
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "user-agent": "Mozilla/5.0 CosmeticHouseImageRefresh/1.0",
          accept: options.accept || "*/*",
          ...(options.headers || {}),
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 800 + i * 900));
    }
  }
  throw lastError;
}

async function copyCurrentProductsToBackup() {
  await fs.mkdir(backupDir, { recursive: true });
  const files = await fs.readdir(productsDir);
  await Promise.all(
    files
      .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
      .map((file) => fs.copyFile(path.join(productsDir, file), path.join(backupDir, file)))
  );
}

async function downloadProduct(product) {
  const page = await fetchWithRetry(product.sourceUrl, { headers: { accept: "text/html" } });
  const html = await page.text();
  const imageUrl = pickImageUrl(html, product.sourceUrl);
  if (!imageUrl) throw new Error("No product image found on page");

  const imageResponse = await fetchWithRetry(imageUrl, {
    headers: { accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" },
  });
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const outputPath = path.join(root, product.image);
  const tempPath = `${outputPath}.clean-download-tmp`;

  await sharp(imageBuffer, { failOn: "none" })
    .resize({
      width: 900,
      height: 900,
      fit: "inside",
      withoutEnlargement: true,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(tempPath);

  await fs.rename(tempPath, outputPath);
  return imageUrl;
}

async function runQueue(items, limit, worker) {
  const failures = [];
  let index = 0;
  let completed = 0;

  async function next() {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];
      try {
        const imageUrl = await worker(item);
        completed += 1;
        if (completed % 25 === 0 || completed === items.length) {
          console.log(`Downloaded ${completed}/${items.length}`);
        }
        item.downloadedImageUrl = imageUrl;
      } catch (error) {
        failures.push({
          name: item.name,
          slug: item.slug,
          sourceUrl: item.sourceUrl,
          image: item.image,
          error: error.message,
        });
        console.warn(`Failed: ${item.name} - ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, next));
  return failures;
}

const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
const products = catalog.filter((product) => product.sourceUrl && product.image?.startsWith("assets/products/"));

await fs.mkdir(productsDir, { recursive: true });
await copyCurrentProductsToBackup();

const failures = await runQueue(products, 6, downloadProduct);
await fs.writeFile(failedPath, JSON.stringify(failures, null, 2));

console.log(`Clean downloads complete. Success: ${products.length - failures.length}, Failed: ${failures.length}`);
console.log(`Backup saved to ${backupDir}`);
