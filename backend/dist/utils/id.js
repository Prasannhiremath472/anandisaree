"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = createId;
const crypto_1 = __importDefault(require("crypto"));
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
/** Generates a URL-safe unique id in the same shape as Prisma's cuid() (lowercase alphanumeric, ~25 chars). */
function createId() {
    const bytes = crypto_1.default.randomBytes(20);
    let out = "c";
    for (const byte of bytes) {
        out += ALPHABET[byte % ALPHABET.length];
    }
    return out;
}
//# sourceMappingURL=id.js.map