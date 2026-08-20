import crypto from "crypto";

const rawKey = process.env.ENCRYPTION_KEY?.trim();
if (!rawKey || Buffer.byteLength(rawKey, "utf8") !== 32) {
  throw new Error(
    "ENCRYPTION_KEY environment variable must be set to an exact 32-byte string (see .env.example)."
  );
}
const ENCRYPTION_KEY = rawKey;
const IV_LENGTH = 16; // For AES, this is always 16
const PREFIX = "enc:";

export function encrypt(text: string): string {
  if (!text) return text;

  // Already encrypted by us — don't double-encrypt
  if (text.startsWith(PREFIX)) return text;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return PREFIX + iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Deterministic HMAC-SHA256 of a plaintext value, for building lookup
 * indexes on fields that are otherwise stored encrypted (with a random IV,
 * so the ciphertext itself can't be used for equality lookups).
 */
export function hashValue(text: string): string {
  return crypto.createHmac("sha256", ENCRYPTION_KEY).update(text).digest("hex");
}

export function decrypt(text: string): string {
  if (!text) return text;

  // Not encrypted by us — return as-is (plaintext / legacy value)
  if (!text.startsWith(PREFIX)) return text;

  const [ivHex, encryptedHex] = text.slice(PREFIX.length).split(":");
  if (!ivHex || !encryptedHex) return text;

  try {
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption failed:", error);
    return text;
  }
}
