"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptJson = encryptJson;
exports.decryptJson = decryptJson;
exports.hashApiKey = hashApiKey;
exports.generateSecret = generateSecret;
exports.signWebhook = signWebhook;
const crypto_1 = __importDefault(require("crypto"));
const KEY = process.env.ENCRYPTION_KEY || "";
function getKey() {
    if (!KEY)
        throw new Error("ENCRYPTION_KEY not configured");
    if (KEY.length === 64 && /^[0-9a-fA-F]+$/.test(KEY)) {
        return Buffer.from(KEY, "hex");
    }
    return Buffer.from(KEY, "base64");
}
function encryptJson(value) {
    const key = getKey();
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", key, iv);
    const plaintext = Buffer.from(JSON.stringify(value));
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        iv: iv.toString("base64"),
        tag: tag.toString("base64"),
        data: ciphertext.toString("base64")
    };
}
function decryptJson(payload) {
    const key = getKey();
    const iv = Buffer.from(payload.iv, "base64");
    const tag = Buffer.from(payload.tag, "base64");
    const data = Buffer.from(payload.data, "base64");
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(plaintext.toString("utf8"));
}
function hashApiKey(key) {
    const pepper = process.env.INTEGRATION_HASH_PEPPER || "";
    return crypto_1.default.createHash("sha256").update(key + pepper).digest("hex");
}
function generateSecret(bytes = 32) {
    return crypto_1.default.randomBytes(bytes).toString("hex");
}
function signWebhook(body, timestamp, secret) {
    return crypto_1.default
        .createHmac("sha256", secret)
        .update(`${timestamp}.${body}`)
        .digest("hex");
}
//# sourceMappingURL=crypto.js.map