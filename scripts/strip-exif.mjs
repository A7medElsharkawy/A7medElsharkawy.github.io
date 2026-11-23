// Removes hidden EXIF metadata (GPS location, phone model, date…) from JPEG photos.
// Phone photos often contain your exact GPS coordinates. Run this before publishing:
//
//   npm run clean-photos -- site/assets/news/my-photo.jpg [more.jpg ...]
//
// It rewrites each file in place, keeping the image itself unchanged.
import { readFileSync, writeFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: npm run clean-photos -- <photo.jpg> [more.jpg ...]");
  process.exit(1);
}

for (const file of files) {
  const buf = readFileSync(file);
  if (buf[0] !== 0xff || buf[1] !== 0xd8) {
    console.error(`✗ ${file} is not a JPEG, skipped`);
    continue;
  }
  const kept = [buf.subarray(0, 2)]; // SOI marker
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error(`${file}: unexpected byte at ${i}`);
    const marker = buf[i + 1];
    if (marker === 0xda) {
      kept.push(buf.subarray(i)); // start of image data: keep everything after
      break;
    }
    const len = buf.readUInt16BE(i + 2);
    if (marker !== 0xe1) kept.push(buf.subarray(i, i + 2 + len)); // drop APP1 = EXIF/XMP
    i += 2 + len;
  }
  writeFileSync(file, Buffer.concat(kept));
  console.log(`✓ cleaned ${file}`);
}
