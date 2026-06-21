import { ConnectionOptions } from "bullmq";

export function getRedisConnection(): ConnectionOptions {
  const url = process.env.REDIS_URL || "redis://localhost:6379";

  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 6379),
      password: parsed.password || undefined,
      tls: parsed.protocol === "rediss:" ? {} : undefined
    };
  } catch {
    return { host: "localhost", port: 6379 };
  }
}
