import { SimpleCsrfProtectionHandlerPlugin } from "@orpc/server/plugins";
import { env } from "@trektoeic/env";
/**
 * CSRF protection plugin that helps prevent Cross-Site Request Forgery attacks
 * by validating tokens in requests
 */
export const csrfProtection = () => {
	if (env.NODE_ENV === "development") {
		return null;
	}

	return new SimpleCsrfProtectionHandlerPlugin();
};
