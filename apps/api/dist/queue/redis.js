"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConnection = getRedisConnection;
function getRedisConnection() {
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    try {
        const parsed = new URL(url);
        return {
            host: parsed.hostname,
            port: Number(parsed.port || 6379),
            password: parsed.password || undefined,
            tls: parsed.protocol === "rediss:" ? {} : undefined
        };
    }
    catch {
        return { host: "localhost", port: 6379 };
    }
}
//# sourceMappingURL=redis.js.map