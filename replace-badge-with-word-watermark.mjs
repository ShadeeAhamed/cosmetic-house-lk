import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = process.cwd();
const sourceDir = path.join(root, "assets", "products-watermarked");
const outputDir = path.join(root, "assets", "products");
const text = "cosmetic_house.lk";

function escapeSvg(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function processImage(file) {
  const inputPath = path.join(sourceDir, file);
  const outputPath = path.join(outputDir, file);
  const image = sharp(inputPath, { failOn: "none" });
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height) return false;

  const badgeHeight = Math.min(58, Math.max(34, Math.round(height * 0.055)));
  const estimatedBadgeWidth = Math.min(
    Math.round(width * 0.34),
    Math.max(155, Math.round(badgeHeight * 4.2))
  );
  const margin = Math.max(10, Math.round(Math.min(width, height) * 0.025));
  const coverPad = Math.max(8, Math.round(badgeHeight * 0.2));
  const coverX = Math.max(0, width - estimatedBadgeWidth - margin - coverPad);
  const coverY = Math.max(0, height - badgeHeight - margin - coverPad);
  const coverW = Math.min(width - coverX, estimatedBadgeWidth + coverPad * 2);
  const coverH = Math.min(height - coverY, badgeHeight + coverPad * 2);

  const patchSourceHeight = Math.min(Math.max(coverH, badgeHeight * 2), Math.max(1, coverY));
  const patchY = Math.max(0, coverY - patchSourceHeight);
  const patch = await sharp(inputPath, { failOn: "none" })
    .extract({ left: coverX, top: patchY, width: coverW, height: patchSourceHeight })
    .resize(coverW, coverH, { fit: "fill" })
    .blur(Math.max(18, Math.round(badgeHeight * 0.5)))
    .png()
    .toBuffer();

  const feather = Math.max(8, Math.round(badgeHeight * 0.18));
  const maskSvg = Buffer.from(`
    <svg width="${coverW}" height="${coverH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="soft">
          <feGaussianBlur stdDeviation="${feather}" />
        </filter>
      </defs>
      <rect x="${feather}" y="${feather}" width="${Math.max(1, coverW - feather * 2)}" height="${Math.max(1, coverH - feather * 2)}" fill="white" filter="url(#soft)" />
      <rect x="${feather * 1.3}" y="${feather * 1.3}" width="${Math.max(1, coverW - feather * 2.6)}" height="${Math.max(1, coverH - feather * 2.6)}" fill="white" />
    </svg>
  `);
  const softPatch = await sharp(patch)
    .ensureAlpha()
    .composite([{ input: maskSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  const fontSize = Math.min(18, Math.max(10, Math.round(Math.min(width, height) * 0.024)));
  const wordX = Math.max(12, Math.round(Math.min(width, height) * 0.035));
  const wordY = Math.max(18, Math.round(Math.min(width, height) * 0.048));
  const svg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${wordX}" y="${wordY}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="400"
        fill="rgba(24,24,24,0.24)">${escapeSvg(text)}</text>
    </svg>
  `);

  await sharp(inputPath, { failOn: "none" })
    .composite([
      { input: softPatch, left: coverX, top: coverY },
      { input: svg, left: 0, top: 0 },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outputPath);

  return true;
}

await fs.mkdir(outputDir, { recursive: true });
const files = (await fs.readdir(sourceDir)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file));
let processed = 0;

for (const file of files) {
  try {
    if (await processImage(file)) processed += 1;
  } catch (error) {
    console.warn(`Skipped ${file}: ${error.message}`);
  }
}

console.log(`Created word-only watermarks on ${processed} images`);
