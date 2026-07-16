import crypto from "crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

/** Generates a URL-safe unique id in the same shape as Prisma's cuid() (lowercase alphanumeric, ~25 chars). */
export function createId(): string {
  const bytes = crypto.randomBytes(20);
  let out = "c";
  for (const byte of bytes) {
    out += ALPHABET[byte % ALPHABET.length];
  }
  return out;
}
