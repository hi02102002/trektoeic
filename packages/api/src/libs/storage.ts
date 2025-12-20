import { env } from "@trektoeic/env";
import { createStorage } from "unstorage";
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http";

export const storage = createStorage({
	driver: cloudflareKVHTTPDriver({
		accountId: env.CLOUDFLARE_ACCOUNT_ID,
		namespaceId: env.CLOUDFLARE_KV_NAMESPACE_ID,
		apiToken: env.CLOUDFLARE_API_TOKEN_KV,
	}),
});
