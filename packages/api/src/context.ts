import { auth } from "@trektoeic/auth";

export async function createContext({ req }: { req: Request }) {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});
		return {
			session,
		};
	} catch {
		return {
			session: null,
		};
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>;
