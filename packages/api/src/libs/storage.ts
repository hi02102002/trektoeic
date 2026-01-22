import { env } from "@trektoeic/env";
import { createLogger } from "@trektoeic/logger";
import { createStorage, type Driver, type StorageValue } from "unstorage";
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http";
import lruCacheDriver from "unstorage/drivers/lru-cache";
import upstashDriver from "unstorage/drivers/upstash";

const logger = createLogger({ meta: { service: "storage" } });

const memoryStorage = createStorage({
	driver: lruCacheDriver({
		max: 1000,
		maxSize: 100 * 1024 * 1024,
		sizeCalculation: (value) => {
			return JSON.stringify(value).length;
		},
		ttl: 1000 * 60 * 60,
	}),
});

const upstashStorage = createStorage({
	driver: upstashDriver({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN,
		base: "cache:",
	}),
});

const cloudflareStorage = createStorage({
	driver: cloudflareKVHTTPDriver({
		accountId: env.CLOUDFLARE_ACCOUNT_ID,
		namespaceId: env.CLOUDFLARE_KV_NAMESPACE_ID,
		apiToken: env.CLOUDFLARE_API_TOKEN_KV,
	}),
});

const COUNTERS_KEY = "__storage_counters__";

let counters = {
	upstashReads: 0,
	upstashWrites: 0,
	cloudflareReads: 0,
	cloudflareWrites: 0,
	lastReset: Date.now(),
};

let countersLoaded = false;
let countersSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const DAILY_LIMITS = {
	upstashRequests: 9000,
	cloudflareReads: 90000,
	cloudflareWrites: 900,
};

async function loadCounters(): Promise<void> {
	if (countersLoaded) return;

	try {
		const stored = await cloudflareStorage.getItem(COUNTERS_KEY);
		if (stored && typeof stored === "object") {
			counters = { ...counters, ...(stored as typeof counters) };
			logger.info({ counters }, "Loaded storage counters from KV");
		} else {
			logger.info("No existing counters found, using defaults");
		}
		countersLoaded = true;
	} catch (error) {
		logger.warn({ error }, "Failed to load counters from KV");
		countersLoaded = true;
	}
}

function saveCounters(): void {
	if (countersSaveTimeout) {
		clearTimeout(countersSaveTimeout);
	}

	countersSaveTimeout = setTimeout(async () => {
		try {
			await cloudflareStorage.setItem(COUNTERS_KEY, counters as StorageValue);
			logger.debug({ counters }, "Saved storage counters to KV");
		} catch (error) {
			logger.warn({ error }, "Failed to save counters to KV");
		}
	}, 30000);
}

// Save counters immediately (for graceful shutdown)
async function saveCountersNow(): Promise<void> {
	if (countersSaveTimeout) {
		clearTimeout(countersSaveTimeout);
		countersSaveTimeout = null;
	}
	try {
		await cloudflareStorage.setItem(COUNTERS_KEY, counters as StorageValue);
		logger.info({ counters }, "Flushed storage counters to KV");
	} catch (error) {
		logger.error({ error }, "Failed to flush counters to KV");
	}
}

async function resetCountersIfNeeded(): Promise<void> {
	await loadCounters();

	const now = Date.now();
	const oneDayMs = 24 * 60 * 60 * 1000;
	if (now - counters.lastReset > oneDayMs) {
		const oldCounters = { ...counters };
		counters.upstashReads = 0;
		counters.upstashWrites = 0;
		counters.cloudflareReads = 0;
		counters.cloudflareWrites = 0;
		counters.lastReset = now;
		logger.info({ oldCounters }, "Daily counter reset - previous usage stats");
		saveCounters();
	}
}

async function canUseUpstash(_isWrite = false): Promise<boolean> {
	await resetCountersIfNeeded();
	const totalRequests = counters.upstashReads + counters.upstashWrites;
	const canUse = totalRequests < DAILY_LIMITS.upstashRequests;

	if (
		totalRequests >= DAILY_LIMITS.upstashRequests * 0.8 &&
		totalRequests < DAILY_LIMITS.upstashRequests
	) {
		logger.warn(
			{ used: totalRequests, limit: DAILY_LIMITS.upstashRequests },
			"Upstash quota reaching limit (80%+)",
		);
	}

	if (!canUse) {
		logger.warn(
			{ used: totalRequests, limit: DAILY_LIMITS.upstashRequests },
			"Upstash daily quota exhausted",
		);
	}

	return canUse;
}

