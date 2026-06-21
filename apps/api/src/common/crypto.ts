import crypto from "crypto";

const KEY = process.env.ENCRYPTION_KEY || "";

function getKey() {
  if (!KEY) throw new Error("ENCRYPTION_KEY not configured");
  if (KEY.length === 64 && /^[0-9a-fA-F]+$/.test(KEY)) {
    return Buffer.from(KEY, "hex");
  }
  return Buffer.from(KEY, "base64");
}

export function encryptJson(value: object) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(value));
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: ciphertext.toString("base64")
  };
}

export function decryptJson<T>(payload: { iv: string; tag: string; data: string }): T {
  const key = getKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const data = Buffer.from(payload.data, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8"));
}

export function hashApiKey(key: string) {
  const pepper = process.env.INTEGRATION_HASH_PEPPER || "";
  return crypto.createHash("sha256").update(key + pepper).digest("hex");
}

export function generateSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function signWebhook(body: string, timestamp: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}
