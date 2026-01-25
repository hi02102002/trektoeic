import fs from "fs";
import path from "path";
import type { Cookie } from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCookies = () => {
	const cookiesPath = path.join(__dirname, "cookies.json");

	if (!fs.existsSync(cookiesPath)) {
		throw new Error(
			"Cookies file does not exist. Please run the save-cookies script first.",
		);
	}

	const cookiesString = fs.readFileSync(cookiesPath, "utf-8");
	const cookies = JSON.parse(cookiesString) as Cookie[];

	return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
};