async function canUseCloudflare(isWrite = false): Promise<boolean> {
	await resetCountersIfNeeded();

	if (isWrite) {
		const canUse = counters.cloudflareWrites < DAILY_LIMITS.cloudflareWrites;

		if (
			counters.cloudflareWrites >= DAILY_LIMITS.cloudflareWrites * 0.8 &&
			canUse
		) {
			logger.warn(
				{
					used: counters.cloudflareWrites,
					limit: DAILY_LIMITS.cloudflareWrites,
				},
				"Cloudflare KV write quota reaching limit (80%+)",
			);
		}

		if (!canUse) {
			logger.warn(
				{
					used: counters.cloudflareWrites,
					limit: DAILY_LIMITS.cloudflareWrites,
				},
				"Cloudflare KV write quota exhausted",
			);
		}

		return canUse;
	}

	const canUse = counters.cloudflareReads < DAILY_LIMITS.cloudflareReads;

	if (
		counters.cloudflareReads >= DAILY_LIMITS.cloudflareReads * 0.8 &&
		canUse
	) {
		logger.warn(
			{ used: counters.cloudflareReads, limit: DAILY_LIMITS.cloudflareReads },
			"Cloudflare KV read quota reaching limit (80%+)",
		);
	}

	if (!canUse) {
		logger.warn(
			{ used: counters.cloudflareReads, limit: DAILY_LIMITS.cloudflareReads },
			"Cloudflare KV read quota exhausted",
		);
	}

	return canUse;
}

function getCallerInfo(): string {
	const stack = new Error().stack;
	if (!stack) return "unknown";

	const lines = stack.split("\n");
	// Skip: Error, getCallerInfo, current method, storage.getItem/setItem wrapper
	for (let i = 4; i < lines.length; i++) {
		const line = lines[i];
		if (
			line &&
			!line.includes("storage.ts") &&
			!line.includes("node_modules")
		) {
			const match = line.match(/at\s+(?:async\s+)?(.+?)\s+\((.+?):(\d+):\d+\)/);
			if (match?.[2]) {
				const fileName = match[2].split("/").pop() ?? "unknown";
				return `${match[1]} (${fileName}:${match[3]})`;
			}
			const simpleMatch = line.match(/at\s+(.+?):(\d+):\d+/);
			if (simpleMatch?.[1]) {
				const fileName = simpleMatch[1].split("/").pop() ?? "unknown";
				return `${fileName}:${simpleMatch[2]}`;
			}
		}
	}
	return "unknown";
}

class MultiLayerDriver implements Driver {
	name = "multi-layer";

	async getItem(key: string): Promise<unknown> {
		const caller = getCallerInfo();
		logger.debug({ key, caller, operation: "get" }, "Storage get");

		try {
			const memoryValue = await memoryStorage.getItem(key);
			if (memoryValue !== null) {
				logger.debug({ key, caller, layer: "memory" }, "Cache hit");
				return memoryValue;
			}
		} catch {}

		if (await canUseUpstash()) {
			try {
				const redisValue = await upstashStorage.getItem(key);
				counters.upstashReads++;
				saveCounters();
				if (redisValue !== null) {
					logger.debug({ key, caller, layer: "upstash" }, "Cache hit");
					await memoryStorage.setItem(key, redisValue as StorageValue);
					return redisValue;
				}
			} catch {}
		}

		if (await canUseCloudflare()) {
			try {
				const kvValue = await cloudflareStorage.getItem(key);
				counters.cloudflareReads++;
				saveCounters();
				if (kvValue !== null) {
					logger.debug({ key, caller, layer: "cloudflare" }, "Cache hit");
					await memoryStorage.setItem(key, kvValue as StorageValue);
					if (await canUseUpstash(true)) {
						await upstashStorage
							.setItem(key, kvValue as StorageValue)
							.catch(() => {});
						counters.upstashWrites++;
						saveCounters();
					}
					return kvValue;
				}
			} catch {}
		}

		logger.debug({ key, caller }, "Cache miss");
		return null;
	}

