// Reads pixel width/height directly from image bytes (JPEG/PNG/WebP header
// parsing) without a new dependency -- the upload payload is already a
// base64 data URI by the time it reaches us, so we decode and read the
// dimensions straight out of the file header.

function readPng(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isPng) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readJpeg(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0, SOF1, SOF2, SOF3 (baseline/progressive) carry the dimensions.
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

function readWebp(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 30) return null;
  const isRiff = buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP";
  if (!isRiff) return null;
  const format = buf.toString("ascii", 12, 16);
  if (format === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (format === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (format === "VP8X") {
    return {
      width: (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1,
      height: (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1,
    };
  }
  return null;
}

/** Returns pixel dimensions for a `data:image/...;base64,...` URI, or null if the format isn't recognized. */
export function getDataUriDimensions(dataUri: string): { width: number; height: number } | null {
  const match = /^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/.exec(dataUri);
  if (!match) return null;
  const buf = Buffer.from(match[1], "base64");
  return readPng(buf) ?? readJpeg(buf) ?? readWebp(buf);
}
