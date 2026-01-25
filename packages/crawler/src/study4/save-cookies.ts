import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveCookies = async () => {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		executablePath: "/usr/bin/google-chrome",
		userDataDir: "/home/dev/.config/google-chrome-puppeteer",
		args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
	});

	const page = await browser.newPage();
	await page.goto("https://study4.com/my-account/tests/", {
		waitUntil: "networkidle2",
	});

	console.log("👉 Login manually, then press ENTER in terminal");

	process.stdin.once("data", async () => {
		const dirPath = path.join(__dirname, "study4");
		const filePath = path.join(dirPath, "cookies.json");

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		const cookies = await page.cookies();
		fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2));
		console.log("✅ Cookies saved");

		await browser.close();
		process.exit(0);
	});
};