	async setItem(
		key: string,
		value: unknown,
		opts?: { ttl?: number },
	): Promise<void> {
		const caller = getCallerInfo();
		const ttlSeconds = opts?.ttl;
		const storageValue = value as StorageValue;

		logger.debug(
			{ key, caller, operation: "set", ttl: ttlSeconds },
			"Storage set",
		);

		await memoryStorage.setItem(key, storageValue);

		if (await canUseUpstash(true)) {
			try {
				await upstashStorage.setItem(
					key,
					storageValue,
					ttlSeconds ? { ttl: ttlSeconds } : undefined,
				);
				counters.upstashWrites++;
				saveCounters();
				return;
			} catch {}
		}

		if (await canUseCloudflare(true)) {
			try {
				await cloudflareStorage.setItem(
					key,
					storageValue,
					ttlSeconds ? { ttl: ttlSeconds } : undefined,
				);
				counters.cloudflareWrites++;
				saveCounters();
				return;
			} catch {}
		}
	}

	async hasItem(key: string): Promise<boolean> {
		const caller = getCallerInfo();
		logger.debug({ key, caller, operation: "has" }, "Storage has");

		if (await memoryStorage.hasItem(key)) {
			return true;
		}

		if (await canUseUpstash()) {
			try {
				const has = await upstashStorage.hasItem(key);
				counters.upstashReads++;
				saveCounters();
				return has;
			} catch {}
		}

		if (await canUseCloudflare()) {
			try {
				const has = await cloudflareStorage.hasItem(key);
				counters.cloudflareReads++;
				saveCounters();
				return has;
			} catch {}
		}

		return false;
	}

	async removeItem(key: string): Promise<void> {
		const caller = getCallerInfo();
		logger.debug({ key, caller, operation: "remove" }, "Storage remove");

		const [upstashAllowed, cloudflareAllowed] = await Promise.all([
			canUseUpstash(true),
			canUseCloudflare(true),
		]);

		const promises: Promise<void>[] = [memoryStorage.removeItem(key)];

		if (upstashAllowed) {
			promises.push(
				upstashStorage.removeItem(key).then(() => {
					counters.upstashWrites++;
					saveCounters();
				}),
			);
		}

		if (cloudflareAllowed) {
			promises.push(
				cloudflareStorage.removeItem(key).then(() => {
					counters.cloudflareWrites++;
					saveCounters();
				}),
			);
		}

		await Promise.all(promises);
	}

	async getKeys(base?: string): Promise<string[]> {
		return memoryStorage.getKeys(base);
	}

	async clear(base?: string): Promise<void> {
		await memoryStorage.clear(base);
	}
}

export const storage = createStorage({
	driver: new MultiLayerDriver(),
});

export { memoryStorage, upstashStorage, cloudflareStorage };

export { saveCountersNow as flushStorageCounters };

export async function getStorageStats() {
	await loadCounters();

	return {
		...counters,
		limits: DAILY_LIMITS,
		upstashUsagePercent: Math.round(
			((counters.upstashReads + counters.upstashWrites) /
				DAILY_LIMITS.upstashRequests) *
				100,
		),
		cloudflareReadUsagePercent: Math.round(
			(counters.cloudflareReads / DAILY_LIMITS.cloudflareReads) * 100,
		),
		cloudflareWriteUsagePercent: Math.round(
			(counters.cloudflareWrites / DAILY_LIMITS.cloudflareWrites) * 100,
		),
	};
}

if (typeof process !== "undefined") {
	// Auto-flush counters on graceful shutdown
	const shutdown = async () => {
		logger.info("Shutting down - flushing storage counters...");
		await saveCountersNow();
	};

	process.on("SIGTERM", shutdown);
	process.on("SIGINT", shutdown);
	process.on("beforeExit", shutdown);
}
