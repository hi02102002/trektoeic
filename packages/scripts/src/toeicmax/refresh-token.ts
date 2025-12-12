// with-script scripts/toeicmax/refresh-token.ts
import { refreshToken } from "@trektoeic/crawler/toeic-max/funcs";

const main = async () => {
	await refreshToken();
};

main();
