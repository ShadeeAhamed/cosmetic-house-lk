import { readFile } from "node:fs/promises";
import path from "node:path";

const defaultImageBaseUrl = "https://raw.githubusercontent.com/ShadeeAhamed/cosmetic-house-lk/main";

function encodePathForUrl(filePath) {
  return String(filePath || "")
    .replaceAll("\\", "/")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function publicImageUrl(imagePath) {
  const baseUrl = (process.env.SOCIAL_IMAGE_BASE_URL || defaultImageBaseUrl).replace(/\/+$/, "");
  return `${baseUrl}/${encodePathForUrl(imagePath)}`;
}

export function readImageInfo(buffer) {
  if (!buffer?.length) return null;

  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer.toString("ascii", 1, 4) === "PNG"
  ) {
    return {
      type: "png",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
      bytes: buffer.length,
    };
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
        return {
          type: "jpg",
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
          bytes: buffer.length,
        };
      }
      offset += 2 + length;
    }
  }

  return null;
}

export async function assertSocialImageQuality(imagePath) {
  const file = await readFile(imagePath);
  const info = readImageInfo(file);
  if (!info) throw new Error(`Could not read image size for ${imagePath}`);

  const shortSide = Math.min(info.width, info.height);
  const longSide = Math.max(info.width, info.height);
  const hasGoodSize = shortSide >= 600 && longSide >= 600;
  const hasGoodWeight = info.bytes >= 50000;

  if (!hasGoodSize || !hasGoodWeight) {
    throw new Error(
      `Image quality check failed for ${path.basename(imagePath)} (${info.width}x${info.height}, ${Math.round(
        info.bytes / 1024,
      )}KB). Replace it with a clearer product photo before publishing.`,
    );
  }

  return info;
}

function cleanProductName(line) {
  return String(line || "")
    .replace(/\s*\|\s*/g, " | ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function cleanPublicCaption(caption) {
  const lines = String(caption || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/sophia|supplier|availability|internal|owner review/i.test(line));

  const textLines = lines.filter((line) => !line.startsWith("#")).map(cleanProductName);
  const existingTags = lines
    .filter((line) => line.startsWith("#"))
    .flatMap((line) => line.split(/\s+/))
    .filter((tag) => /^#[A-Za-z0-9_]+$/.test(tag));

  const hashtagBlock = unique([
    "#cosmetic_house_lk",
    "#CosmeticHouseLK",
    "#SkincareSriLanka",
    "#SriLankaBeauty",
    "#BeautySriLanka",
    "#SkincareRoutine",
    "#GlowRoutine",
    "#OnlineShoppingSriLanka",
    "#ColomboBeauty",
    "#SriLankaOnlineShopping",
    "#BeautyProductsSriLanka",
    "#KoreanSkincareSriLanka",
    ...existingTags,
  ]);

  const groups = [
    textLines[0],
    textLines[1],
    textLines.slice(2, -1).join(" "),
    textLines.at(-1),
    hashtagBlock.slice(0, 4).join(" "),
    hashtagBlock.slice(4, 8).join(" "),
    hashtagBlock.slice(8, 12).join(" "),
    hashtagBlock.slice(12).join(" "),
  ].filter(Boolean);

  return groups.join("\n\n").trim();
}
