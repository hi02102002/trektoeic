import fs from "node:fs";

export const getRandomProxy = () => {
	const proxies = [
		"104.207.56.217:3128",
		"35.237.174.141:80",
		"89.187.175.217:80",
		"14.34.137.10:3128",
		"89.254.220.165:7788",
		"51.159.0.236:2020",
		"203.34.28.166:80",
		"141.193.213.127:80",
		"45.76.121.215:6688",
		"186.251.255.61:31337",
		"75.119.203.49:32238",
		"188.255.244.53:1080",
		"193.151.136.223:8888",
		"108.162.193.43:80",
		"41.111.198.108:443",
		"72.167.221.157:7890",
		"128.199.64.85:80",
		"147.161.166.35:10326",
		"220.247.174.42:5678",
		"103.87.171.14:5678",
		"124.105.29.181:13629",
		"187.221.149.83:3128",
		"62.109.31.192:20000",
	];

	const randomIndex = Math.floor(Math.random() * proxies.length);

	return `http://${proxies[randomIndex]}`;
};

export async function runBatchesWithCount<TInput, TOutput>(
	items: TInput[],
	taskFn: (arg: TInput) => Promise<TOutput>,
	batchSize = 5,
	onBatchDone?: (batchIndex: number) => void,
): Promise<TOutput[]> {
	const results: TOutput[] = [];

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);
		const batchResults = await Promise.all(batch.map(taskFn));
		results.push(...batchResults);

		if (onBatchDone) {
			onBatchDone(i / batchSize + 1);
		}
	}

	return results;
}

export function writeToFile(filePath: string, value: unknown) {
	if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
		fs.rmSync(filePath, { recursive: true });
	}

	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath.substring(0, filePath.lastIndexOf("/")), {
			recursive: true,
		});
	}

	fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}
