// with-script scripts/toeicmax/get-all-sentences.ts

import { getAllSentences } from "@trektoeic/crawler/toeic-max";

const main = async () => {
	await getAllSentences();
};

main();
